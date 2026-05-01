const Item = require('../models/Item');
const PriceHistory = require('../models/PriceHistory');
const { resolveProductUrl } = require('../services/productImport');
const { extractDominantColor } = require('../services/colorAnalysis');
const { extractFromText: aiExtractFromText } = require('../services/aiExtract');
const { autoCategorize } = require('../services/autoCategorize');

// ── GET /items ────────────────────────────────────────────────────────────────
async function getItems(req, res, next) {
  try {
    const {
      q,
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      purchased,
      favorite,
      page = 1,
      limit = 100,
    } = req.query;

    const filter = {};

    // Text search (uses MongoDB text index)
    if (q) {
      filter.$text = { $search: q };
    }

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (minPrice !== undefined) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice !== undefined) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (purchased !== undefined) filter.purchased = purchased === 'true';
    if (favorite !== undefined) filter.favorite = favorite === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Item.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Item.countDocuments(filter),
    ]);

    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}

// ── GET /items/:id ────────────────────────────────────────────────────────────
async function getItemById(req, res, next) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

// ── POST /items ───────────────────────────────────────────────────────────────
async function createItem(req, res, next) {
  try {
    const data = req.body;

    // Extract domain from sourceLink
    if (data.sourceLink) {
      try {
        data.sourceDomain = new URL(data.sourceLink).hostname.replace(/^www\./, '');
      } catch {}
    }

    const item = await Item.create(data);

    // Fire-and-forget: extract dominant color from image in background
    if (item.image) {
      extractDominantColor(item.image)
        .then((colorData) => {
          if (colorData) {
            Item.findByIdAndUpdate(item._id, {
              colorVector: colorData.rgb,
              colorHsl: colorData.hsl,
              colorHex: colorData.hex,
              colorName: colorData.colorName,
              isNeutralColor: colorData.isNeutral,
            }).catch(() => {});
          }
        })
        .catch(() => {});
    }

    // Record initial price in history
    if (item.price != null) {
      PriceHistory.create({
        itemId: item._id,
        price: item.price,
        currency: item.currency,
        source: 'manual',
      }).catch(() => {});
    }

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

// ── PATCH /items/:id ──────────────────────────────────────────────────────────
async function updateItem(req, res, next) {
  try {
    const data = req.body;

    if (data.sourceLink) {
      try {
        data.sourceDomain = new URL(data.sourceLink).hostname.replace(/^www\./, '');
      } catch {}
    }

    const item = await Item.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Re-extract color if image changed
    if (data.image && data.image !== item.image) {
      extractDominantColor(data.image)
        .then((colorData) => {
          if (colorData) {
            Item.findByIdAndUpdate(item._id, {
              colorVector: colorData.rgb,
              colorHsl: colorData.hsl,
              colorHex: colorData.hex,
              colorName: colorData.colorName,
              isNeutralColor: colorData.isNeutral,
            }).catch(() => {});
          }
        })
        .catch(() => {});
    }

    // Record new price in history if it changed
    if (data.price != null) {
      PriceHistory.create({
        itemId: item._id,
        price: data.price,
        currency: data.currency || item.currency,
        source: 'manual',
      }).catch(() => {});
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
}

// ── DELETE /items/:id ─────────────────────────────────────────────────────────
async function deleteItem(req, res, next) {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Cascade: remove from all outfits that reference this item
    const Outfit = require('../models/Outfit');
    await Outfit.updateMany(
      { itemIds: item._id },
      {
        $pull: {
          itemIds: item._id,
          'canvas.nodes': { itemId: item._id },
        },
      }
    );

    // Remove price history
    await PriceHistory.deleteMany({ itemId: item._id });

    res.json({ message: 'Item deleted' });
  } catch (err) {
    next(err);
  }
}

// ── PATCH /items/:id/toggle-purchased ─────────────────────────────────────────
async function togglePurchased(req, res, next) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    item.purchased = !item.purchased;
    await item.save();
    res.json({ purchased: item.purchased });
  } catch (err) {
    next(err);
  }
}

// ── PATCH /items/:id/toggle-favorite ──────────────────────────────────────────
async function toggleFavorite(req, res, next) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    item.favorite = !item.favorite;
    await item.save();
    res.json({ favorite: item.favorite });
  } catch (err) {
    next(err);
  }
}

// ── POST /items/import-url ────────────────────────────────────────────────────
async function importFromUrl(req, res, next) {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'url is required' });

    const productData = await resolveProductUrl(url);
    // Returns pre-filled item fields — client displays the form pre-populated
    res.json(productData);
  } catch (err) {
    next(err);
  }
}

// ── POST /items/extract-text ─────────────────────────────────────────────────
async function extractFromText(req, res, next) {
  try {
    const { text } = req.body;
    const extracted = await aiExtractFromText(text);

    // Auto-suggest category/subcategory from the extracted title
    if (extracted.title && !extracted.category) {
      const { category, subcategory } = autoCategorize(extracted.title);
      if (category) extracted.category = category;
      if (subcategory) extracted.subcategory = subcategory;
    }

    res.json(extracted);
  } catch (err) {
    next(err);
  }
}

// ── POST /items/bulk (migration from localStorage) ────────────────────────────
async function bulkCreate(req, res, next) {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'items array required' });

    // Strip client-side IDs and let MongoDB generate new ones
    const docs = items.map(({ id, _id, ...rest }) => rest);
    const created = await Item.insertMany(docs, { ordered: false });
    res.status(201).json({ created: created.length });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  togglePurchased,
  toggleFavorite,
  importFromUrl,
  extractFromText,
  bulkCreate,
};
