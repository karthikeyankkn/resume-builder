import { X, Check, Trash2, Copy, ImagePlus, Palette } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useTemplateStore } from '../../store/templateStore';
import { useResumeStore } from '../../store/resumeStore';

export default function TemplateGallery() {
  const { closeTemplateGallery, openTemplateBuilder } = useUIStore();
  const { getAllTemplates, activeTemplate, setActiveTemplate, deleteCustomTemplate, duplicateTemplate } = useTemplateStore();
  const { setTemplate } = useResumeStore();

  const templates = getAllTemplates();

  const handleSelectTemplate = (templateId) => {
    setActiveTemplate(templateId);
    setTemplate(templateId);
  };

  const handleDelete = (e, templateId) => {
    e.stopPropagation();
    if (confirm('Delete this custom template?')) {
      deleteCustomTemplate(templateId);
    }
  };

  const handleDuplicate = (e, templateId) => {
    e.stopPropagation();
    duplicateTemplate(templateId);
  };

  const handleCreateFromScreenshot = () => {
    closeTemplateGallery();
    openTemplateBuilder();
  };

  return (
    <div className="modal-overlay" onClick={closeTemplateGallery}>
      <div
        className="modal-content w-full max-w-4xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary-600" />
            Template Gallery
          </h2>
          <button
            onClick={closeTemplateGallery}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Create from Screenshot Button */}
          <div className="mb-6">
            <button
              onClick={handleCreateFromScreenshot}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg
                         text-gray-600 hover:border-primary-400 hover:text-primary-600
                         transition-colors flex items-center justify-center gap-2"
            >
              <ImagePlus className="w-5 h-5" />
              Create Template from Screenshot
            </button>
          </div>

          {/* Built-in Templates */}
          <h3 className="text-sm font-medium text-gray-700 mb-3">Built-in Templates</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {templates.filter((t) => !t.isCustom).map((template) => (
              <div
                key={template.id}
                onClick={() => handleSelectTemplate(template.id)}
                className={`template-card p-3 ${activeTemplate === template.id ? 'selected' : ''}`}
              >
                {/* Template Preview */}
                <div
                  className="aspect-[1/1.414] rounded mb-2 relative overflow-hidden"
                  style={{ backgroundColor: template.styles.colors.background }}
                >
                  {/* Mini preview */}
                  <div className="p-2 transform scale-[0.15] origin-top-left w-[666%] h-[666%]">
                    <div className="text-center mb-4">
                      <div
                        className="font-bold text-2xl"
                        style={{ color: template.styles.colors.text }}
                      >
                        John Doe
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: template.styles.colors.primary }}
                      >
                        Software Engineer
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div
                        className="h-1 rounded"
                        style={{ backgroundColor: template.styles.colors.primary, width: '60%' }}
                      />
                      <div className="space-y-1">
                        <div className="h-0.5 bg-gray-200 rounded" />
                        <div className="h-0.5 bg-gray-200 rounded w-4/5" />
                        <div className="h-0.5 bg-gray-200 rounded w-3/5" />
                      </div>
                    </div>
                  </div>

                  {/* Selected indicator */}
                  {activeTemplate === template.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div>
                  <h4 className="font-medium text-sm text-gray-900">{template.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-1">{template.description}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-1 mt-2">
                  <button
                    onClick={(e) => handleDuplicate(e, template.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Templates */}
          {templates.filter((t) => t.isCustom).length > 0 && (
            <>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Custom Templates</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {templates.filter((t) => t.isCustom).map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleSelectTemplate(template.id)}
                    className={`template-card p-3 ${activeTemplate === template.id ? 'selected' : ''}`}
                  >
                    {/* Template Preview */}
                    <div
                      className="aspect-[1/1.414] rounded mb-2 relative overflow-hidden"
                      style={{ backgroundColor: template.styles.colors.background }}
                    >
                      <div className="p-2 transform scale-[0.15] origin-top-left w-[666%] h-[666%]">
                        <div className="text-center mb-4">
                          <div
                            className="font-bold text-2xl"
                            style={{ color: template.styles.colors.text }}
                          >
                            John Doe
                          </div>
                          <div
                            className="text-sm"
                            style={{ color: template.styles.colors.primary }}
                          >
                            Software Engineer
                          </div>
                        </div>
                      </div>

                      {activeTemplate === template.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}

                      {template.createdFrom === 'screenshot' && (
                        <div className="absolute bottom-2 left-2 text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                          AI Generated
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-gray-900">{template.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{template.description}</p>
                    </div>

                    <div className="flex gap-1 mt-2">
                      <button
                        onClick={(e) => handleDuplicate(e, template.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, template.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button onClick={closeTemplateGallery} className="btn-primary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
