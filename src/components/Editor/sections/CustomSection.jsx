import { Trash2, Plus } from 'lucide-react';
import { useResumeStore } from '../../../store/resumeStore';

export default function CustomSection({ section }) {
  const { updateCustomSection, removeCustomSection } = useResumeStore();

  const handleAddItem = () => {
    const newContent = [...(section.content || []), { id: Date.now().toString(), text: '' }];
    updateCustomSection(section.id, 'content', newContent);
  };

  const handleUpdateItem = (itemId, value) => {
    const newContent = section.content.map(item =>
      item.id === itemId ? { ...item, text: value } : item
    );
    updateCustomSection(section.id, 'content', newContent);
  };

  const handleRemoveItem = (itemId) => {
    const newContent = section.content.filter(item => item.id !== itemId);
    updateCustomSection(section.id, 'content', newContent);
  };

  const handleDelete = () => {
    if (confirm('Delete this custom section?')) {
      removeCustomSection(section.id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Title Input */}
      <div>
        <label className="form-label">Section Title</label>
        <input
          type="text"
          value={section.title}
          onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
          className="form-input"
          placeholder="Section Title"
        />
      </div>

      {/* Section Type */}
      <div>
        <label className="form-label">Section Type</label>
        <select
          value={section.type || 'list'}
          onChange={(e) => updateCustomSection(section.id, 'type', e.target.value)}
          className="form-input"
        >
          <option value="list">Bullet List</option>
          <option value="text">Text Paragraph</option>
          <option value="grid">Two Column Grid</option>
        </select>
      </div>

      {/* Content based on type */}
      {section.type === 'text' ? (
        <div>
          <label className="form-label">Content</label>
          <textarea
            value={section.content?.[0]?.text || ''}
            onChange={(e) => updateCustomSection(section.id, 'content', [{ id: '1', text: e.target.value }])}
            placeholder="Enter your content here..."
            rows={4}
            className="form-textarea"
          />
        </div>
      ) : (
        <div>
          <label className="form-label">Items</label>
          <div className="space-y-2">
            {(section.content || []).map((item, index) => (
              <div key={item.id} className="flex gap-2">
                <span className="text-gray-400 text-sm pt-2 w-6">{index + 1}.</span>
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleUpdateItem(item.id, e.target.value)}
                  placeholder={section.type === 'grid' ? 'Label: Value' : 'List item...'}
                  className="form-input flex-1"
                />
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddItem}
              className="btn-add-inline"
            >
              <Plus className="w-3.5 h-3.5" />
              Add item
            </button>
          </div>
        </div>
      )}

      {/* Helper text */}
      <p className="text-xs text-gray-500">
        {section.type === 'list' && 'Add bullet points for this section.'}
        {section.type === 'text' && 'Add a paragraph of text for this section.'}
        {section.type === 'grid' && 'Add items in "Label: Value" format for a two-column layout.'}
      </p>

      {/* Delete Section Button */}
      <div className="pt-2 border-t border-gray-200">
        <button
          onClick={handleDelete}
          className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Delete this section
        </button>
      </div>
    </div>
  );
}
