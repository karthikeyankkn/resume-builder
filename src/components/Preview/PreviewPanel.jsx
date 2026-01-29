import { useRef, useState, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useTemplateStore } from '../../store/templateStore';
import { useResumeStore } from '../../store/resumeStore';
import ResumePreview from './ResumePreview';

// A4 dimensions
const A4_HEIGHT_MM = 297;
const A4_WIDTH_MM = 210;
// Convert mm to pixels at 96 DPI (standard screen resolution)
const MM_TO_PX = 96 / 25.4; // ~3.78 px per mm
const A4_HEIGHT_PX = Math.round(A4_HEIGHT_MM * MM_TO_PX);
const A4_WIDTH_PX = Math.round(A4_WIDTH_MM * MM_TO_PX);

export default function PreviewPanel() {
  const { zoom, setZoom, zoomIn, zoomOut } = useUIStore();
  const { getCurrentTemplate } = useTemplateStore();
  const { resume } = useResumeStore();
  const measureRef = useRef(null);
  const [pageCount, setPageCount] = useState(1);
  const [contentHeight, setContentHeight] = useState(A4_HEIGHT_PX);

  const template = getCurrentTemplate();

  // Calculate number of pages based on content height
  const calculatePages = useCallback(() => {
    if (measureRef.current) {
      const height = measureRef.current.scrollHeight;
      const pages = Math.max(1, Math.ceil(height / A4_HEIGHT_PX));
      setContentHeight(height);
      setPageCount(pages);
    }
  }, []);

  // Recalculate pages when resume or template changes
  useEffect(() => {
    // Small delay to allow content to render
    const timer = setTimeout(calculatePages, 100);

    // Use ResizeObserver to handle dynamic content changes
    const observer = new ResizeObserver(() => {
      setTimeout(calculatePages, 50);
    });

    if (measureRef.current) {
      observer.observe(measureRef.current);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [resume, template, calculatePages]);

  return (
    <div className="h-full flex flex-col bg-gray-100 transition-colors">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 transition-colors">
        <span className="text-sm text-gray-600">
          Preview
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <input
            type="range"
            min="25"
            max="150"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <button
            onClick={zoomIn}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-500 w-10 text-right">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom(100)}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded ml-1"
            title="Reset Zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Container - Shows multiple A4 pages like PDF viewer */}
      <div className="flex-1 overflow-auto p-6 bg-gray-300 dark:bg-gray-800 transition-colors">
        <div
          className="flex flex-col items-center gap-6"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            paddingBottom: `${(zoom / 100) * 100}px`
          }}
        >
          {/* Hidden measurement container */}
          <div
            ref={measureRef}
            style={{
              position: 'absolute',
              visibility: 'hidden',
              width: `${A4_WIDTH_PX}px`,
              pointerEvents: 'none'
            }}
          >
            <ResumePreview />
          </div>

          {/* Render each page as a separate A4 sheet */}
          {Array.from({ length: pageCount }, (_, pageIndex) => (
            <div
              key={pageIndex}
              className="a4-page bg-white relative"
              style={{
                width: `${A4_WIDTH_PX}px`,
                height: `${A4_HEIGHT_PX}px`,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                borderRadius: '2px'
              }}
            >
              {/* Content container - positioned to show correct page portion */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: `${A4_WIDTH_PX}px`,
                  transform: `translateY(-${pageIndex * A4_HEIGHT_PX}px)`,
                  backgroundColor: template?.styles?.colors?.background || '#ffffff'
                }}
              >
                <ResumePreview />
              </div>

              {/* Page number indicator */}
              {pageCount > 1 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '12px',
                    fontSize: '9px',
                    color: '#9ca3af',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    padding: '2px 6px',
                    borderRadius: '2px'
                  }}
                >
                  {pageIndex + 1} / {pageCount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-white border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between transition-colors">
        <span>A4 (210 × 297 mm) • {pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Auto-saved
        </span>
      </div>
    </div>
  );
}
