import { useEffect, useCallback } from 'react';
import { useUIStore } from '../store/uiStore';
import { useResumeStore } from '../store/resumeStore';
import { useHistoryStore } from '../store/historyStore';
import { useThemeStore } from '../store/themeStore';
import { useToast } from '../store/toastStore';

export function useKeyboardShortcuts() {
  const {
    openExportModal,
    openTemplateGallery,
    openImportModal,
    openATSAnalyzer,
    zoomIn,
    zoomOut,
    setZoom,
    toggleShortcutsHelpModal,
    closeTemplateGallery,
    closeExportModal,
    closeTemplateBuilder,
    closeImportModal,
    closeShortcutsHelpModal,
    closeATSAnalyzer,
    closeImpactBuilder
  } = useUIStore();

  const { resume, saveCurrentResume } = useResumeStore();
  const { undo, redo, canUndo, canRedo, pushState } = useHistoryStore();
  const { toggleTheme } = useThemeStore();
  const { showToast } = useToast();

  // Store current state for undo
  const storeState = useCallback(() => {
    pushState(JSON.stringify(resume));
  }, [resume, pushState]);

  // Restore state from history
  const restoreState = useCallback((stateJson) => {
    try {
      const state = JSON.parse(stateJson);
      useResumeStore.setState({ resume: state });
    } catch (e) {
      console.error('Failed to restore state:', e);
    }
  }, []);

  const handleKeyDown = useCallback((e) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdKey = isMac ? e.metaKey : e.ctrlKey;

    // Ignore if user is typing in an input
    const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);

    // Cmd/Ctrl + Z - Undo
    if (cmdKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      if (canUndo()) {
        undo(JSON.stringify(resume), restoreState);
        showToast('Undo', 'info');
      }
      return;
    }

    // Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y - Redo
    if ((cmdKey && e.shiftKey && e.key === 'z') || (cmdKey && e.key === 'y')) {
      e.preventDefault();
      if (canRedo()) {
        redo(JSON.stringify(resume), restoreState);
        showToast('Redo', 'info');
      }
      return;
    }

    // Cmd/Ctrl + S - Save
    if (cmdKey && e.key === 's') {
      e.preventDefault();
      storeState();
      saveCurrentResume();
      showToast('Saved!', 'success');
      return;
    }

    // Cmd/Ctrl + E - Export PDF
    if (cmdKey && e.key === 'e') {
      e.preventDefault();
      openExportModal();
      return;
    }

    // Cmd/Ctrl + T - Templates (only if not typing)
    if (cmdKey && e.key === 't' && !isTyping) {
      e.preventDefault();
      openTemplateGallery();
      return;
    }

    // Cmd/Ctrl + I - Import (only if not typing)
    if (cmdKey && e.key === 'i' && !isTyping) {
      e.preventDefault();
      openImportModal();
      return;
    }

    // Cmd/Ctrl + K - ATS Analyzer (only if not typing)
    if (cmdKey && e.key === 'k' && !isTyping) {
      e.preventDefault();
      openATSAnalyzer();
      return;
    }

    // Cmd/Ctrl + Shift + L - Toggle Theme
    if (cmdKey && e.shiftKey && e.key === 'l') {
      e.preventDefault();
      toggleTheme();
      const isDark = useThemeStore.getState().getEffectiveTheme() === 'dark';
      showToast(isDark ? 'Dark Mode' : 'Light Mode', 'info');
      return;
    }

    // Cmd/Ctrl + Plus - Zoom In
    if (cmdKey && (e.key === '=' || e.key === '+')) {
      e.preventDefault();
      zoomIn();
      return;
    }

    // Cmd/Ctrl + Minus - Zoom Out
    if (cmdKey && e.key === '-') {
      e.preventDefault();
      zoomOut();
      return;
    }

    // Cmd/Ctrl + 0 - Reset Zoom
    if (cmdKey && e.key === '0') {
      e.preventDefault();
      setZoom(100);
      return;
    }

    // Escape - Close modals
    if (e.key === 'Escape') {
      closeTemplateGallery();
      closeExportModal();
      closeTemplateBuilder();
      closeImportModal();
      closeShortcutsHelpModal();
      closeATSAnalyzer();
      closeImpactBuilder();
      return;
    }

    // ? - Show shortcuts help (only if not typing)
    if (e.key === '?' && !isTyping) {
      toggleShortcutsHelpModal();
      return;
    }
  }, [
    resume, undo, redo, canUndo, canRedo, restoreState, storeState,
    openExportModal, openTemplateGallery, openImportModal, openATSAnalyzer,
    zoomIn, zoomOut, setZoom, saveCurrentResume, toggleTheme, showToast,
    toggleShortcutsHelpModal, closeTemplateGallery, closeExportModal,
    closeTemplateBuilder, closeImportModal, closeShortcutsHelpModal,
    closeATSAnalyzer, closeImpactBuilder
  ]);

  // Track changes for undo history
  useEffect(() => {
    const handleBeforeChange = () => {
      storeState();
    };

    // Debounced state tracking
    const timeoutId = setTimeout(handleBeforeChange, 1000);
    return () => clearTimeout(timeoutId);
  }, [resume, storeState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export default useKeyboardShortcuts;
