/**
 * Price Job Service
 * Nightly cron job that refreshes prices for API-backed items (Amazon, Flipkart).
 * For extension-tracked items, prices are updated when the user visits the page.
 */

const cron = require('node-cron');
const Item = require('../models/Item');
const PriceHistory = require('../models/PriceHistory');
const { getProductFromAmazon } = require('./amazonApi');
const { getProductFromFlipkart } = require('./flipkartApi');

let isRunning = false;

/**
 * Check and update the price of a single item.
 * Returns the new price history entry or null if no API is available.
 */
async function checkItemPrice(item) {
  const domain = item.sourceDomain || '';
  let newPrice = null;
  let source = null;

  if (/amazon\.(in|com)$/.test(domain) && item.sourceLink) {
    const asin = extractAsin(item.sourceLink);
    if (asin) {
      const data = await getProductFromAmazon(asin);
      if (data?.price != null) {
        newPrice = data.price;
        source = 'amazon_api';
      }
    }
  } else if (/flipkart\.com$/.test(domain) && item.sourceLink) {
    const data = await getProductFromFlipkart(item.sourceLink);
    if (data?.price != null) {
      newPrice = data.price;
      source = 'flipkart_api';
    }
  }

  if (newPrice == null) return null;

  const historyEntry = await PriceHistory.create({
    itemId: item._id,
    price: newPrice,
    currency: item.currency || 'INR',
    source,
  });

  // Update item's current price
  const priceChanged = newPrice !== item.price;
  if (priceChanged) {
    await Item.findByIdAndUpdate(item._id, { price: newPrice });
  }

  return {
    itemId: item._id,
    previousPrice: item.price,
    newPrice,
    changed: priceChanged,
    dropped: newPrice < item.price,
    historyEntry,
  };
}

/**
 * Scheduled job: runs daily at 2:00 AM.
 * Processes all API-backed items in batches to avoid overloading external APIs.
 */
function startPriceJob() {
  cron.schedule('0 2 * * *', async () => {
    if (isRunning) {
      console.log('[priceJob] Previous run still in progress, skipping');
      return;
    }

    isRunning = true;
    console.log('[priceJob] Starting nightly price check...');

    try {
      // Only process items that have an Amazon or Flipkart source link
      const items = await Item.find({
        purchased: false,
        sourceDomain: { $in: [/amazon\.in/, /amazon\.com/, /flipkart\.com/] },
        sourceLink:   { $exists: true, $ne: '' },
      });

      console.log(`[priceJob] Checking prices for ${items.length} items`);

      let updated = 0;
      let dropped = 0;

      for (const item of items) {
        try {
          const result = await checkItemPrice(item);
          if (result?.changed) {
            updated++;
            if (result.dropped) dropped++;
          }
          // Small delay between API calls to be respectful
          await sleep(500);
        } catch (err) {
          console.warn(`[priceJob] Failed for item ${item._id}:`, err.message);
        }
      }

      console.log(`[priceJob] Done. Updated: ${updated}, Price drops: ${dropped}`);
    } catch (err) {
      console.error('[priceJob] Fatal error:', err);
    } finally {
      isRunning = false;
    }
  });

  console.log('[priceJob] Scheduled: daily at 2:00 AM');
}

function extractAsin(url) {
  const match = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/);
  return match ? match[1] : null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { startPriceJob, checkItemPrice };
