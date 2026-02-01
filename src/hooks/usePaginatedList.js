import { useState, useMemo, useCallback } from 'react';

/**
 * Hook for paginated list rendering to prevent performance issues with large lists.
 *
 * Instead of full virtualization (which adds complexity), this hook implements
 * a "show more" pattern that limits initially rendered items and expands on demand.
 * This provides good performance for lists up to several hundred items.
 *
 * @param {Array} items - Full array of items
 * @param {Object} options - Configuration options
 * @param {number} options.initialCount - Initial number of items to show (default: 20)
 * @param {number} options.incrementCount - Number of items to add when "Show more" is clicked (default: 20)
 * @param {number} options.threshold - Show pagination controls when items exceed this (default: 15)
 * @returns {Object} - Paginated list state and controls
 */
export function usePaginatedList(items = [], options = {}) {
  const {
    initialCount = 20,
    incrementCount = 20,
    threshold = 15,
  } = options;

  const [visibleCount, setVisibleCount] = useState(initialCount);

  const totalCount = items.length;
  const needsPagination = totalCount > threshold;

  const visibleItems = useMemo(() => {
    if (!needsPagination) {
      return items;
    }
    return items.slice(0, visibleCount);
  }, [items, visibleCount, needsPagination]);

  const hasMore = visibleCount < totalCount;
  const hiddenCount = Math.max(0, totalCount - visibleCount);

  const showMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + incrementCount, totalCount));
  }, [incrementCount, totalCount]);

  const showAll = useCallback(() => {
    setVisibleCount(totalCount);
  }, [totalCount]);

  const showLess = useCallback(() => {
    setVisibleCount(initialCount);
  }, [initialCount]);

  const reset = useCallback(() => {
    setVisibleCount(initialCount);
  }, [initialCount]);

  return {
    visibleItems,
    totalCount,
    visibleCount: Math.min(visibleCount, totalCount),
    hasMore,
    hiddenCount,
    needsPagination,
    showMore,
    showAll,
    showLess,
    reset,
  };
}

export default usePaginatedList;
