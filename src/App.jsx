import { lazy, Suspense, useEffect } from 'react';
import Header from './components/Layout/Header';
import SplitPane from './components/Layout/SplitPane';
import EditorPanel from './components/Editor/EditorPanel';
import PreviewPanel from './components/Preview/PreviewPanel';
import { useUIStore } from './store/uiStore';
import { useThemeStore } from './store/themeStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

// Lazy load modals for better performance
const TemplateGallery = lazy(() => import('./components/Templates/TemplateGallery'));
const ExportModal = lazy(() => import('./components/Export/ExportModal'));
const TemplateBuilder = lazy(() => import('./components/TemplateBuilder/TemplateBuilder'));
const TemplateEditor = lazy(() => import('./components/TemplateBuilder/TemplateEditor'));
const ImportModal = lazy(() => import('./components/Editor/ImportModal'));

// Loading fallback for modals
function ModalLoader() {
  return (
    <div className="modal-overlay">
      <div className="modal-content p-8 flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-600">Loading...</span>
      </div>
    </div>
  );
}

function App() {
  const {
    showTemplateGallery,
    showExportModal,
    showTemplateBuilder,
    showTemplateEditor,
    showImportModal
  } = useUIStore();

  const { initTheme } = useThemeStore();

  // Initialize theme on mount
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col transition-colors">
      <Header />
      <main className="flex-1 overflow-hidden">
        <SplitPane
          left={<EditorPanel />}
          right={<PreviewPanel />}
        />
      </main>

      {/* Lazy-loaded Modals */}
      <Suspense fallback={<ModalLoader />}>
        {showTemplateGallery && <TemplateGallery />}
        {showExportModal && <ExportModal />}
        {showTemplateBuilder && <TemplateBuilder />}
        {showTemplateEditor && <TemplateEditor />}
        {showImportModal && <ImportModal />}
      </Suspense>

      {/* Keyboard Shortcut Hint */}
      <div className="fixed bottom-4 left-4 text-xs text-gray-400 hidden sm:block">
        Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">?</kbd> for shortcuts
      </div>
    </div>
  );
}

export default App;
