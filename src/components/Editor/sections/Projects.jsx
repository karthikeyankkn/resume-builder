import { Plus, Trash2, ChevronDown, ChevronUp, X, Link } from 'lucide-react';
import { useState } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { useConfirm } from '../../../store/confirmStore';

export default function Projects() {
  const { resume, addProject, updateProject, removeProject } = useResumeStore();
  const { confirm } = useConfirm();
  const [expandedItems, setExpandedItems] = useState({});
  const [newTechInputs, setNewTechInputs] = useState({});

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddTech = (projectId, e) => {
    if (e.key === 'Enter' && newTechInputs[projectId]?.trim()) {
      const project = resume.projects.find((p) => p.id === projectId);
      if (project) {
        updateProject(projectId, 'technologies', [...project.technologies, newTechInputs[projectId].trim()]);
        setNewTechInputs((prev) => ({ ...prev, [projectId]: '' }));
      }
    }
  };

  const removeTech = (projectId, techIndex) => {
    const project = resume.projects.find((p) => p.id === projectId);
    if (project) {
      const technologies = project.technologies.filter((_, i) => i !== techIndex);
      updateProject(projectId, 'technologies', technologies);
    }
  };

  const handleHighlightChange = (projectId, index, value) => {
    const project = resume.projects.find((p) => p.id === projectId);
    if (project) {
      const highlights = [...project.highlights];
      highlights[index] = value;
      updateProject(projectId, 'highlights', highlights);
    }
  };

  const addHighlight = (projectId) => {
    const project = resume.projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, 'highlights', [...project.highlights, '']);
    }
  };

  const removeHighlight = (projectId, index) => {
    const project = resume.projects.find((p) => p.id === projectId);
    if (project) {
      const highlights = project.highlights.filter((_, i) => i !== index);
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
        {resume.projects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div
              className="flex items-center gap-2 p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleExpand(project.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {project.name || 'New Project'}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {project.technologies.slice(0, 3).join(', ') || 'No technologies'}
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
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-sm"
                      >
                        {tech}
                        <button
                          onClick={() => removeTech(project.id, index)}
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={newTechInputs[project.id] || ''}
                    onChange={(e) => setNewTechInputs((prev) => ({ ...prev, [project.id]: e.target.value }))}
                    onKeyDown={(e) => handleAddTech(project.id, e)}
                    placeholder="Type technology and press Enter"
                    className="form-input text-sm"
                  />
                </div>

                {/* Highlights */}
                <div>
                  <label className="form-label">Key Features/Achievements</label>
                  <div className="space-y-2">
                    {project.highlights.map((highlight, hIndex) => (
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
