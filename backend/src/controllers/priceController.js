const Item = require('../models/Item');
const PriceHistory = require('../models/PriceHistory');
const { checkItemPrice } = require('../services/priceJob');

// ── GET /prices/:itemId ───────────────────────────────────────────────────────
async function getPriceHistory(req, res, next) {
  try {
    const item = await Item.findById(req.params.itemId).select('title price currency sourceDomain');
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const history = await PriceHistory.find({ itemId: req.params.itemId })
      .sort({ fetchedAt: -1 })
      .limit(365); // max 1 year of daily checks

    // Compute stats
    const prices = history.map((h) => h.price).filter(Boolean);
    const stats =
      prices.length > 0
        ? {
            current: prices[0],
            lowest: Math.min(...prices),
            highest: Math.max(...prices),
            lowestDate: history.find((h) => h.price === Math.min(...prices))?.fetchedAt,
            changeFromFirst: prices.length > 1
              ? ((prices[0] - prices[prices.length - 1]) / prices[prices.length - 1]) * 100
              : 0,
          }
        : null;

    res.json({ item, history, stats });
  } catch (err) {
    next(err);
  }
}

// ── POST /prices/check ────────────────────────────────────────────────────────
// Manually trigger a price refresh for a specific item
async function triggerPriceCheck(req, res, next) {
  try {
    const { itemId } = req.body;
    if (!itemId) return res.status(400).json({ error: 'itemId is required' });

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const result = await checkItemPrice(item);

    if (!result) {
      return res.json({
        message: 'Price check not available for this item (no API-backed source)',
      });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getPriceHistory, triggerPriceCheck };
