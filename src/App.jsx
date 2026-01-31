import { lazy, Suspense, useEffect } from 'react';
import Header from './components/Layout/Header';
import SplitPane from './components/Layout/SplitPane';
import EditorPanel from './components/Editor/EditorPanel';
import PreviewPanel from './components/Preview/PreviewPanel';
import { useUIStore } from './store/uiStore';
import { useThemeStore } from './store/themeStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import ToastProvider from './components/common/ToastProvider';
import ConfirmModal from './components/common/ConfirmModal';
import ErrorBoundary from './components/common/ErrorBoundary';
import { SkeletonTemplateGallery, SkeletonExportModal, SkeletonModal } from './components/common/Skeleton';
import { GuidedTour } from './components/GuidedTour';

// Lazy load modals for better performance
const TemplateGallery = lazy(() => import('./components/Templates/TemplateGallery'));
const ExportModal = lazy(() => import('./components/Export/ExportModal'));
const TemplateBuilder = lazy(() => import('./components/TemplateBuilder/TemplateBuilder'));
const TemplateEditor = lazy(() => import('./components/TemplateBuilder/TemplateEditor'));
const ImportModal = lazy(() => import('./components/Editor/ImportModal'));
const ShortcutsHelpModal = lazy(() => import('./components/common/ShortcutsHelpModal'));
const ATSAnalyzerModal = lazy(() => import('./components/ATS/ATSAnalyzerModal'));
const ImpactBuilderModal = lazy(() => import('./components/ImpactBuilder/ImpactBuilderModal'));

// Loading fallback for modals with skeleton
function ModalLoader({ type = 'default' }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {type === 'template' && <SkeletonTemplateGallery />}
        {type === 'export' && <SkeletonExportModal />}
        {type === 'default' && <SkeletonModal />}
      </div>
    </div>
  );
}

// Simple loader for smaller modals
function SmallModalLoader() {
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
    showImportModal,
    showShortcutsHelpModal,
    showATSAnalyzer,
    closeATSAnalyzer,
    showImpactBuilder,
    impactBuilderText,
    impactBuilderCallback,
    closeImpactBuilder
  } = useUIStore();

  const { initTheme } = useThemeStore();

  // Initialize theme on mount
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <ErrorBoundary showDetails={import.meta.env.DEV}>
      <div className="min-h-screen bg-gray-50 flex flex-col transition-colors">
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
        <ToastProvider />
        <main className="flex-1 overflow-hidden">
          <ErrorBoundary>
            <SplitPane
              left={
                <ErrorBoundary>
                  <EditorPanel />
                </ErrorBoundary>
              }
              right={
                <ErrorBoundary>
                  <PreviewPanel />
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>
        </main>

      {/* Lazy-loaded Modals with appropriate skeleton loaders */}
      {showTemplateGallery && (
        <Suspense fallback={<ModalLoader type="template" />}>
          <TemplateGallery />
        </Suspense>
      )}
      {showExportModal && (
        <Suspense fallback={<ModalLoader type="export" />}>
          <ExportModal />
        </Suspense>
      )}
      {showTemplateBuilder && (
        <Suspense fallback={<ModalLoader type="default" />}>
          <TemplateBuilder />
        </Suspense>
      )}
      {showTemplateEditor && (
        <Suspense fallback={<ModalLoader type="default" />}>
          <TemplateEditor />
        </Suspense>
      )}
      {showImportModal && (
        <Suspense fallback={<SmallModalLoader />}>
          <ImportModal />
        </Suspense>
      )}
      {showShortcutsHelpModal && (
        <Suspense fallback={<SmallModalLoader />}>
          <ShortcutsHelpModal />
        </Suspense>
      )}
      {showATSAnalyzer && (
        <Suspense fallback={<SmallModalLoader />}>
          <ATSAnalyzerModal isOpen={showATSAnalyzer} onClose={closeATSAnalyzer} />
        </Suspense>
      )}
      {showImpactBuilder && (
        <Suspense fallback={<SmallModalLoader />}>
          <ImpactBuilderModal
            isOpen={showImpactBuilder}
            onClose={closeImpactBuilder}
            initialText={impactBuilderText}
            onApply={(newText) => {
              if (impactBuilderCallback) {
                impactBuilderCallback(newText);
              }
              closeImpactBuilder();
            }}
          />
        </Suspense>
      )}

      {/* Keyboard Shortcut Hint */}
      <div className="fixed bottom-4 left-4 text-xs text-gray-400 hidden sm:block" data-tour="shortcuts-hint">
        Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">?</kbd> for shortcuts
      </div>

      {/* Guided Tour for First-time Users */}
      <GuidedTour />

      {/* Confirm Dialog */}
      <ConfirmModal />
    </div>
    </ErrorBoundary>
  );
}

export default App;
