import { X, Upload, FileJson } from 'lucide-react';
import { useState, useRef } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useResumeStore } from '../../store/resumeStore';

export default function ImportModal() {
  const { closeImportModal } = useUIStore();
  const { importResume } = useResumeStore();
  const [jsonContent, setJsonContent] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
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

  return (
    <div className="modal-overlay" onClick={closeImportModal}>
      <div
        className="modal-content w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileJson className="w-5 h-5 text-primary-600" />
            Import Resume
          </h2>
          <button
            onClick={closeImportModal}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* File Upload */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center
                       hover:border-primary-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Click to upload a JSON file
            </p>
            <p className="text-xs text-gray-400 mt-1">
              or paste JSON content below
            </p>
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
            <label className="form-label">JSON Content</label>
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
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button onClick={closeImportModal} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleImport} className="btn-primary">
            Import Resume
          </button>
        </div>
      </div>
    </div>
  );
}
