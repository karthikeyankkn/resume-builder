import { Zap, Check } from 'lucide-react';
import { getStrengthScore, detectWeakPattern, getStrengthLabel } from '../../utils/impactTemplates';

/**
 * Small inline indicator showing bullet point strength
 */
export default function InlineStrengthIndicator({ text, onStrengthen }) {
  const score = getStrengthScore(text);
  const weakPattern = detectWeakPattern(text);
  const { color } = getStrengthLabel(score);

  // Don't show indicator for empty or very short text
  if (!text || text.trim().length < 10) return null;

  // Show strengthen button for weak statements
  if (score < 50 && weakPattern) {
    return (
      <button
        onClick={onStrengthen}
        className="flex items-center gap-1 px-2 py-1 text-xs bg-amber-50 text-amber-700 rounded hover:bg-amber-100 transition-colors border border-amber-200 whitespace-nowrap"
        title="Click to strengthen this statement"
      >
        <Zap size={12} />
        <span>Strengthen</span>
      </button>
    );
  }

  // Show check for strong statements
  if (score >= 70) {
    return (
      <div
        className="flex items-center gap-1 px-2 py-1 text-xs text-green-600"
        title={`Strong statement (${score}%)`}
      >
        <Check size={14} />
      </div>
    );
  }

  // Show neutral indicator for medium statements
  return (
    <div
      className="w-2 h-2 rounded-full"
      style={{ backgroundColor: color }}
      title={`Statement strength: ${score}%`}
    />
  );
}
