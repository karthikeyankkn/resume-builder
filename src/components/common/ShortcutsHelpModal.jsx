import { X } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

const shortcutSections = [
  {
    title: 'General',
    shortcuts: [
      { keys: ['?'], description: 'Toggle this help menu' },
      { keys: ['Ctrl', 'S'], description: 'Save resume to local storage' },
      { keys: ['Ctrl', 'E'], description: 'Export to PDF' },
      { keys: ['Ctrl', 'T'], description: 'Open template gallery' },
      { keys: ['Ctrl', 'I'], description: 'Import from JSON' },
    ],
  },
  {
    title: 'History',
    shortcuts: [
      { keys: ['Ctrl', 'Z'], description: 'Undo last action' },
      { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo last action' },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['Alt', '1-7'], description: 'Switch to section (e.g., Alt+1 for Personal Info)' },
      { keys: ['Alt', 'N'], description: 'Add new custom section' },
    ],
  },
  {
    title: 'Preview',
    shortcuts: [
      { keys: ['Ctrl', '+'], description: 'Zoom in preview' },
      { keys: ['Ctrl', '-'], description: 'Zoom out preview' },
      { keys: ['Ctrl', '0'], description: 'Reset preview zoom' },
    ],
  },
];

function ShortcutsHelpModal() {
  const { closeShortcutsHelpModal } = useUIStore();

  return (
    <div className="modal-overlay" role="presentation">
      <div
        className="modal-content w-full max-w-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
      >
        <div className="flex items-center justify-between pb-3 border-b mb-4">
          <h2 id="shortcuts-modal-title" className="text-lg font-semibold">Keyboard Shortcuts</h2>
          <button
            onClick={closeShortcutsHelpModal}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close shortcuts help"
          >
            <X className="w-5 h-5 text-gray-500" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4">
          {shortcutSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-medium text-gray-700 mb-2">{section.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {section.shortcuts.map((shortcut) => (
                  <div key={shortcut.description} className="flex items-center justify-between">
                    <p className="text-gray-600">{shortcut.description}</p>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key) => (
                        <kbd key={key} className="px-2 py-1 bg-gray-100 rounded text-gray-600 font-mono text-xs">
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShortcutsHelpModal;
