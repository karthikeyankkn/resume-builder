import { AlertTriangle, Lightbulb, Info, CheckCircle } from 'lucide-react';

/**
 * Suggestion card for ATS recommendations
 */
export default function SuggestionCard({ suggestion }) {
  const { type, icon, title, message, keywords } = suggestion;

  // Style mapping based on suggestion type
  const styles = {
    critical: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: <AlertTriangle size={18} className="text-amber-600" />,
      titleColor: 'text-amber-800'
    },
    important: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <Lightbulb size={18} className="text-blue-600" />,
      titleColor: 'text-blue-800'
    },
    optional: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: <Info size={18} className="text-gray-600" />,
      titleColor: 'text-gray-800'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircle size={18} className="text-green-600" />,
      titleColor: 'text-green-800'
    },
    warning: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <AlertTriangle size={18} className="text-red-600" />,
      titleColor: 'text-red-800'
    }
  };

  const style = styles[type] || styles.optional;

  return (
    <div className={`rounded-lg border ${style.border} ${style.bg} p-3`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {style.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium ${style.titleColor}`}>
            {title}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {message}
          </p>
          {keywords && keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-white rounded border border-gray-200 text-gray-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
