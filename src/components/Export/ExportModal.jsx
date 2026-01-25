import { X, Download, FileText, Loader2, FileJson } from 'lucide-react';
import { useState } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useResumeStore } from '../../store/resumeStore';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import ResumePDF from './ResumePDF';

export default function ExportModal() {
  const { closeExportModal } = useUIStore();
  const { resume, exportResume } = useResumeStore();
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
        className="modal-content w-full max-w-4xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Download className="w-5 h-5 text-primary-600" />
            Export Resume
          </h2>
          <button
            onClick={closeExportModal}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'pdf'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            PDF Export
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'json'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileJson className="w-4 h-4 inline mr-2" />
            JSON Export
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'pdf' ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Preview PDF before downloading</span>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="btn-secondary text-sm"
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>

              {/* PDF Preview */}
              {showPreview && (
                <div className="border rounded-lg overflow-hidden" style={{ height: '500px' }}>
                  <PDFViewer width="100%" height="100%" showToolbar={false}>
                    <ResumePDF resume={resume} />
                  </PDFViewer>
                </div>
              )}

              {/* Download Button */}
              <PDFDownloadLink
                document={<ResumePDF resume={resume} />}
                fileName={`${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`}
              >
                {({ loading, error }) => (
                  error ? (
                    <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 font-medium">Failed to generate PDF</p>
                      <p className="text-red-600 text-sm mt-1">{error.message || 'An unknown error occurred'}</p>
                    </div>
                  ) : (
                    <button
                      className="btn-primary w-full py-3 text-base"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          Download PDF
                        </>
                      )}
                    </button>
                  )
                )}
              </PDFDownloadLink>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
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
              <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-64">
                <pre className="text-xs text-gray-300 font-mono">
                  {JSON.stringify(resume, null, 2).slice(0, 1000)}...
                </pre>
              </div>

              <button
                onClick={handleExportJSON}
                className="btn-primary w-full py-3 text-base"
              >
                <Download className="w-5 h-5 mr-2" />
                Download JSON
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t bg-gray-50">
          <button onClick={closeExportModal} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
