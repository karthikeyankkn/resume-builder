import { X, Upload, FileJson, FileUp, AlertCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useResumeStore } from '../../store/resumeStore';

export default function ImportModal() {
  const { closeImportModal } = useUIStore();
  const { importResume } = useResumeStore();
  const [jsonContent, setJsonContent] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setJsonContent(event.target.result);
        setError('');
      };
      reader.onerror = () => {
        setError('Failed to read file');
      };
      reader.readAsText(file);
    }
  };

  const handleImport = () => {
    if (!jsonContent.trim()) {
      setError('Please provide JSON content');
      return;
    }

    const success = importResume(jsonContent);
    if (success) {
      closeImportModal();
    } else {
      setError('Invalid JSON format. Please check your resume data.');
    }
  };

  const handleClear = () => {
    setJsonContent('');
    setFileName('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="modal-overlay" onClick={closeImportModal}>
      <div
        className="modal-content w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-gray-50 rounded-t-xl">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FileJson className="w-6 h-6 text-primary-600" />
              Import Resume
            </h2>
            <p className="text-sm text-gray-500 mt-1">Load resume data from a JSON file</p>
          </div>
          <button
            onClick={closeImportModal}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* File Upload */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                       ${fileName
                         ? 'border-green-300 bg-green-50'
                         : 'border-primary-200 hover:border-primary-400 hover:bg-primary-50'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {fileName ? (
              <>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileJson className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-green-700">{fileName}</p>
                <p className="text-xs text-green-600 mt-1">File loaded successfully</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-primary-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Click to upload a JSON file
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  or paste JSON content below
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* JSON Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="form-label mb-0">JSON Content</label>
              {jsonContent && (
                <button
                  onClick={handleClear}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <textarea
              value={jsonContent}
              onChange={(e) => {
                setJsonContent(e.target.value);
                setError('');
              }}
              placeholder='{"personalInfo": {...}, "experience": [...]}'
              rows={8}
              className="form-textarea font-mono text-xs"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={closeImportModal}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!jsonContent.trim()}
            className="btn btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileUp className="w-4 h-4" />
            Import Resume
          </button>
        </div>
      </div>
    </div>
  );
}
