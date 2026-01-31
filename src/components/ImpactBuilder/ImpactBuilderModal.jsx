import { useState, useEffect } from 'react';
import { X, Zap, Check, ArrowRight, Sparkles } from 'lucide-react';
import {
  detectWeakPattern,
  generateStatement,
  getStrengthScore,
  getStrengthLabel,
  POWER_VERBS
} from '../../utils/impactTemplates';
import StrengthMeter from './StrengthMeter';
import TemplateForm from './TemplateForm';

/**
 * Impact Statement Builder Modal
 * Helps users transform weak bullet points into strong, quantified statements
 */
export default function ImpactBuilderModal({
  isOpen,
  onClose,
  initialText,
  onApply
}) {
  const [originalText, setOriginalText] = useState(initialText || '');
  const [detectedPattern, setDetectedPattern] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [generatedText, setGeneratedText] = useState('');
  const [activeVerbCategory, setActiveVerbCategory] = useState('leadership');

  // Detect pattern when initialText changes
  useEffect(() => {
    if (initialText) {
      setOriginalText(initialText);
      const pattern = detectWeakPattern(initialText);
      setDetectedPattern(pattern);
      setFieldValues({});
      setGeneratedText('');
    }
  }, [initialText]);

  // Update generated text when field values change
  useEffect(() => {
    if (detectedPattern) {
      const text = generateStatement(detectedPattern.pattern, fieldValues);
      setGeneratedText(text);
    }
  }, [fieldValues, detectedPattern]);

  const handleFieldChange = (fieldName, value) => {
    setFieldValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleApply = () => {
    if (generatedText && !generatedText.includes('[')) {
      onApply(generatedText);
      onClose();
    }
  };

  const originalStrength = getStrengthScore(originalText);
  const newStrength = getStrengthScore(generatedText);
  const originalLabel = getStrengthLabel(originalStrength);
  const newLabel = getStrengthLabel(newStrength);

  // Check if all required fields are filled
  const isComplete = detectedPattern
    ? Object.entries(detectedPattern.pattern.template.fields).every(
        ([key, field]) => !field.required || (fieldValues[key] && fieldValues[key].trim())
      )
    : false;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap size={20} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Impact Statement Builder
              </h2>
              <p className="text-sm text-gray-500">
                Transform weak statements into powerful achievements
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Original Statement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your current statement
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700">
              {originalText || 'No text provided'}
            </div>
            <div className="mt-2">
              <StrengthMeter score={originalStrength} size="small" />
            </div>
          </div>

          {detectedPattern ? (
            <>
              {/* Pattern Detected Notice */}
              <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
                <Sparkles size={20} className="text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-900">
                    Weak phrase detected!
                  </p>
                  <p className="text-sm text-purple-700">
                    Let's strengthen this using a proven template.
                  </p>
                </div>
              </div>

              {/* Template Form */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Fill in the details
                </label>
                <TemplateForm
                  pattern={detectedPattern.pattern}
                  values={fieldValues}
                  onChange={handleFieldChange}
                />
              </div>

              {/* Preview */}
              {generatedText && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div
                    className={`border rounded-lg px-4 py-3 ${
                      isComplete
                        ? 'bg-green-50 border-green-200 text-green-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    {generatedText}
                  </div>
                  <div className="mt-2">
                    <StrengthMeter score={newStrength} size="small" />
                  </div>

                  {/* Improvement indicator */}
                  {newStrength > originalStrength && (
                    <div className="flex items-center gap-2 mt-3 text-sm text-green-600">
                      <ArrowRight size={16} />
                      <span>
                        +{newStrength - originalStrength}% improvement
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Example */}
              {detectedPattern.pattern.examples?.[0] && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Example transformation
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-red-500 font-medium mt-0.5">
                        Before:
                      </span>
                      <span className="text-sm text-gray-600 line-through">
                        {detectedPattern.pattern.examples[0].before}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-green-600 font-medium mt-0.5">
                        After:
                      </span>
                      <span className="text-sm text-gray-800">
                        {detectedPattern.pattern.examples[0].after}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* No pattern detected - show power verbs */
            <div>
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4">
                <Check size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    No weak phrases detected
                  </p>
                  <p className="text-sm text-blue-700">
                    Here are some power verbs to make it even stronger.
                  </p>
                </div>
              </div>

              {/* Power verbs by category */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {Object.keys(POWER_VERBS).map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveVerbCategory(category)}
                      className={`px-3 py-1.5 text-xs rounded-full capitalize transition-colors ${
                        activeVerbCategory === category
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {POWER_VERBS[activeVerbCategory]?.map((verb, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-sm bg-purple-50 text-purple-700 rounded border border-purple-200"
                    >
                      {verb}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500">
            Tip: Include specific numbers and metrics for maximum impact
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            {detectedPattern && (
              <button
                onClick={handleApply}
                disabled={!isComplete}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Check size={16} />
                Apply to Resume
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
