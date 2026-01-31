import { getStrengthLabel } from '../../utils/impactTemplates';

/**
 * Horizontal progress bar showing statement strength
 */
export default function StrengthMeter({ score, showLabel = true, size = 'default' }) {
  const { label, color } = getStrengthLabel(score);

  const heights = {
    small: 'h-1.5',
    default: 'h-2.5',
    large: 'h-4'
  };

  const height = heights[size] || heights.default;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        {showLabel && (
          <>
            <span className="text-xs text-gray-500">Strength</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color }}>
                {label}
              </span>
              <span className="text-xs font-bold" style={{ color }}>
                {score}%
              </span>
            </div>
          </>
        )}
      </div>

      {/* Progress bar */}
      <div className={`w-full ${height} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ease-out`}
          style={{
            width: `${score}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
}
