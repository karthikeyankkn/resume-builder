import { Plus, Trash2, ChevronDown, ChevronUp, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { useConfirm } from '../../../store/confirmStore';
import { useUIStore } from '../../../store/uiStore';
import MonthPicker from '../../common/MonthPicker';
import { validateDateRange } from '../../../utils/validationUtils';
import { InlineStrengthIndicator } from '../../ImpactBuilder';

export default function Experience() {
  const { resume, addExperience, updateExperience, removeExperience, reorderExperience } = useResumeStore();
  const { confirm } = useConfirm();
  const { openImpactBuilder } = useUIStore();
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
      <div className="flex justify-end mb-3">
        <button
          onClick={addExperience}
          className="btn-add"
        >
          <Plus className="w-4 h-4" />
          Add Experience
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
              {/* Reorder buttons */}
              <div className="reorder-buttons" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => reorderExperience(index, index - 1)}
                  disabled={index === 0}
                  className="reorder-btn"
                  title="Move up"
                  aria-label="Move experience up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => reorderExperience(index, index + 1)}
                  disabled={index === resume.experience.length - 1}
                  className="reorder-btn"
                  title="Move down"
                  aria-label="Move experience down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {exp.position || 'New Position'}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {exp.company || 'Company Name'}
                </p>
              </div>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  const confirmed = await confirm({
                    title: 'Delete Experience',
                    message: `Are you sure you want to delete "${exp.position || 'this experience'}" at "${exp.company || 'this company'}"? This action cannot be undone.`,
                    confirmText: 'Delete',
                    cancelText: 'Cancel',
                    variant: 'danger',
                  });
                  if (confirmed) {
                    removeExperience(exp.id);
                  }
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                aria-label={`Delete ${exp.position || 'experience'}`}
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
                    <MonthPicker
                      value={exp.startDate}
                      onChange={(value) => updateExperience(exp.id, 'startDate', value)}
                      placeholder="Select start date"
                    />
                  </div>
                  <div>
                    <label className="form-label">End Date</label>
                    <div className="space-y-2">
                      <MonthPicker
                        value={exp.endDate}
                        onChange={(value) => updateExperience(exp.id, 'endDate', value)}
                        placeholder="Select end date"
                        disabled={exp.current}
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
                      {(() => {
                        const dateValidation = validateDateRange(exp.startDate, exp.endDate, exp.current);
                        return !dateValidation.valid && (
                          <p className="form-error">
                            <AlertCircle className="w-3 h-3" />
                            {dateValidation.error}
                          </p>
                        );
                      })()}
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
                      <div key={hIndex} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => handleHighlightChange(exp.id, hIndex, e.target.value)}
                          placeholder="Achieved 20% increase in..."
                          className="form-input flex-1"
                        />
                        <InlineStrengthIndicator
                          text={highlight}
                          onStrengthen={() => {
                            openImpactBuilder(highlight, (newText) => {
                              handleHighlightChange(exp.id, hIndex, newText);
                            });
                          }}
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
                      className="btn-add-inline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add achievement
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
