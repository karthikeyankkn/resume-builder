import SuggestionChips from './SuggestionChips';

/**
 * Dynamic form based on detected pattern template
 */
export default function TemplateForm({ pattern, values, onChange }) {
  if (!pattern?.template?.fields) return null;

  const { fields } = pattern.template;

  return (
    <div className="space-y-4">
      {/* Template preview */}
      <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg font-mono">
        {pattern.template.base}
      </div>

      {/* Form fields */}
      <div className="grid gap-4">
        {Object.entries(fields).map(([fieldName, field]) => (
          <div key={fieldName}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === 'select' ? (
              <select
                value={values[fieldName] || ''}
                onChange={(e) => onChange(fieldName, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              >
                <option value="">Select {field.label.toLowerCase()}...</option>
                {field.options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'number' ? (
              <input
                type="number"
                value={values[fieldName] || ''}
                onChange={(e) => onChange(fieldName, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                min="1"
              />
            ) : (
              <input
                type="text"
                value={values[fieldName] || ''}
                onChange={(e) => onChange(fieldName, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
            )}

            {/* Suggestions */}
            {field.suggestions && (
              <SuggestionChips
                suggestions={field.suggestions}
                onSelect={(suggestion) => onChange(fieldName, suggestion)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
