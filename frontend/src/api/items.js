import { api } from './client';

/**
 * Build a query string from a filters object, omitting empty/null values.
 */
function toQuery(params = {}) {
  const qs = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '') {
      qs.set(key, val);
    }
  }
  const str = qs.toString();
  return str ? `?${str}` : '';
}

// ── List & Search ─────────────────────────────────────────────────────────────

/**
 * Fetch all items with optional filters.
 * @param {Object} filters - { q, category, subcategory, brand, minPrice, maxPrice, purchased, favorite, page, limit }
 * @returns {{ items: Item[], total: number, page: number, limit: number }}
 */
export function getItems(filters = {}) {
  return api.get(`/items${toQuery(filters)}`);
}

/**
 * Fetch a single item by MongoDB ID.
 * @returns {Item}
 */
export function getItemById(id) {
  return api.get(`/items/${id}`);
}

// ── Create & Update ───────────────────────────────────────────────────────────

/**
 * Create a new item.
 * @param {Object} data - Item fields
 * @returns {Item}
 */
export function createItem(data) {
  return api.post('/items', data);
}

/**
 * Update an existing item's fields (partial update).
 * @param {string} id
 * @param {Object} data - Fields to update
 * @returns {Item}
 */
export function updateItem(id, data) {
  return api.patch(`/items/${id}`, data);
}

/**
 * Delete an item by ID. Also cascades removal from outfits.
 * @returns {{ message: string }}
 */
export function deleteItem(id) {
  return api.delete(`/items/${id}`);
}

// ── Toggles ───────────────────────────────────────────────────────────────────

/**
 * Toggle the purchased status of an item.
 * @returns {{ purchased: boolean }}
 */
export function togglePurchased(id) {
  return api.patch(`/items/${id}/toggle-purchased`);
}

/**
 * Toggle the favorite status of an item.
 * @returns {{ favorite: boolean }}
 */
export function toggleFavorite(id) {
  return api.patch(`/items/${id}/toggle-favorite`);
}

// ── Import ────────────────────────────────────────────────────────────────────

/**
 * Import product details from a URL.
 * - Amazon / Flipkart URLs → official affiliate APIs (returns full data)
 * - Other URLs → returns { _importMethod: 'manual', _message } instructing fallback
 *
 * @param {string} url - Product page URL
 * @returns {Partial<Item> & { _importMethod: string }}
 */
export function importFromUrl(url) {
  return api.post('/items/import-url', { url });
}

/**
 * Extract product fields from raw pasted text using AI (GPT-4o mini).
 * Call this when the user does Ctrl+A, Ctrl+C on a product page.
 *
 * Note: This hits the /items/extract-text endpoint (requires OPENAI_API_KEY in backend .env).
 * @param {string} text - Raw page text
 * @returns {Partial<Item>}
 */
export function extractFromText(text) {
  return api.post('/items/extract-text', { text });
}

// ── Bulk Migration ────────────────────────────────────────────────────────────

/**
 * Bulk-create items (for localStorage → cloud migration).
 * @param {Item[]} items
 * @returns {{ created: number }}
 */
export function bulkCreateItems(items) {
  return api.post('/items/bulk', { items });
}
