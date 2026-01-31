import { useState, useEffect } from 'react';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';
import { onStorageChange, checkMultipleTabs } from '../../utils/debouncedStorage';

export default function MultiTabWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [hasConflict, setHasConflict] = useState(false);

  useEffect(() => {
    // Check for multiple tabs on mount
    if (checkMultipleTabs()) {
      setShowWarning(true);
    }

    // Listen for storage changes from other tabs
    const unsubscribe = onStorageChange((event) => {
      if (event.key === 'resume-storage' || event.key === 'template-storage') {
        setHasConflict(true);
        setShowWarning(true);
      }
    });

    // Periodically check for multiple tabs
    const interval = setInterval(() => {
      if (checkMultipleTabs() && !showWarning) {
        setShowWarning(true);
      }
    }, 15000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [showWarning]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowWarning(false);
    setHasConflict(false);
  };

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] max-w-sm animate-slide-in-right">
      <div className={`border rounded-xl shadow-lg p-4 ${
        hasConflict
          ? 'bg-red-50 border-red-300'
          : 'bg-yellow-50 border-yellow-300'
      }`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
            hasConflict ? 'text-red-600' : 'text-yellow-600'
          }`} aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-sm ${
              hasConflict ? 'text-red-900' : 'text-yellow-900'
            }`}>
              {hasConflict ? 'Data Changed in Another Tab' : 'Multiple Tabs Detected'}
            </h3>
            <p className={`text-xs mt-1 ${
              hasConflict ? 'text-red-700' : 'text-yellow-700'
            }`}>
              {hasConflict
                ? 'Your resume was modified in another tab. Refresh to see the latest changes.'
                : 'You have this app open in multiple tabs. Changes made in one tab may overwrite changes in another.'
              }
            </p>

            {hasConflict && (
              <button
                onClick={handleRefresh}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Page
              </button>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className={`p-1 rounded transition-colors ${
              hasConflict
                ? 'text-red-400 hover:text-red-600 hover:bg-red-100'
                : 'text-yellow-400 hover:text-yellow-600 hover:bg-yellow-100'
            }`}
            aria-label="Dismiss warning"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
