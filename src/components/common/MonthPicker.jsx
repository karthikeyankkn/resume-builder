import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const MONTH_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function MonthPicker({
  value,
  onChange,
  placeholder = 'Select month',
  disabled = false,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    if (value) {
      const [year] = value.split('-');
      return parseInt(year, 10);
    }
    return new Date().getFullYear();
  });
  const containerRef = useRef(null);

  // Parse current value
  const selectedYear = value ? parseInt(value.split('-')[0], 10) : null;
  const selectedMonth = value ? parseInt(value.split('-')[1], 10) : null;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Update view year when value changes
  useEffect(() => {
    if (value) {
      const [year] = value.split('-');
      setViewYear(parseInt(year, 10));
    }
  }, [value]);

  const handleMonthSelect = (monthIndex) => {
    const month = String(monthIndex + 1).padStart(2, '0');
    onChange(`${viewYear}-${month}`);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  const displayValue = value
    ? `${MONTH_FULL[selectedMonth - 1]} ${selectedYear}`
    : '';

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input Display */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          form-input flex items-center justify-between cursor-pointer
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-primary-400'}
          ${isOpen ? 'border-primary-500 ring-2 ring-primary-100' : ''}
        `}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className={displayValue ? 'text-gray-900' : 'text-gray-400'}>
            {displayValue || placeholder}
          </span>
        </div>
        {value && !disabled && (
          <button
            onClick={handleClear}
            className="p-0.5 hover:bg-gray-100 rounded-full"
          >
            <X className="w-3.5 h-3.5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Dropdown Calendar */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-fadeIn">
          {/* Year Navigation */}
          <div className="flex items-center justify-between p-3 border-b bg-gray-50">
            <button
              onClick={() => setViewYear(viewYear - 1)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="font-semibold text-gray-900">{viewYear}</span>
            <button
              onClick={() => setViewYear(viewYear + 1)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              disabled={viewYear >= currentYear + 10}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Month Grid */}
          <div className="p-3 grid grid-cols-3 gap-2">
            {MONTHS.map((month, index) => {
              const isSelected = selectedYear === viewYear && selectedMonth === index + 1;
              const isCurrent = viewYear === currentYear && index === currentMonth;
              const isFuture = viewYear > currentYear || (viewYear === currentYear && index > currentMonth);

              return (
                <button
                  key={month}
                  onClick={() => handleMonthSelect(index)}
                  className={`
                    py-2 px-3 text-sm rounded-md transition-all
                    ${isSelected
                      ? 'bg-primary-600 text-white font-medium'
                      : isCurrent
                        ? 'bg-primary-50 text-primary-700 font-medium border border-primary-200'
                        : isFuture
                          ? 'text-gray-400 hover:bg-gray-50'
                          : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {month}
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="p-2 border-t bg-gray-50 flex gap-2">
            <button
              onClick={() => {
                setViewYear(currentYear);
                handleMonthSelect(currentMonth);
              }}
              className="flex-1 py-1.5 text-xs text-primary-600 hover:bg-primary-50 rounded transition-colors"
            >
              This Month
            </button>
            <button
              onClick={() => setViewYear(currentYear)}
              className="flex-1 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              Current Year
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
