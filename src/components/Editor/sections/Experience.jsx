import { Briefcase, Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useResumeStore } from '../../../store/resumeStore';

export default function Experience() {
  const { resume, addExperience, updateExperience, removeExperience } = useResumeStore();
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleHighlightChange = (expId, index, value) => {
    const exp = resume.experience.find((e) => e.id === expId);
    if (exp) {
      const highlights = [...exp.highlights];
      highlights[index] = value;
      updateExperience(expId, 'highlights', highlights);
    }
  };

  const addHighlight = (expId) => {
    const exp = resume.experience.find((e) => e.id === expId);
    if (exp) {
      updateExperience(expId, 'highlights', [...exp.highlights, '']);
    }
  };

  const removeHighlight = (expId, index) => {
    const exp = resume.experience.find((e) => e.id === expId);
    if (exp) {
      const highlights = exp.highlights.filter((_, i) => i !== index);
      updateExperience(expId, 'highlights', highlights);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary-600" />
          Work Experience
        </h2>
        <button
          onClick={addExperience}
          className="btn-secondary text-sm py-1.5 px-3"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </button>
      </div>

      <div className="space-y-4">
        {resume.experience.map((exp, index) => (
          <div
            key={exp.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div
              className="flex items-center gap-2 p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleExpand(exp.id)}
            >
              <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {exp.position || 'New Position'}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {exp.company || 'Company Name'}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Delete this experience?')) {
                    removeExperience(exp.id);
                  }
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {expandedItems[exp.id] ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {/* Expanded Content */}
            {expandedItems[exp.id] && (
              <div className="p-4 space-y-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Position *</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      placeholder="Software Engineer"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Company *</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="Company Name"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                      placeholder="City, State"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Start Date</label>
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">End Date</label>
                    <div className="space-y-2">
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        disabled={exp.current}
                        className="form-input disabled:bg-gray-100"
                      />
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => {
                            updateExperience(exp.id, 'current', e.target.checked);
                            if (e.target.checked) {
                              updateExperience(exp.id, 'endDate', '');
                            }
                          }}
                          className="rounded text-primary-600"
                        />
                        Current position
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    placeholder="Brief description of your role..."
                    rows={2}
                    className="form-textarea"
                  />
                </div>

                {/* Highlights/Achievements */}
                <div>
                  <label className="form-label">Key Achievements</label>
                  <div className="space-y-2">
                    {exp.highlights.map((highlight, hIndex) => (
                      <div key={hIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => handleHighlightChange(exp.id, hIndex, e.target.value)}
                          placeholder="Achieved 20% increase in..."
                          className="form-input flex-1"
                        />
                        <button
                          onClick={() => removeHighlight(exp.id, hIndex)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addHighlight(exp.id)}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      + Add achievement
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {resume.experience.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No experience added yet. Click "Add" to get started.
          </p>
        )}
      </div>
    </div>
  );
}
