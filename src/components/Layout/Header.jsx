import { FileText, Download, Layout, Upload, RotateCcw, Save, Undo2, Redo2, Sun, Moon, Monitor } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useResumeStore } from '../../store/resumeStore';
import { useTemplateStore } from '../../store/templateStore';
import { useHistoryStore } from '../../store/historyStore';
import { useThemeStore } from '../../store/themeStore';

export default function Header() {
  const { openTemplateGallery, openExportModal, openImportModal } = useUIStore();
  const { resume, saveCurrentResume, resetResume } = useResumeStore();
  const { getCurrentTemplate } = useTemplateStore();
  const { undo, redo, canUndo, canRedo, pushState } = useHistoryStore();
  const { theme, toggleTheme, cycleTheme, getEffectiveTheme } = useThemeStore();

  const currentTemplate = getCurrentTemplate();
  const effectiveTheme = getEffectiveTheme();

  const handleSave = () => {
    pushState(JSON.stringify(resume));
    saveCurrentResume();
    showToast('Resume saved!');
  };

  const handleUndo = () => {
    if (canUndo()) {
      undo(JSON.stringify(resume), (stateJson) => {
        try {
          const state = JSON.parse(stateJson);
          useResumeStore.setState({ resume: state });
        } catch (e) {
          console.error('Failed to restore state:', e);
        }
      });
      showToast('Undo');
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
        }
      });
      showToast('Redo');
    }
  };

  const showToast = (message) => {
    const existing = document.querySelector('.header-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'header-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${effectiveTheme === 'dark' ? '#10b981' : '#059669'};
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.2s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
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
        >
          {getThemeIcon()}
          <span className="hidden md:inline text-sm">{getThemeLabel()}</span>
        </button>

        <div className="h-6 w-px bg-gray-200 mx-1" />

        {/* Undo/Redo */}
        <button
          onClick={handleUndo}
          disabled={!canUndo()}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo()}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 className="w-4 h-4" />
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

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Save (Ctrl+S)"
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Save</span>
        </button>

        {/* Reset Button */}
        <button
          onClick={() => {
            if (confirm('Reset resume to sample data? This will clear your current changes.')) {
              pushState(JSON.stringify(resume));
              resetResume();
            }
          }}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Reset to Default"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        <div className="h-6 w-px bg-gray-200 mx-1" />

        {/* Export Button */}
        <button
          onClick={openExportModal}
          className="btn-primary flex items-center gap-2 p-2 exportPdfBtn"
          title="Export PDF (Ctrl+E)"
        >
          <Download className="w-4 h-4" />
          <span>Export PDF</span>
        </button>
      </div>
    </header>
  );
}
