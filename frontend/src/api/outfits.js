import { api } from './client';

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
 * Fetch all outfits with optional filters.
 * @param {Object} filters - { q, occasion, season, page, limit }
 * @returns {{ outfits: Outfit[], total: number, page: number, limit: number }}
 */
export function getOutfits(filters = {}) {
  return api.get(`/outfits${toQuery(filters)}`);
}

/**
 * Fetch a single outfit by ID with all items populated.
 * @returns {Outfit & { itemIds: Item[] }}
 */
export function getOutfitById(id) {
  return api.get(`/outfits/${id}`);
}

// ── Create & Update ───────────────────────────────────────────────────────────

/**
 * Create a new outfit.
 * @param {Object} data - { name, description?, itemIds?, occasion?, season?, coverImage?, canvas? }
 * @returns {Outfit}
 */
export function createOutfit(data) {
  return api.post('/outfits', data);
}

/**
 * Update an existing outfit's fields (partial update).
 * @param {string} id
 * @param {Object} data
 * @returns {Outfit}
 */
export function updateOutfit(id, data) {
  return api.patch(`/outfits/${id}`, data);
}

/**
 * Delete an outfit by ID.
 * @returns {{ message: string }}
 */
export function deleteOutfit(id) {
  return api.delete(`/outfits/${id}`);
}

// ── AI Generation ─────────────────────────────────────────────────────────────

/**
 * Ask the backend to generate outfit suggestions from the user's wardrobe.
 * Uses rule-based color harmony + style compatibility scoring.
 * Suggestions are NOT saved — client decides whether to save.
 *
 * @param {Object} opts - { occasion?, season?, count?, itemIds? }
 * @returns {{ suggestions: Array<{ items: Item[], score: number, colorHarmony: string }> }}
 */
export function generateOutfits(opts = {}) {
  return api.post('/outfits/generate', opts);
}

// ── Bulk Migration ────────────────────────────────────────────────────────────

/**
 * Bulk-create outfits (for localStorage → cloud migration).
 * @param {Outfit[]} outfits
 * @returns {{ created: number }}
 */
export function bulkCreateOutfits(outfits) {
  return api.post('/outfits/bulk', { outfits });
}
