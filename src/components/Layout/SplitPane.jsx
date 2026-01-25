import { useState, useRef, useCallback } from 'react';

export default function SplitPane({ left, right }) {
  const [splitPosition, setSplitPosition] = useState(45);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

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
