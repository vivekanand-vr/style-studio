import { useState, useEffect, useCallback } from 'react';
import {
  getItemById,
  updateItem,
  deleteItem,
  togglePurchased,
  toggleFavorite,
} from '../api/items';

/**
 * useItem — loads and manages a single item by ID.
 *
 * @param {string} id - MongoDB item ID (from route params)
 *
 * Usage:
 *   const { item, loading, error, update, remove, toggleBought, toggleFav } = useItem(id);
 */
export function useItem(id) {
  const [item, setItem]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getItemById(id);
      setItem(data);
    } catch (err) {
      setError(err.message);
      setItem(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // ── Mutations ───────────────────────────────────────────────────────────────

  const update = useCallback(async (data) => {
    const updated = await updateItem(id, data);
    setItem(updated);
    return updated;
  }, [id]);

  const remove = useCallback(async () => {
    await deleteItem(id);
    setItem(null);
  }, [id]);

  const toggleBought = useCallback(async () => {
    const { purchased } = await togglePurchased(id);
    setItem((prev) => prev ? { ...prev, purchased } : prev);
    return purchased;
  }, [id]);

  const toggleFav = useCallback(async () => {
    const { favorite } = await toggleFavorite(id);
    setItem((prev) => prev ? { ...prev, favorite } : prev);
    return favorite;
  }, [id]);

  return {
    item,
    loading,
    error,
    refresh: fetch,
    // Mutations
    update,
    remove,
    toggleBought,
    toggleFav,
  };
}
