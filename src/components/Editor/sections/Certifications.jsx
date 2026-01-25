import { Award, Plus, Trash2, ChevronDown, ChevronUp, Link } from 'lucide-react';
import { useState } from 'react';
import { useResumeStore } from '../../../store/resumeStore';

export default function Certifications() {
  const { resume, addCertification, updateCertification, removeCertification } = useResumeStore();
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary-600" />
          Certifications
        </h2>
        <button
          onClick={addCertification}
          className="btn-secondary text-sm py-1.5 px-3"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </button>
      </div>

      <div className="space-y-4">
        {resume.certifications.map((cert) => (
          <div
            key={cert.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div
              className="flex items-center gap-2 p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleExpand(cert.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {cert.name || 'New Certification'}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {cert.issuer || 'Issuing Organization'}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Delete this certification?')) {
                    removeCertification(cert.id);
                  }
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {expandedItems[cert.id] ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {/* Expanded Content */}
            {expandedItems[cert.id] && (
              <div className="p-4 space-y-4 border-t border-gray-200">
                <div>
                  <label className="form-label">Certification Name *</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                    placeholder="AWS Solutions Architect"
                    className="form-input"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Issuing Organization *</label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                      placeholder="Amazon Web Services"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Date Obtained</label>
                    <input
                      type="month"
                      value={cert.date}
                      onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Credential ID</label>
                    <input
                      type="text"
                      value={cert.credentialId}
                      onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                      placeholder="ABC123XYZ"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label flex items-center gap-1">
                      <Link className="w-3.5 h-3.5" /> Credential URL
                    </label>
                    <input
                      type="text"
                      value={cert.link}
                      onChange={(e) => updateCertification(cert.id, 'link', e.target.value)}
                      placeholder="https://..."
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {resume.certifications.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No certifications added yet. Click "Add" to get started.
          </p>
        )}
      </div>
    </div>
  );
}
