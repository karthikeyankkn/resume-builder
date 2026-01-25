import { useRef, useState, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Download, FileText } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useTemplateStore } from '../../store/templateStore';
import { useResumeStore } from '../../store/resumeStore';
import ResumePreview from './ResumePreview';

// A4 dimensions in pixels at 96 DPI
const A4_HEIGHT_MM = 297;
const A4_WIDTH_MM = 210;
const MM_TO_PX = 3.7795275591; // 1mm = 3.7795275591px at 96 DPI
const A4_HEIGHT_PX = A4_HEIGHT_MM * MM_TO_PX;

export default function PreviewPanel() {
  const { zoom, setZoom, zoomIn, zoomOut, openExportModal } = useUIStore();
  const { getCurrentTemplate } = useTemplateStore();
  const { resume } = useResumeStore();
  const contentRef = useRef(null);
  const [pageCount, setPageCount] = useState(1);

  const template = getCurrentTemplate();

  // Calculate number of pages based on content height
  const calculatePages = useCallback(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const pages = Math.max(1, Math.ceil(contentHeight / A4_HEIGHT_PX));
      setPageCount(pages);
    }
  }, []);

  // Recalculate pages when resume or template changes
  useEffect(() => {
    calculatePages();
    // Use ResizeObserver to handle dynamic content changes
    const observer = new ResizeObserver(calculatePages);
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }
    return () => observer.disconnect();
  }, [resume, template, calculatePages]);

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
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

      {/* Preview Container */}
      <div className="flex-1 overflow-auto p-6 flex flex-col items-center">
        <div
          className="origin-top transition-transform"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <div className="a4-pages-container">
            {/* Content measurement wrapper */}
            <div
              ref={contentRef}
              className="a4-preview rounded-lg"
              style={{
                width: '210mm',
                minHeight: '297mm',
                backgroundColor: template?.styles?.colors?.background || '#ffffff',
                position: 'relative'
              }}
            >
              <ResumePreview />

              {/* Page break indicators */}
              {Array.from({ length: pageCount - 1 }, (_, i) => (
                <div
                  key={i}
                  className="page-break-indicator"
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: `${(i + 1) * A4_HEIGHT_MM}mm`,
                    height: '20px',
                    marginTop: '-10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    zIndex: 10
                  }}
                >
                  <div className="page-break-line" />
                  <span className="page-break-label">
                    Page {i + 2}
                  </span>
                  <div className="page-break-line" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-white border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
        <span>A4 Format (210mm x 297mm) • {pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Auto-saved
        </span>
      </div>
    </div>
  );
}
