import { Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { useConfirm } from '../../../store/confirmStore';

export default function Skills() {
  const { resume, addSkillCategory, updateSkillCategory, removeSkillCategory } = useResumeStore();
  const { confirm } = useConfirm();
  const [newSkillInputs, setNewSkillInputs] = useState({});

  const addSkillToCategory = (categoryId, skill) => {
    const category = resume.skills.categories.find((c) => c.id === categoryId);
    if (category && skill.trim() && !category.items.includes(skill.trim())) {
      updateSkillCategory(categoryId, 'items', [...category.items, skill.trim()]);
    }
  };

  const handleAddSkill = (categoryId, e) => {
    const value = newSkillInputs[categoryId] || '';

    // Handle Enter key
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault();
      addSkillToCategory(categoryId, value);
      setNewSkillInputs((prev) => ({ ...prev, [categoryId]: '' }));
    }
    // Handle comma key
    else if (e.key === ',') {
      e.preventDefault();
      if (value.trim()) {
        addSkillToCategory(categoryId, value);
        setNewSkillInputs((prev) => ({ ...prev, [categoryId]: '' }));
      }
    }
  };

  const handleSkillInputChange = (categoryId, value) => {
    // Check if value contains comma - add skill before the comma
    if (value.includes(',')) {
      const parts = value.split(',');
      parts.forEach((part, index) => {
        if (part.trim() && index < parts.length - 1) {
          addSkillToCategory(categoryId, part);
        }
      });
      // Keep text after last comma
      setNewSkillInputs((prev) => ({ ...prev, [categoryId]: parts[parts.length - 1] }));
    } else {
      setNewSkillInputs((prev) => ({ ...prev, [categoryId]: value }));
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
      <div className="flex justify-end mb-3">
        <button
          onClick={addSkillCategory}
          className="btn-add"
        >
          <Plus className="w-4 h-4" />
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
                onClick={async () => {
                  const confirmed = await confirm({
                    title: 'Delete Skill Category',
                    message: `Are you sure you want to delete "${category.name || 'this category'}" and all its skills? This action cannot be undone.`,
                    confirmText: 'Delete',
                    cancelText: 'Cancel',
                    variant: 'danger',
                  });
                  if (confirmed) {
                    removeSkillCategory(category.id);
                  }
                }}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                aria-label={`Delete ${category.name || 'skill category'}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {category.items.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-100 hover:bg-primary-100 transition-colors"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(category.id, index)}
                    className="hover:text-red-600 transition-colors"
                    aria-label={`Remove ${skill}`}
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
              onChange={(e) => handleSkillInputChange(category.id, e.target.value)}
              onKeyDown={(e) => handleAddSkill(category.id, e)}
              placeholder="Type a skill and press Enter or comma"
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
