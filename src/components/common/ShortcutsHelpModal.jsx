import { X } from 'lucide-react';
import { useMemo } from 'react';
import { useUIStore } from '../../store/uiStore';

// Detect if user is on Mac
const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const modKey = isMac ? '⌘' : 'Ctrl';

const getShortcutSections = () => [
  {
    title: 'General',
    shortcuts: [
      { keys: ['?'], description: 'Toggle this help menu' },
      { keys: [modKey, 'S'], description: 'Save resume to local storage' },
      { keys: [modKey, 'E'], description: 'Export to PDF' },
      { keys: [modKey, 'T'], description: 'Open template gallery' },
      { keys: [modKey, 'I'], description: 'Import from JSON' },
      { keys: [modKey, 'K'], description: 'Open ATS Analyzer' },
    ],
  },
  {
    title: 'History',
    shortcuts: [
      { keys: [modKey, 'Z'], description: 'Undo last action' },
      { keys: [modKey, 'Shift', 'Z'], description: 'Redo last action' },
    ],
  },
  {
    title: 'View',
    shortcuts: [
      { keys: [modKey, '+'], description: 'Zoom in preview' },
      { keys: [modKey, '-'], description: 'Zoom out preview' },
      { keys: [modKey, '0'], description: 'Reset preview zoom' },
      { keys: [modKey, 'Shift', 'L'], description: 'Toggle dark/light mode' },
    ],
  },
  {
    title: 'Other',
    shortcuts: [
      { keys: ['Esc'], description: 'Close any open modal' },
    ],
  },
];

function ShortcutsHelpModal() {
  const { closeShortcutsHelpModal } = useUIStore();
  const shortcutSections = useMemo(() => getShortcutSections(), []);

  return (
    <div
      className="modal-overlay"
      onClick={closeShortcutsHelpModal}
      role="presentation"
    >
      <div
        className="modal-content w-full max-w-2xl mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
      >
        <div className="flex items-center justify-between pb-3 border-b mb-4">
          <h2 id="shortcuts-modal-title" className="text-lg font-semibold text-gray-900">Keyboard Shortcuts</h2>
          <button
            onClick={closeShortcutsHelpModal}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close shortcuts help"
          >
            <X className="w-5 h-5 text-gray-500" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-5">
          {shortcutSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-medium text-gray-700 mb-2">{section.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {section.shortcuts.map((shortcut) => (
                  <div key={shortcut.description} className="flex items-center justify-between gap-3">
                    <span className="text-gray-600">{shortcut.description}</span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {shortcut.keys.map((key, index) => (
                        <span key={`${key}-${index}`} className="flex items-center gap-1">
                          <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-gray-700 font-mono text-xs min-w-[1.5rem] text-center shadow-sm">
                            {key}
                          </kbd>
                          {index < shortcut.keys.length - 1 && (
                            <span className="text-gray-400 text-xs">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t text-xs text-gray-500 text-center">
          {isMac ? 'Using ⌘ (Command) key for shortcuts' : 'Using Ctrl key for shortcuts'}
        </div>
      </div>
    </div>
  );
}

export default ShortcutsHelpModal;
