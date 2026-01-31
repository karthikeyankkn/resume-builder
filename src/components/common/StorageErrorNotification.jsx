import { useState, useEffect } from 'react';
import { AlertTriangle, X, Download, Trash2 } from 'lucide-react';
import { onStorageError, clearStorageError, getStorageUsage, cleanupStorage } from '../../utils/debouncedStorage';
import { useResumeStore } from '../../store/resumeStore';

export default function StorageErrorNotification() {
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const { exportResume } = useResumeStore();

  useEffect(() => {
    const unsubscribe = onStorageError((storageError) => {
      setError(storageError);
    });

    return () => unsubscribe();
  }, []);

  if (!error) return null;

  const usage = getStorageUsage();

  const handleExportBackup = () => {
    const jsonString = exportResume();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCleanup = () => {
    cleanupStorage(['resume-storage', 'template-storage']);
    clearStorageError();
    setError(null);
  };

  const handleDismiss = () => {
    clearStorageError();
    setError(null);
  };

  return (
    <div className="fixed top-4 right-4 z-[100] max-w-md animate-slide-in-right">
      <div className="bg-red-50 border border-red-300 rounded-xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-red-900">Storage Error</h3>
            <p className="text-sm text-red-700 mt-1">
              {error.isQuotaError
                ? 'Browser storage is full. Your recent changes may not be saved.'
                : 'Failed to save your resume data.'}
            </p>

            {/* Storage usage */}
            <div className="mt-3 bg-red-100 rounded-lg p-2">
              <div className="flex justify-between text-xs text-red-700">
                <span>Storage used</span>
                <span>{Math.round(usage.used / 1024)}KB / {Math.round(usage.total / 1024)}KB</span>
              </div>
              <div className="mt-1 h-1.5 bg-red-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 rounded-full transition-all"
                  style={{ width: `${Math.min(usage.percentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={handleExportBackup}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Backup
              </button>
              {error.isQuotaError && (
                <button
                  onClick={handleCleanup}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Other Data
                </button>
              )}
            </div>

            {showDetails && (
              <div className="mt-3 p-2 bg-red-100 rounded text-xs text-red-700 font-mono break-all">
                {error.error?.message || 'Unknown error'}
              </div>
            )}

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-red-600 hover:text-red-800 mt-2"
            >
              {showDetails ? 'Hide details' : 'Show details'}
            </button>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
