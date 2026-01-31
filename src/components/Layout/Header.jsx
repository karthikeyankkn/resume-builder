import { useEffect, useState, useMemo } from 'react';
import { FileText, Download, Layout, Upload, FilePlus, Save, Undo2, Redo2, Sun, Moon, Monitor, Check, Cloud, Loader2 } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useResumeStore } from '../../store/resumeStore';
import { useTemplateStore } from '../../store/templateStore';
import { useHistoryStore } from '../../store/historyStore';
import { useThemeStore } from '../../store/themeStore';
import { useToast } from '../../store/toastStore';
import { useConfirm } from '../../store/confirmStore';

// Format relative time
function formatRelativeTime(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function Header() {
  const { openTemplateGallery, openExportModal, openImportModal } = useUIStore();
  const { resume, saveCurrentResume, resetResume, isDirty, clearDirty, lastSavedAt } = useResumeStore();
  const { getCurrentTemplate } = useTemplateStore();
  const { undo, redo, canUndo, canRedo, pushState, getUndoCount, getRedoCount } = useHistoryStore();
  const { theme, cycleTheme } = useThemeStore();
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedDisplay, setLastSavedDisplay] = useState(formatRelativeTime(lastSavedAt));

  const currentTemplate = getCurrentTemplate();

  // Update last saved display every minute
  useEffect(() => {
    const updateDisplay = () => setLastSavedDisplay(formatRelativeTime(lastSavedAt));
    updateDisplay();
    const interval = setInterval(updateDisplay, 60000);
    return () => clearInterval(interval);
  }, [lastSavedAt]);

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);


  const handleSave = async () => {
    setIsSaving(true);
    pushState(JSON.stringify(resume));

    // Simulate small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 300));

    saveCurrentResume();
    clearDirty();
    setIsSaving(false);
    showToast('Resume saved!', 'success');
  };

  const handleUndo = () => {
    if (canUndo()) {
      undo(JSON.stringify(resume), (stateJson) => {
        try {
          const state = JSON.parse(stateJson);
          useResumeStore.setState({ resume: state });
        } catch (e) {
          console.error('Failed to restore state:', e);
          showToast('Failed to undo', 'error');
        }
      });
      showToast('Undo successful', 'info');
    }
  };

  const handleRedo = () => {
    if (canRedo()) {
      redo(JSON.stringify(resume), (stateJson) => {
        try {
          const state = JSON.parse(stateJson);
          useResumeStore.setState({ resume: state });
        } catch (e) {
          console.error('Failed to restore state:', e);
          showToast('Failed to redo', 'error');
        }
      });
      showToast('Redo successful', 'info');
    }
  };

  const getThemeIcon = () => {
    if (theme === 'system') return <Monitor className="w-4 h-4" />;
    if (theme === 'dark') return <Moon className="w-4 h-4" />;
    return <Sun className="w-4 h-4" />;
  };

  const getThemeLabel = () => {
    if (theme === 'system') return 'System';
    if (theme === 'dark') return 'Dark';
    return 'Light';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Resume Builder</h1>
            <p className="text-xs text-gray-500">Create professional resumes</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Theme Toggle */}
        <button
          onClick={cycleTheme}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
          title={`Theme: ${getThemeLabel()} (Click to change)`}
          aria-label={`Change theme, currently ${getThemeLabel()}`}
        >
          {getThemeIcon()}
          <span className="hidden md:inline text-sm">{getThemeLabel()}</span>
        </button>

        <div className="h-6 w-px bg-gray-200 mx-1" />

        {/* Undo/Redo */}
        <button
          onClick={handleUndo}
          disabled={!canUndo()}
          className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title={`Undo (Ctrl+Z)${canUndo() ? ` - ${getUndoCount()} actions available` : ''}`}
          aria-label="Undo last action"
        >
          <Undo2 className="w-4 h-4" aria-hidden="true" />
          {canUndo() && getUndoCount() > 0 && (
            <span className="history-badge">{getUndoCount()}</span>
          )}
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo()}
          className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title={`Redo (Ctrl+Shift+Z)${canRedo() ? ` - ${getRedoCount()} actions available` : ''}`}
          aria-label="Redo last action"
        >
          <Redo2 className="w-4 h-4" aria-hidden="true" />
          {canRedo() && getRedoCount() > 0 && (
            <span className="history-badge">{getRedoCount()}</span>
          )}
        </button>

        <div className="h-6 w-px bg-gray-200 mx-2" />

        {/* Current Template Indicator */}
        <button
          onClick={openTemplateGallery}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Templates (Ctrl+T)"
        >
          <Layout className="w-4 h-4" />
          <span className="hidden sm:inline">{currentTemplate?.name || 'Modern'}</span>
        </button>

        <div className="h-6 w-px bg-gray-200 mx-1" />

        {/* Import Button */}
        <button
          onClick={openImportModal}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Import (Ctrl+I)"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Import</span>
        </button>

        {/* Save Button with Auto-Save Indicator */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors relative ${
              isSaving
                ? 'text-primary-600 bg-primary-50'
                : isDirty
                  ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                  : 'text-gray-600 hover:bg-gray-100'
            }`}
            title={isSaving ? "Saving..." : isDirty ? "Save changes (Ctrl+S)" : "Saved"}
            aria-label={isSaving ? "Saving changes" : isDirty ? "Save unsaved changes" : "All changes saved"}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : isDirty ? (
              <Save className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Cloud className="w-4 h-4 text-green-500" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{isSaving ? 'Saving...' : isDirty ? 'Save' : 'Saved'}</span>
            {isDirty && !isSaving && (
              <span
                className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full"
                aria-label="Unsaved changes"
              />
            )}
            {!isDirty && !isSaving && (
              <Check className="w-3 h-3 text-green-500 absolute -top-0.5 -right-0.5" />
            )}
          </button>
          {/* Last saved indicator */}
          {lastSavedDisplay && !isDirty && (
            <span className="hidden lg:inline text-xs text-gray-400" title={`Last saved: ${lastSavedAt}`}>
              {lastSavedDisplay}
            </span>
          )}
        </div>

        {/* New Resume Button */}
        <button
          onClick={async () => {
            const confirmed = await confirm({
              title: 'Start New Resume',
              message: 'This will clear all your current data and start with a fresh template. This action cannot be undone.',
              confirmText: 'Start Fresh',
              cancelText: 'Cancel',
              variant: 'danger',
            });
            if (confirmed) {
              pushState(JSON.stringify(resume));
              resetResume();
              showToast('New resume created', 'success');
            }
          }}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="New Resume"
          aria-label="Start a new resume"
        >
          <FilePlus className="w-4 h-4" />
          <span className="hidden sm:inline">New</span>
        </button>

        <div className="h-6 w-px bg-gray-200 mx-1" />

        {/* Export Button */}
        <button
          onClick={openExportModal}
          className="btn btn-primary btn-sm flex items-center gap-2"
          title="Export PDF (Ctrl+E)"
          aria-label="Export resume as PDF"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          <span>Export PDF</span>
        </button>
      </div>
    </header>
  );
}
