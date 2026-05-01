import { useState, useEffect, useCallback } from 'react';
import { getOutfitById, updateOutfit, deleteOutfit } from '../api/outfits';

/**
 * useOutfit — loads and manages a single outfit by ID.
 * The outfit's itemIds are populated by the backend (full Item objects).
 *
 * @param {string} id - MongoDB outfit ID (from route params)
 *
 * Usage:
 *   const { outfit, loading, error, update, remove } = useOutfit(id);
 */
export function useOutfit(id) {
  const [outfit, setOutfit]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getOutfitById(id);
      setOutfit(data);
    } catch (err) {
      setError(err.message);
      setOutfit(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // ── Mutations ───────────────────────────────────────────────────────────────

  const update = useCallback(async (data) => {
    const updated = await updateOutfit(id, data);
    setOutfit(updated);
    return updated;
  }, [id]);

  const remove = useCallback(async () => {
    await deleteOutfit(id);
    setOutfit(null);
  }, [id]);

  return {
    outfit,
    loading,
    error,
    refresh: fetch,
    // Mutations
    update,
    remove,
  };
}
