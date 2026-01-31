import { Plus, Trash2, ChevronDown, ChevronUp, Link, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { useConfirm } from '../../../store/confirmStore';
import TagInput from '../../common/TagInput';

export default function Projects() {
  const { resume, addProject, updateProject, removeProject, reorderProjects } = useResumeStore();
  const { confirm } = useConfirm();
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper to safely get highlights array
  const getHighlights = (project) => Array.isArray(project?.highlights) ? project.highlights : [];

  // Helper to safely get technologies array
  const getTechnologies = (project) => Array.isArray(project?.technologies) ? project.technologies : [];

  const handleHighlightChange = (projectId, index, value) => {
    const project = resume.projects.find((p) => p.id === projectId);
    if (project) {
      const highlights = [...getHighlights(project)];
      highlights[index] = value;
      updateProject(projectId, 'highlights', highlights);
    }
  };

  const addHighlight = (projectId) => {
    const project = resume.projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, 'highlights', [...getHighlights(project), '']);
    }
  };

  const removeHighlight = (projectId, index) => {
    const project = resume.projects.find((p) => p.id === projectId);
    if (project) {
      const highlights = getHighlights(project).filter((_, i) => i !== index);
      updateProject(projectId, 'highlights', highlights);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          onClick={addProject}
          className="btn-add"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="space-y-4">
        {resume.projects.map((project, index) => (
          <div
            key={project.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div
              className="flex items-center gap-2 p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleExpand(project.id)}
            >
              {/* Reorder buttons */}
              <div className="reorder-buttons" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => reorderProjects(index, index - 1)}
                  disabled={index === 0}
                  className="reorder-btn"
                  title="Move up"
                  aria-label="Move project up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => reorderProjects(index, index + 1)}
                  disabled={index === resume.projects.length - 1}
                  className="reorder-btn"
                  title="Move down"
                  aria-label="Move project down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {project.name || 'New Project'}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {getTechnologies(project).slice(0, 3).join(', ') || 'No technologies'}
                </p>
              </div>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  const confirmed = await confirm({
                    title: 'Delete Project',
                    message: `Are you sure you want to delete "${project.name || 'this project'}"? This action cannot be undone.`,
                    confirmText: 'Delete',
                    cancelText: 'Cancel',
                    variant: 'danger',
                  });
                  if (confirmed) {
                    removeProject(project.id);
                  }
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                aria-label={`Delete ${project.name || 'project'}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {expandedItems[project.id] ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {/* Expanded Content */}
            {expandedItems[project.id] && (
              <div className="p-4 space-y-4 border-t border-gray-200">
                <div>
                  <label className="form-label">Project Name *</label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                    placeholder="My Awesome Project"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    placeholder="Brief description of the project..."
                    rows={2}
                    className="form-textarea"
                  />
                </div>

                <div>
                  <label className="form-label flex items-center gap-1">
                    <Link className="w-3.5 h-3.5" /> Project Link
                  </label>
                  <input
                    type="text"
                    value={project.link}
                    onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                    placeholder="github.com/username/project"
                    className="form-input"
                  />
                </div>

                {/* Technologies */}
                <div>
                  <label className="form-label">Technologies Used</label>
                  <TagInput
                    tags={getTechnologies(project)}
                    onChange={(newTechnologies) => updateProject(project.id, 'technologies', newTechnologies)}
                    placeholder="Type technology and press Enter or comma"
                  />
                </div>

                {/* Highlights */}
                <div>
                  <label className="form-label">Key Features/Achievements</label>
                  <div className="space-y-2">
                    {getHighlights(project).map((highlight, hIndex) => (
                      <div key={hIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => handleHighlightChange(project.id, hIndex, e.target.value)}
                          placeholder="Key feature or achievement..."
                          className="form-input flex-1"
                        />
                        <button
                          onClick={() => removeHighlight(project.id, hIndex)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addHighlight(project.id)}
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

        {resume.projects.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No projects added yet. Click "Add" to get started.
          </p>
        )}
      </div>
    </div>
  );
}
