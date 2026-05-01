import { api } from './client';

/**
 * Get the full price history for an item, plus computed stats.
 *
 * @param {string} itemId - MongoDB item ID
 * @returns {{
 *   item: { _id, title, price, currency, sourceDomain },
 *   history: Array<{ price, currency, source, fetchedAt, inStock }>,
 *   stats: { current, lowest, highest, lowestDate, changeFromFirst } | null
 * }}
 */
export function getPriceHistory(itemId) {
  return api.get(`/prices/${itemId}`);
}

/**
 * Manually trigger a price refresh for an item.
 * Works only for API-backed sources (Amazon, Flipkart).
 * For other stores, returns a message explaining the extension-based approach.
 *
 * @param {string} itemId
 * @returns {{ itemId, previousPrice, newPrice, changed, dropped } | { message: string }}
 */
export function triggerPriceCheck(itemId) {
  return api.post('/prices/check', { itemId });
}
