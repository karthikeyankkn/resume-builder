import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Pagination controls for large lists.
 * Shows "Show more" / "Show less" buttons to control visible items.
 */
export default function ListPagination({
  visibleCount,
  totalCount,
  hiddenCount,
  hasMore,
  onShowMore,
  onShowAll,
  onShowLess,
}) {
  if (totalCount <= 15) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-3 py-3 border-t border-gray-200 mt-2">
      {hasMore ? (
        <>
          <button
            onClick={onShowMore}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
            Show more ({hiddenCount} hidden)
          </button>
          {hiddenCount > 20 && (
            <button
              onClick={onShowAll}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Show all
            </button>
          )}
        </>
      ) : (
        <button
          onClick={onShowLess}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronUp className="w-4 h-4" />
          Show less
        </button>
      )}
      <span className="text-xs text-gray-400">
        Showing {visibleCount} of {totalCount}
      </span>
    </div>
  );
}
