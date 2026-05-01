const Outfit = require('../models/Outfit');
const Item = require('../models/Item');
const { generateOutfits } = require('../services/outfitGenerator');

// ── GET /outfits ──────────────────────────────────────────────────────────────
async function getOutfits(req, res, next) {
  try {
    const { q, occasion, season, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (q) filter.$text = { $search: q };
    if (occasion) filter.occasion = occasion;
    if (season) filter.season = season;

    const skip = (Number(page) - 1) * Number(limit);

    const [outfits, total] = await Promise.all([
      Outfit.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Outfit.countDocuments(filter),
    ]);

    res.json({ outfits, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}

// ── GET /outfits/:id ──────────────────────────────────────────────────────────
async function getOutfitById(req, res, next) {
  try {
    const outfit = await Outfit.findById(req.params.id).populate('itemIds');
    if (!outfit) return res.status(404).json({ error: 'Outfit not found' });
    res.json(outfit);
  } catch (err) {
    next(err);
  }
}

// ── POST /outfits ─────────────────────────────────────────────────────────────
async function createOutfit(req, res, next) {
  try {
    const outfit = await Outfit.create(req.body);
    res.status(201).json(outfit);
  } catch (err) {
    next(err);
  }
}

// ── PATCH /outfits/:id ────────────────────────────────────────────────────────
async function updateOutfit(req, res, next) {
  try {
    const outfit = await Outfit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!outfit) return res.status(404).json({ error: 'Outfit not found' });
    res.json(outfit);
  } catch (err) {
    next(err);
  }
}

// ── DELETE /outfits/:id ───────────────────────────────────────────────────────
async function deleteOutfit(req, res, next) {
  try {
    const outfit = await Outfit.findByIdAndDelete(req.params.id);
    if (!outfit) return res.status(404).json({ error: 'Outfit not found' });
    res.json({ message: 'Outfit deleted' });
  } catch (err) {
    next(err);
  }
}

// ── POST /outfits/generate ────────────────────────────────────────────────────
// Body: { occasion?, season?, count?, itemIds? }
// Returns generated outfit suggestions (not saved — client decides to save)
async function generateOutfit(req, res, next) {
  try {
    const { occasion, season, count = 5, itemIds } = req.body;

    // Load items — if specific IDs provided use those, otherwise load all
    let items;
    if (Array.isArray(itemIds) && itemIds.length > 0) {
      items = await Item.find({ _id: { $in: itemIds } });
    } else {
      const filter = {};
      if (occasion) filter.occasion = occasion;
      items = await Item.find(filter);
    }

    if (items.length < 2) {
      return res.status(400).json({ error: 'Need at least 2 items in wardrobe to generate outfits' });
    }

    const suggestions = generateOutfits(items, { occasion, season, count });

    res.json({ suggestions });
  } catch (err) {
    next(err);
  }
}

// ── POST /outfits/bulk (migration from localStorage) ──────────────────────────
async function bulkCreate(req, res, next) {
  try {
    const { outfits } = req.body;
    if (!Array.isArray(outfits)) return res.status(400).json({ error: 'outfits array required' });

    const docs = outfits.map(({ id, _id, ...rest }) => rest);
    const created = await Outfit.insertMany(docs, { ordered: false });
    res.status(201).json({ created: created.length });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getOutfits,
  getOutfitById,
  createOutfit,
  updateOutfit,
  deleteOutfit,
  generateOutfit,
  bulkCreate,
};
