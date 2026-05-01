import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  togglePurchased,
  toggleFavorite,
  importFromUrl,
  bulkCreateItems,
} from '../api/items';

/**
 * useItems — manages a filtered/paginated list of wardrobe items.
 *
 * @param {Object} initialFilters - { q, category, subcategory, brand, minPrice, maxPrice, purchased, favorite }
 *
 * Usage:
 *   const { items, total, loading, error, setFilters, refresh,
 *           create, update, remove, toggleBought, toggleFav } = useItems();
 */
export function useItems(initialFilters = {}) {
  const [items, setItems]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  // Keep a stable ref to the latest filters for use inside callbacks
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetch = useCallback(async (overrideFilters) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getItems(overrideFilters ?? filtersRef.current);
      setItems(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch whenever filters change
  useEffect(() => {
    fetch(filters);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Mutations ───────────────────────────────────────────────────────────────

  const create = useCallback(async (data) => {
    const item = await createItem(data);
    // Prepend new item optimistically, then refresh to get accurate totals
    setItems((prev) => [item, ...prev]);
    setTotal((t) => t + 1);
    return item;
  }, []);

  const update = useCallback(async (id, data) => {
    const updated = await updateItem(id, data);
    setItems((prev) => prev.map((i) => (i._id === id ? updated : i)));
    return updated;
  }, []);

  const remove = useCallback(async (id) => {
    await deleteItem(id);
    setItems((prev) => prev.filter((i) => i._id !== id));
    setTotal((t) => t - 1);
  }, []);

  const toggleBought = useCallback(async (id) => {
    const { purchased } = await togglePurchased(id);
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, purchased } : i))
    );
    return purchased;
  }, []);

  const toggleFav = useCallback(async (id) => {
    const { favorite } = await toggleFavorite(id);
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, favorite } : i))
    );
    return favorite;
  }, []);

  const importUrl = useCallback((url) => importFromUrl(url), []);

  const bulkMigrate = useCallback(async (localItems) => {
    const result = await bulkCreateItems(localItems);
    await fetch();
    return result;
  }, [fetch]);

  return {
    items,
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
    toggleBought,
    toggleFav,
    importUrl,
    bulkMigrate,
  };
}
