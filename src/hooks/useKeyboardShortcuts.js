import { useEffect, useCallback } from 'react';
import { useUIStore } from '../store/uiStore';
import { useResumeStore } from '../store/resumeStore';
import { useHistoryStore } from '../store/historyStore';

export function useKeyboardShortcuts() {
  const {
    openExportModal,
    openTemplateGallery,
    openImportModal,
    zoomIn,
    zoomOut,
    setZoom
  } = useUIStore();

  const { resume, saveCurrentResume } = useResumeStore();
  const { undo, redo, canUndo, canRedo, pushState } = useHistoryStore();

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
        showToast('Undo');
      }
      return;
    }

    // Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y - Redo
    if ((cmdKey && e.shiftKey && e.key === 'z') || (cmdKey && e.key === 'y')) {
      e.preventDefault();
      if (canRedo()) {
        redo(JSON.stringify(resume), restoreState);
        showToast('Redo');
      }
      return;
    }

    // Cmd/Ctrl + S - Save
    if (cmdKey && e.key === 's') {
      e.preventDefault();
      storeState();
      saveCurrentResume();
      showToast('Saved!');
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
      useUIStore.getState().closeTemplateGallery();
      useUIStore.getState().closeExportModal();
      useUIStore.getState().closeTemplateBuilder();
      useUIStore.getState().closeImportModal();
      return;
    }

    // ? - Show shortcuts help (only if not typing)
    if (e.key === '?' && !isTyping) {
      showShortcutsHelp();
      return;
    }
  }, [
    resume, undo, redo, canUndo, canRedo, restoreState, storeState,
    openExportModal, openTemplateGallery, openImportModal,
    zoomIn, zoomOut, setZoom, saveCurrentResume
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

// Toast notification helper
function showToast(message) {
  const existing = document.querySelector('.keyboard-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'keyboard-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #1e293b;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    z-index: 9999;
    animation: fadeInUp 0.2s ease-out;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1500);
}

// Shortcuts help modal
function showShortcutsHelp() {
  const existing = document.querySelector('.shortcuts-modal');
  if (existing) {
    existing.remove();
    return;
  }

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const cmd = isMac ? '⌘' : 'Ctrl';

  const shortcuts = [
    { keys: `${cmd} + S`, action: 'Save resume' },
    { keys: `${cmd} + Z`, action: 'Undo' },
    { keys: `${cmd} + Shift + Z`, action: 'Redo' },
    { keys: `${cmd} + E`, action: 'Export PDF' },
    { keys: `${cmd} + T`, action: 'Templates' },
    { keys: `${cmd} + I`, action: 'Import' },
    { keys: `${cmd} + +`, action: 'Zoom in' },
    { keys: `${cmd} + -`, action: 'Zoom out' },
    { keys: `${cmd} + 0`, action: 'Reset zoom' },
    { keys: 'Esc', action: 'Close modal' },
    { keys: '?', action: 'Show shortcuts' }
  ];

  const modal = document.createElement('div');
  modal.className = 'shortcuts-modal';
  modal.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;

  modal.innerHTML = `
    <div style="
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #1e293b;">Keyboard Shortcuts</h3>
        <button onclick="this.closest('.shortcuts-modal').remove()" style="
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #64748b;
        ">✕</button>
      </div>
      <div style="display: grid; gap: 8px;">
        ${shortcuts.map(s => `
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
            <span style="color: #64748b; font-size: 14px;">${s.action}</span>
            <kbd style="
              background: #f1f5f9;
              padding: 4px 8px;
              border-radius: 4px;
              font-family: monospace;
              font-size: 12px;
              color: #1e293b;
            ">${s.keys}</kbd>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  document.body.appendChild(modal);
}

export default useKeyboardShortcuts;
