import { getScoreColor, getScoreLabel } from '../../utils/atsAnalyzer';

/**
 * Circular progress display for ATS score
 */
export default function ATSScoreDisplay({ score }) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  // SVG circle parameters
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center py-4">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold"
            style={{ color }}
          >
            {score}%
          </span>
          <span className="text-xs text-gray-500 mt-1">ATS Score</span>
        </div>
      </div>

      {/* Label below */}
      <div
        className="mt-3 px-4 py-1.5 rounded-full text-sm font-medium"
        style={{
          backgroundColor: `${color}20`,
          color: color
        }}
      >
        {label}
      </div>
    </div>
  );
}
