import { useState, useRef, useCallback, useEffect } from 'react';
import { PenLine, Eye } from 'lucide-react';

export default function SplitPane({ left, right }) {
  const [splitPosition, setSplitPosition] = useState(45);
  const [isMobile, setIsMobile] = useState(false);
  const [activePanel, setActivePanel] = useState('editor'); // 'editor' | 'preview'
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  // Check viewport size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent) => {
      if (!isDragging.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newPosition = ((moveEvent.clientX - containerRect.left) / containerRect.width) * 100;

      // Constrain between 25% and 75%
      setSplitPosition(Math.min(75, Math.max(25, newPosition)));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  // Mobile layout with tabs
  if (isMobile) {
    return (
      <div className="flex flex-col h-full w-full">
        {/* Mobile Tab Bar */}
        <div
          className="flex bg-white border-b border-gray-200 shadow-sm"
          role="tablist"
          aria-label="Panel selector"
        >
          <button
            role="tab"
            aria-selected={activePanel === 'editor'}
            aria-controls="editor-panel"
            onClick={() => setActivePanel('editor')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
              activePanel === 'editor'
                ? 'text-primary-600 bg-primary-50 border-b-2 border-primary-500'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <PenLine className="w-4 h-4" />
            Editor
          </button>
          <button
            role="tab"
            aria-selected={activePanel === 'preview'}
            aria-controls="preview-panel"
            onClick={() => setActivePanel('preview')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
              activePanel === 'preview'
                ? 'text-primary-600 bg-primary-50 border-b-2 border-primary-500'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>

        {/* Mobile Panels */}
        <div className="flex-1 overflow-hidden">
          {/* Editor Panel */}
          <div
            id="editor-panel"
            role="tabpanel"
            aria-labelledby="editor-tab"
            className={`h-full overflow-hidden bg-gray-50 ${
              activePanel === 'editor' ? 'block' : 'hidden'
            }`}
          >
            {left}
          </div>

          {/* Preview Panel */}
          <div
            id="preview-panel"
            role="tabpanel"
            aria-labelledby="preview-tab"
            className={`h-full overflow-hidden bg-gray-100 ${
              activePanel === 'preview' ? 'block' : 'hidden'
            }`}
          >
            {right}
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout with resizable split pane
  return (
    <div
      ref={containerRef}
      className="flex h-full w-full relative"
    >
      {/* Left Panel - Editor */}
      <div
        className="h-full overflow-hidden bg-gray-50"
        style={{ width: `${splitPosition}%` }}
      >
        {left}
      </div>

      {/* Resize Handle */}
      <div
        className="w-1 bg-gray-200 hover:bg-primary-400 cursor-col-resize transition-colors relative z-10 flex-shrink-0"
        onMouseDown={handleMouseDown}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panels"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            setSplitPosition(prev => Math.max(25, prev - 5));
          } else if (e.key === 'ArrowRight') {
            setSplitPosition(prev => Math.min(75, prev + 5));
          }
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 flex items-center justify-center">
          <div className="w-1 h-6 rounded-full bg-gray-300 hover:bg-primary-500 transition-colors" />
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div
        className="h-full overflow-hidden bg-gray-100"
        style={{ width: `${100 - splitPosition}%` }}
      >
        {right}
      </div>
    </div>
  );
}
