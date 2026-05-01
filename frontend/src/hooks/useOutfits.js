import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getOutfits,
  createOutfit,
  updateOutfit,
  deleteOutfit,
  generateOutfits,
  bulkCreateOutfits,
} from '../api/outfits';

/**
 * useOutfits — manages the full list of outfits with optional filters.
 *
 * @param {Object} initialFilters - { q, occasion, season, page, limit }
 *
 * Usage:
 *   const { outfits, total, loading, error, setFilters, refresh,
 *           create, update, remove, generate, bulkMigrate } = useOutfits();
 */
export function useOutfits(initialFilters = {}) {
  const [outfits, setOutfits] = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetch = useCallback(async (overrideFilters) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getOutfits(overrideFilters ?? filtersRef.current);
      setOutfits(result.outfits);
      setTotal(result.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch(filters);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Mutations ───────────────────────────────────────────────────────────────

  const create = useCallback(async (data) => {
    const outfit = await createOutfit(data);
    setOutfits((prev) => [outfit, ...prev]);
    setTotal((t) => t + 1);
    return outfit;
  }, []);

  const update = useCallback(async (id, data) => {
    const updated = await updateOutfit(id, data);
    setOutfits((prev) => prev.map((o) => (o._id === id ? updated : o)));
    return updated;
  }, []);

  const remove = useCallback(async (id) => {
    await deleteOutfit(id);
    setOutfits((prev) => prev.filter((o) => o._id !== id));
    setTotal((t) => t - 1);
  }, []);

  /**
   * Generate AI outfit suggestions.
   * Returns suggestions but does NOT save them — call `create` to save one.
   * @param {Object} opts - { occasion?, season?, count?, itemIds? }
   * @returns {Array<{ items, score, colorHarmony }>}
   */
  const generate = useCallback(async (opts = {}) => {
    const { suggestions } = await generateOutfits(opts);
    return suggestions;
  }, []);

  const bulkMigrate = useCallback(async (localOutfits) => {
    const result = await bulkCreateOutfits(localOutfits);
    await fetch();
    return result;
  }, [fetch]);

  return {
    outfits,
    total,
    loading,
    error,
    filters,
    setFilters,
    refresh: fetch,
    // Mutations
    create,
    update,
    remove,
    generate,
    bulkMigrate,
  };
}
