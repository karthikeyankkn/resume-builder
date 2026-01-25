import { Wrench, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useResumeStore } from '../../../store/resumeStore';

export default function Skills() {
  const { resume, addSkillCategory, updateSkillCategory, removeSkillCategory } = useResumeStore();
  const [newSkillInputs, setNewSkillInputs] = useState({});

  const handleAddSkill = (categoryId, e) => {
    if (e.key === 'Enter' && newSkillInputs[categoryId]?.trim()) {
      const category = resume.skills.categories.find((c) => c.id === categoryId);
      if (category) {
        updateSkillCategory(categoryId, 'items', [...category.items, newSkillInputs[categoryId].trim()]);
        setNewSkillInputs((prev) => ({ ...prev, [categoryId]: '' }));
      }
    }
  };

  const removeSkill = (categoryId, skillIndex) => {
    const category = resume.skills.categories.find((c) => c.id === categoryId);
    if (category) {
      const items = category.items.filter((_, i) => i !== skillIndex);
      updateSkillCategory(categoryId, 'items', items);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-primary-600" />
          Skills
        </h2>
        <button
          onClick={addSkillCategory}
          className="btn-secondary text-sm py-1.5 px-3"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Category
        </button>
      </div>

      <div className="space-y-4">
        {resume.skills.categories.map((category) => (
          <div
            key={category.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={category.name}
                onChange={(e) => updateSkillCategory(category.id, 'name', e.target.value)}
                placeholder="Category Name"
                className="form-input flex-1 font-medium"
              />
              <button
                onClick={() => {
                  if (confirm('Delete this skill category?')) {
                    removeSkillCategory(category.id);
                  }
                }}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {category.items.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(category.id, index)}
                    className="hover:text-primary-900"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add New Skill Input */}
            <input
              type="text"
              value={newSkillInputs[category.id] || ''}
              onChange={(e) => setNewSkillInputs((prev) => ({ ...prev, [category.id]: e.target.value }))}
              onKeyDown={(e) => handleAddSkill(category.id, e)}
              placeholder="Type a skill and press Enter"
              className="form-input text-sm"
            />
          </div>
        ))}

        {resume.skills.categories.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No skill categories added yet. Click "Add Category" to get started.
          </p>
        )}
      </div>
    </div>
  );
}
