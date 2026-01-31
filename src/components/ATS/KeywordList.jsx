import { useState } from 'react';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';

/**
 * Expandable keyword list component
 */
export default function KeywordList({ title, keywords, type, icon }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const totalCount =
    keywords.technical.length +
    keywords.phrases.length +
    keywords.general.length;

  if (totalCount === 0) return null;

  const isMatched = type === 'matched';
  const bgColor = isMatched ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isMatched ? 'border-green-200' : 'border-red-200';
  const iconColor = isMatched ? 'text-green-600' : 'text-red-500';
  const badgeColor = isMatched
    ? 'bg-green-100 text-green-700'
    : 'bg-red-100 text-red-700';

  return (
    <div className={`rounded-lg border ${borderColor} ${bgColor} overflow-hidden`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-black/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isMatched ? (
            <Check size={18} className={iconColor} />
          ) : (
            <X size={18} className={iconColor} />
          )}
          <span className="font-medium text-gray-800">{title}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${badgeColor}`}>
            {totalCount}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp size={18} className="text-gray-500" />
        ) : (
          <ChevronDown size={18} className="text-gray-500" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-2">
          {/* Technical Skills */}
          {keywords.technical.length > 0 && (
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Technical Skills
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {keywords.technical.map((keyword, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-1 rounded ${
                      isMatched
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Phrases */}
          {keywords.phrases.length > 0 && (
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Key Phrases
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {keywords.phrases.map((phrase, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-1 rounded ${
                      isMatched
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {phrase}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* General Keywords */}
          {keywords.general.length > 0 && (
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                General Keywords
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {keywords.general.map((keyword, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-1 rounded ${
                      isMatched
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
