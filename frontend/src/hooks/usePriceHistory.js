import { useState, useEffect, useCallback } from 'react';
import { getPriceHistory, triggerPriceCheck } from '../api/prices';

/**
 * usePriceHistory — loads price history and stats for a single item.
 *
 * @param {string} itemId - MongoDB item ID
 *
 * Usage:
 *   const { history, stats, item, loading, error, refresh, checkPrice, checking } =
 *     usePriceHistory(itemId);
 *
 * Returned stats shape:
 *   { current, lowest, highest, lowestDate, changeFromFirst }
 *   (null if no price history exists yet)
 */
export function usePriceHistory(itemId) {
  const [history, setHistory]   = useState([]);
  const [stats, setStats]       = useState(null);
  const [item, setItem]         = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  // Separate loading state for the manual price check so the UI can show
  // a spinner on just the "Check Now" button without blocking the chart
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  const fetch = useCallback(async () => {
    if (!itemId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPriceHistory(itemId);
      setItem(data.item);
      setHistory(data.history);
      setStats(data.stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  /**
   * Manually trigger a price refresh from the retailer API.
   * Only works for Amazon / Flipkart items; returns a message otherwise.
   */
  const checkPrice = useCallback(async () => {
    if (!itemId) return;
    setChecking(true);
    setCheckResult(null);
    try {
      const result = await triggerPriceCheck(itemId);
      setCheckResult(result);
      // If the price actually changed, re-fetch the full history
      if (result?.changed) {
        await fetch();
      }
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setChecking(false);
    }
  }, [itemId, fetch]);

  return {
    item,
    history,
    stats,
    loading,
    error,
    refresh: fetch,
    // Manual price check
    checkPrice,
    checking,
    checkResult,
  };
}
