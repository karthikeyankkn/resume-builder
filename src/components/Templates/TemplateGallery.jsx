import { X, Check, Trash2, Copy, ImagePlus, Palette, Pencil } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useTemplateStore } from '../../store/templateStore';
import { useResumeStore } from '../../store/resumeStore';
import { useConfirm } from '../../store/confirmStore';

// Helper to determine if a color is dark
function isDarkColor(color) {
  if (!color) return false;
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

// Mini template preview component that accurately represents the template layout
function TemplatePreview({ template }) {
  const { colors, fonts } = template.styles;
  const { layout } = template;
  const hasSidebar = layout?.sidebar?.enabled;
  const sidebarPosition = layout?.sidebar?.position || 'right';
  const headerStyle = layout?.headerStyle || 'centered';

  // Detect dark backgrounds
  const isDarkBackground = isDarkColor(colors.background);
  const isDarkHeader = isDarkColor(colors.headerBg);
  const placeholderColor = isDarkBackground ? 'rgba(255,255,255,0.15)' : '#e5e7eb';

  // Header section
  const renderHeader = () => {
    const isColoredHeader = colors.headerBg && colors.headerBg !== '#ffffff' && colors.headerBg !== colors.background;
    const headerTextColor = (isColoredHeader || isDarkHeader) ? '#ffffff' : colors.text;
    const headerSubColor = (isColoredHeader || isDarkHeader) ? 'rgba(255,255,255,0.8)' : colors.primary;

    return (
      <div
        style={{
          backgroundColor: colors.headerBg || colors.background,
          padding: '8px 10px',
          textAlign: headerStyle === 'centered' ? 'center' : 'left',
          marginBottom: '6px'
        }}
      >
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: '12px',
            color: headerTextColor,
            marginBottom: '2px'
          }}
        >
          John Doe
        </div>
        <div
          style={{
            fontSize: '6px',
            color: headerSubColor,
            marginBottom: '3px'
          }}
        >
          Software Engineer
        </div>
        <div
          style={{
            fontSize: '4px',
            color: (isColoredHeader || isDarkHeader) ? 'rgba(255,255,255,0.6)' : colors.secondary,
            display: 'flex',
            justifyContent: headerStyle === 'centered' ? 'center' : 'flex-start',
            gap: '6px'
          }}
        >
          <span>email@example.com</span>
          <span>•</span>
          <span>(555) 123-4567</span>
        </div>
      </div>
    );
  };

  // Section title
  const renderSectionTitle = (title) => (
    <div
      style={{
        fontSize: '5px',
        fontWeight: 600,
        color: colors.primary,
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
        marginBottom: '3px',
        paddingBottom: '2px',
        borderBottom: `1px solid ${colors.primary}`
      }}
    >
      {title}
    </div>
  );

  // Content placeholder lines
  const renderContentLines = (count = 3, widths = ['100%', '85%', '70%']) => (
    <div style={{ marginBottom: '5px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            height: '2px',
            backgroundColor: placeholderColor,
            borderRadius: '1px',
            marginBottom: '2px',
            width: widths[i % widths.length]
          }}
        />
      ))}
    </div>
  );

  // Experience item
  const renderExperienceItem = () => (
    <div style={{ marginBottom: '5px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
        <div>
          <div style={{ fontSize: '5px', fontWeight: 600, color: colors.text }}>Position Title</div>
          <div style={{ fontSize: '4px', color: colors.primary }}>Company Name</div>
        </div>
        <div style={{ fontSize: '4px', color: colors.secondary }}>2023</div>
      </div>
      {renderContentLines(2, ['90%', '75%'])}
    </div>
  );

  // Skill category
  const renderSkillItem = () => (
    <div style={{ marginBottom: '3px' }}>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {['React', 'Node', 'Python'].map((skill) => (
          <span
            key={skill}
            style={{
              fontSize: '4px',
              backgroundColor: `${colors.primary}15`,
              color: colors.primary,
              padding: '1px 3px',
              borderRadius: '2px'
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );

  // Main content sections
  const renderMainContent = () => (
    <div style={{ flex: 1 }}>
      <div style={{ marginBottom: '6px' }}>
        {renderSectionTitle('Experience')}
        {renderExperienceItem()}
        {renderExperienceItem()}
      </div>
      <div style={{ marginBottom: '6px' }}>
        {renderSectionTitle('Education')}
        <div style={{ marginBottom: '3px' }}>
          <div style={{ fontSize: '5px', fontWeight: 600, color: colors.text }}>Bachelor's Degree</div>
          <div style={{ fontSize: '4px', color: colors.primary }}>University Name</div>
        </div>
      </div>
      {!hasSidebar && (
        <div>
          {renderSectionTitle('Skills')}
          {renderSkillItem()}
        </div>
      )}
    </div>
  );

  // Sidebar content
  const renderSidebar = () => (
    <div
      style={{
        width: '35%',
        backgroundColor: colors.sidebarBg || '#f8fafc',
        padding: '5px',
        borderRadius: '2px'
      }}
    >
      <div style={{ marginBottom: '5px' }}>
        {renderSectionTitle('Skills')}
        {renderSkillItem()}
      </div>
      <div>
        {renderSectionTitle('Certifications')}
        <div style={{ fontSize: '4px', color: colors.text }}>AWS Certified</div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: colors.background,
        fontFamily: fonts.body,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {renderHeader()}
      <div style={{ padding: '0 8px 8px', flex: 1 }}>
        {hasSidebar ? (
          <div style={{ display: 'flex', gap: '6px' }}>
            {sidebarPosition === 'left' && renderSidebar()}
            {renderMainContent()}
            {sidebarPosition === 'right' && renderSidebar()}
          </div>
        ) : (
          renderMainContent()
        )}
      </div>
    </div>
  );
}

// Template card component
function TemplateCard({ template, isActive, onSelect, onDuplicate, onDelete, onEdit, showDelete = false }) {
  return (
    <div
      onClick={onSelect}
      className={`template-card p-3 bg-white ${isActive ? 'selected' : ''}`}
    >
      {/* Template Preview */}
      <div
        className="aspect-[1/1.414] rounded-md mb-3 relative overflow-hidden border border-gray-200 shadow-sm"
      >
        <TemplatePreview template={template} />

        {/* Selected indicator */}
        {isActive && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center shadow-md">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}

        {/* AI Generated badge */}
        {template.createdFrom === 'screenshot' && (
          <div className="absolute bottom-2 left-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
            AI Generated
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary-600/0 hover:bg-primary-600/5 transition-colors" />
      </div>

      {/* Template Info */}
      <div className="mb-2">
        <h4 className="font-semibold text-sm text-gray-900">{template.name}</h4>
        <p className="text-xs text-gray-500 line-clamp-1">{template.description}</p>
      </div>

      {/* Layout badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
          {template.layout.columns === 2 ? '2-Column' : 'Single Column'}
        </span>
        {template.layout.sidebar?.enabled && (
          <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
            Sidebar
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1 pt-2 border-t border-gray-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
          title="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          title="Duplicate"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Duplicate</span>
        </button>
        {showDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function TemplateGallery() {
  const { closeTemplateGallery, openTemplateBuilder, openTemplateEditor } = useUIStore();
  const { getAllTemplates, activeTemplate, setActiveTemplate, deleteCustomTemplate, duplicateTemplate } = useTemplateStore();
  const { setTemplate } = useResumeStore();
  const { confirm } = useConfirm();

  const templates = getAllTemplates();
  const builtInTemplates = templates.filter((t) => !t.isCustom);
  const customTemplates = templates.filter((t) => t.isCustom);

  const handleSelectTemplate = (templateId) => {
    setActiveTemplate(templateId);
    setTemplate(templateId);
  };

  const handleDelete = async (templateId) => {
    const template = templates.find(t => t.id === templateId);
    const confirmed = await confirm({
      title: 'Delete Custom Template',
      message: `Are you sure you want to delete "${template?.name || 'this template'}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (confirmed) {
      deleteCustomTemplate(templateId);
    }
  };

  const handleDuplicate = (templateId) => {
    duplicateTemplate(templateId);
  };

  const handleEdit = (templateId) => {
    closeTemplateGallery();
    openTemplateEditor(templateId);
  };

  const handleCreateFromScreenshot = () => {
    closeTemplateGallery();
    openTemplateBuilder();
  };

  return (
    <div className="modal-overlay" onClick={closeTemplateGallery} role="presentation">
      <div
        className="modal-content w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-gallery-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-gray-50 rounded-t-xl">
          <div>
            <h2 id="template-gallery-title" className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Palette className="w-6 h-6 text-primary-600" aria-hidden="true" />
              Template Gallery
            </h2>
            <p className="text-sm text-gray-500 mt-1">Choose a template that fits your style</p>
          </div>
          <button
            onClick={closeTemplateGallery}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Close template gallery"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Create from Screenshot Button */}
          <div className="mb-8">
            <button
              onClick={handleCreateFromScreenshot}
              className="w-full py-4 border-2 border-dashed border-primary-200 rounded-xl
                         text-primary-600 hover:border-primary-400 hover:bg-primary-50
                         transition-all flex items-center justify-center gap-3 font-medium"
            >
              <ImagePlus className="w-5 h-5" />
              Create Template from Screenshot
            </button>
          </div>

          {/* Built-in Templates */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              Built-in Templates
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {builtInTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isActive={activeTemplate === template.id}
                  onSelect={() => handleSelectTemplate(template.id)}
                  onDuplicate={() => handleDuplicate(template.id)}
                  onEdit={() => handleEdit(template.id)}
                  showDelete={false}
                />
              ))}
            </div>
          </div>

          {/* Custom Templates */}
          {customTemplates.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Custom Templates
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {customTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isActive={activeTemplate === template.id}
                    onSelect={() => handleSelectTemplate(template.id)}
                    onDuplicate={() => handleDuplicate(template.id)}
                    onEdit={() => handleEdit(template.id)}
                    onDelete={() => handleDelete(template.id)}
                    showDelete={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center gap-3 p-5 border-t bg-gray-50 rounded-b-xl">
          <p className="text-sm text-gray-500">
            {templates.length} templates available
          </p>
          <button onClick={closeTemplateGallery} className="btn btn-primary px-6">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
