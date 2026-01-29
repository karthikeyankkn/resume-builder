import { X, Download, FileText, Loader2, FileJson, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useResumeStore } from '../../store/resumeStore';
import { useTemplateStore } from '../../store/templateStore';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import ResumePDF from './ResumePDF';

export default function ExportModal() {
  const { closeExportModal } = useUIStore();
  const { resume, exportResume } = useResumeStore();
  const { getCurrentTemplate } = useTemplateStore();
  const template = getCurrentTemplate();
  const [activeTab, setActiveTab] = useState('pdf');
  const [showPreview, setShowPreview] = useState(false);

  const handleExportJSON = () => {
    const jsonString = exportResume();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_resume.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={closeExportModal}>
      <div
        className="modal-content w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-gray-50 rounded-t-xl">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Download className="w-6 h-6 text-primary-600" />
              Export Resume
            </h2>
            <p className="text-sm text-gray-500 mt-1">Download your resume in various formats</p>
          </div>
          <button
            onClick={closeExportModal}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-white px-2">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'pdf'
                ? 'border-primary-600 text-primary-600 bg-primary-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            PDF Export
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'json'
                ? 'border-primary-600 text-primary-600 bg-primary-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileJson className="w-4 h-4" />
            JSON Export
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'pdf' ? (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-medium text-blue-900 mb-2">PDF Export Features</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Professional A4 format (210mm x 297mm)</li>
                  <li>• Custom fonts embedded for consistent display</li>
                  <li>• Clickable links for email, LinkedIn, and portfolio</li>
                  <li>• ATS-compatible text layer</li>
                  <li>• High-quality vector graphics</li>
                </ul>
              </div>

              {/* PDF Preview Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700 font-medium">Preview PDF before downloading</span>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="btn btn-secondary inline-flex items-center gap-2"
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Hide Preview
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Show Preview
                    </>
                  )}
                </button>
              </div>

              {/* PDF Preview */}
              {showPreview && (
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm" style={{ height: '500px' }}>
                  <PDFViewer width="100%" height="100%" showToolbar={false}>
                    <ResumePDF resume={resume} template={template} />
                  </PDFViewer>
                </div>
              )}

              {/* Download Button */}
              <PDFDownloadLink
                document={<ResumePDF resume={resume} template={template} />}
                fileName={`${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`}
              >
                {({ loading, error }) => (
                  error ? (
                    <div className="w-full p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-700 font-medium">Failed to generate PDF</p>
                      <p className="text-red-600 text-sm mt-1">{error.message || 'An unknown error occurred'}</p>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary w-full py-3.5 text-base inline-flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          Download PDF
                        </>
                      )}
                    </button>
                  )
                )}
              </PDFDownloadLink>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 mb-2">JSON Export</h3>
                <p className="text-sm text-gray-600">
                  Export your resume data as a JSON file. You can use this to:
                </p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• Backup your resume data</li>
                  <li>• Transfer to another device</li>
                  <li>• Edit with external tools</li>
                  <li>• Import back later</li>
                </ul>
              </div>

              {/* JSON Preview */}
              <div className="bg-gray-900 rounded-xl p-4 overflow-auto max-h-64 shadow-sm">
                <pre className="text-xs text-gray-300 font-mono">
                  {JSON.stringify(resume, null, 2).slice(0, 1000)}...
                </pre>
              </div>

              <button
                onClick={handleExportJSON}
                className="btn btn-primary w-full py-3.5 text-base inline-flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download JSON
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-5 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={closeExportModal}
            className="btn btn-secondary px-6"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
