import { Plus, Trash2, ChevronDown, ChevronUp, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { useConfirm } from '../../../store/confirmStore';
import MonthPicker from '../../common/MonthPicker';
import { validateDateRange } from '../../../utils/validationUtils';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import ListPagination from '../../common/ListPagination';

export default function Education() {
  const { resume, addEducation, updateEducation, removeEducation, reorderEducation } = useResumeStore();
  const { confirm } = useConfirm();
  const [expandedItems, setExpandedItems] = useState({});

  // Paginate for large lists (performance optimization)
  const pagination = usePaginatedList(resume.education, {
    initialCount: 20,
    incrementCount: 20,
    threshold: 15,
  });

  // Reset pagination when items are added
  useEffect(() => {
    if (resume.education.length > pagination.visibleCount) {
      pagination.reset();
    }
  }, [resume.education.length]);

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper to safely get highlights array
  const getHighlights = (edu) => Array.isArray(edu?.highlights) ? edu.highlights : [];

  const handleHighlightChange = (eduId, index, value) => {
    const edu = resume.education.find((e) => e.id === eduId);
    if (edu) {
      const highlights = [...getHighlights(edu)];
      highlights[index] = value;
      updateEducation(eduId, 'highlights', highlights);
    }
  };

  const addHighlight = (eduId) => {
    const edu = resume.education.find((e) => e.id === eduId);
    if (edu) {
      updateEducation(eduId, 'highlights', [...getHighlights(edu), '']);
    }
  };

  const removeHighlight = (eduId, index) => {
    const edu = resume.education.find((e) => e.id === eduId);
    if (edu) {
      const highlights = getHighlights(edu).filter((_, i) => i !== index);
      updateEducation(eduId, 'highlights', highlights);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          onClick={addEducation}
          className="btn-add"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      <div className="space-y-4">
        {pagination.visibleItems.map((edu, index) => (
          <div
            key={edu.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div
              className="flex items-center gap-2 p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleExpand(edu.id)}
            >
              {/* Reorder buttons */}
              <div className="reorder-buttons" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => reorderEducation(index, index - 1)}
                  disabled={index === 0}
                  className="reorder-btn"
                  title="Move up"
                  aria-label="Move education up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => reorderEducation(index, index + 1)}
                  disabled={index === resume.education.length - 1}
                  className="reorder-btn"
                  title="Move down"
                  aria-label="Move education down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {edu.institution || 'Institution Name'}
                </p>
              </div>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  const confirmed = await confirm({
                    title: 'Delete Education',
                    message: `Are you sure you want to delete "${edu.degree || 'this education'}" from "${edu.institution || 'this institution'}"? This action cannot be undone.`,
                    confirmText: 'Delete',
                    cancelText: 'Cancel',
                    variant: 'danger',
                  });
                  if (confirmed) {
                    removeEducation(edu.id);
                  }
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                aria-label={`Delete ${edu.degree || 'education'}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {expandedItems[edu.id] ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {/* Expanded Content */}
            {expandedItems[edu.id] && (
              <div className="p-4 space-y-4 border-t border-gray-200">
                <div>
                  <label className="form-label">Institution *</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    placeholder="University Name"
                    className="form-input"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Degree *</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="Bachelor of Science"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Field of Study</label>
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                      placeholder="Computer Science"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Start Date</label>
                    <MonthPicker
                      value={edu.startDate}
                      onChange={(value) => updateEducation(edu.id, 'startDate', value)}
                      placeholder="Select start date"
                    />
                  </div>
                  <div>
                    <label className="form-label">End Date</label>
                    <MonthPicker
                      value={edu.endDate}
                      onChange={(value) => updateEducation(edu.id, 'endDate', value)}
                      placeholder="Select end date"
                    />
                    {(() => {
                      const dateValidation = validateDateRange(edu.startDate, edu.endDate);
                      return !dateValidation.valid && (
                        <p className="form-error mt-1">
                          <AlertCircle className="w-3 h-3" />
                          {dateValidation.error}
                        </p>
                      );
                    })()}
                  </div>
                  <div>
                    <label className="form-label">GPA (optional)</label>
                    <input
                      type="text"
                      value={edu.gpa}
                      onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                      placeholder="3.8"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <label className="form-label">Highlights/Achievements</label>
                  <div className="space-y-2">
                    {getHighlights(edu).map((highlight, hIndex) => (
                      <div key={hIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => handleHighlightChange(edu.id, hIndex, e.target.value)}
                          placeholder="Dean's List, relevant coursework..."
                          className="form-input flex-1"
                        />
                        <button
                          onClick={() => removeHighlight(edu.id, hIndex)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addHighlight(edu.id)}
                      className="btn-add-inline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add highlight
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {resume.education.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No education added yet. Click "Add" to get started.
          </p>
        )}

        {pagination.needsPagination && (
          <ListPagination
            visibleCount={pagination.visibleCount}
            totalCount={pagination.totalCount}
            hiddenCount={pagination.hiddenCount}
            hasMore={pagination.hasMore}
            onShowMore={pagination.showMore}
            onShowAll={pagination.showAll}
            onShowLess={pagination.showLess}
          />
        )}
      </div>
    </div>
  );
}
