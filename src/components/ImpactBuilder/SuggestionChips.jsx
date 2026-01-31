/**
 * Clickable suggestion chips
 */
export default function SuggestionChips({ suggestions, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {suggestions.map((suggestion, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(suggestion)}
          className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
        >
          {suggestion.length > 30 ? suggestion.substring(0, 30) + '...' : suggestion}
        </button>
      ))}
    </div>
  );
}
