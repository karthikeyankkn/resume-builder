import { X, Palette, Layout, Type, Check, RotateCcw, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useTemplateStore } from '../../store/templateStore';

// Mini preview component for template editor
function MiniPreview({ config }) {
  const { colors, fonts, layout } = config;
  const hasSidebar = layout?.sidebar?.enabled;
  const sidebarPosition = layout?.sidebar?.position || 'right';
  const headerStyle = layout?.headerStyle || 'centered';

  const isColoredHeader = colors.headerBg && colors.headerBg !== '#ffffff' && colors.headerBg !== colors.background;
  const headerTextColor = isColoredHeader ? '#ffffff' : colors.text;

  return (
    <div
      className="w-full h-full rounded-lg overflow-hidden border border-gray-200"
      style={{ backgroundColor: colors.background, fontFamily: fonts.body }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: colors.headerBg || colors.background,
          padding: '12px',
          textAlign: headerStyle === 'centered' ? 'center' : 'left'
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 700, color: headerTextColor, fontFamily: fonts.heading }}>
          John Doe
        </div>
        <div style={{ fontSize: '8px', color: isColoredHeader ? 'rgba(255,255,255,0.8)' : colors.primary }}>
          Software Engineer
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '8px', display: 'flex', gap: '8px' }}>
        {hasSidebar && sidebarPosition === 'left' && (
          <div style={{ width: '30%', backgroundColor: colors.sidebarBg || '#f8fafc', padding: '6px', borderRadius: '4px' }}>
            <div style={{ fontSize: '6px', fontWeight: 600, color: colors.primary, marginBottom: '4px', borderBottom: `1px solid ${colors.primary}`, paddingBottom: '2px' }}>SKILLS</div>
            <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
              {['React', 'Node'].map(s => (
                <span key={s} style={{ fontSize: '5px', backgroundColor: `${colors.primary}20`, color: colors.primary, padding: '1px 3px', borderRadius: '2px' }}>{s}</span>
              ))}
            </div>
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '6px' }}>
            <div style={{ fontSize: '6px', fontWeight: 600, color: colors.primary, marginBottom: '3px', borderBottom: `1px solid ${colors.primary}`, paddingBottom: '2px' }}>EXPERIENCE</div>
            <div style={{ fontSize: '6px', fontWeight: 600, color: colors.text }}>Position Title</div>
            <div style={{ fontSize: '5px', color: colors.primary }}>Company</div>
            <div style={{ height: '2px', backgroundColor: '#e5e7eb', width: '80%', marginTop: '3px', borderRadius: '1px' }} />
          </div>
          <div>
            <div style={{ fontSize: '6px', fontWeight: 600, color: colors.primary, marginBottom: '3px', borderBottom: `1px solid ${colors.primary}`, paddingBottom: '2px' }}>EDUCATION</div>
            <div style={{ fontSize: '6px', fontWeight: 600, color: colors.text }}>Degree</div>
            <div style={{ fontSize: '5px', color: colors.primary }}>University</div>
          </div>
        </div>
        {hasSidebar && sidebarPosition === 'right' && (
          <div style={{ width: '30%', backgroundColor: colors.sidebarBg || '#f8fafc', padding: '6px', borderRadius: '4px' }}>
            <div style={{ fontSize: '6px', fontWeight: 600, color: colors.primary, marginBottom: '4px', borderBottom: `1px solid ${colors.primary}`, paddingBottom: '2px' }}>SKILLS</div>
            <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
              {['React', 'Node'].map(s => (
                <span key={s} style={{ fontSize: '5px', backgroundColor: `${colors.primary}20`, color: colors.primary, padding: '1px 3px', borderRadius: '2px' }}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TemplateEditor() {
  const { closeTemplateEditor, editingTemplateId } = useUIStore();
  const { getAllTemplates, updateCustomTemplate, duplicateTemplate, setActiveTemplate } = useTemplateStore();

  const templates = getAllTemplates();
  const originalTemplate = templates.find(t => t.id === editingTemplateId);

  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [config, setConfig] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize state from template
  useEffect(() => {
    if (originalTemplate) {
      setTemplateName(originalTemplate.name);
      setTemplateDescription(originalTemplate.description || '');
      setConfig({
        layout: { ...originalTemplate.layout },
        colors: { ...originalTemplate.styles.colors },
        fonts: { ...originalTemplate.styles.fonts },
        spacing: { ...originalTemplate.styles.spacing }
      });
    }
  }, [originalTemplate]);

  if (!originalTemplate || !config) {
    return null;
  }

  const isBuiltIn = !originalTemplate.isCustom;

  const handleConfigChange = (section, key, value) => {
    setHasChanges(true);
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleNestedChange = (section, parent, key, value) => {
    setHasChanges(true);
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section][parent],
          [key]: value
        }
      }
    }));
  };

  const handleReset = () => {
    if (originalTemplate) {
      setTemplateName(originalTemplate.name);
      setTemplateDescription(originalTemplate.description || '');
      setConfig({
        layout: { ...originalTemplate.layout },
        colors: { ...originalTemplate.styles.colors },
        fonts: { ...originalTemplate.styles.fonts },
        spacing: { ...originalTemplate.styles.spacing }
      });
      setHasChanges(false);
    }
  };

  const handleSave = () => {
    if (isBuiltIn) {
      // Create a copy for built-in templates
      const newTemplateId = duplicateTemplate(editingTemplateId);
      if (newTemplateId) {
        updateCustomTemplate(newTemplateId, {
          name: templateName,
          description: templateDescription,
          layout: config.layout,
          styles: {
            colors: config.colors,
            fonts: config.fonts,
            spacing: config.spacing
          }
        });
        setActiveTemplate(newTemplateId);
      }
    } else {
      // Update existing custom template
      updateCustomTemplate(editingTemplateId, {
        name: templateName,
        description: templateDescription,
        layout: config.layout,
        styles: {
          colors: config.colors,
          fonts: config.fonts,
          spacing: config.spacing
        }
      });
    }
    closeTemplateEditor();
  };

  return (
    <div className="modal-overlay" onClick={closeTemplateEditor}>
      <div
        className="modal-content w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-gray-50 rounded-t-xl">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Palette className="w-6 h-6 text-primary-600" />
              Edit Template
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isBuiltIn ? 'Customize this template (changes will be saved as a new template)' : 'Modify your custom template'}
            </p>
          </div>
          <button
            onClick={closeTemplateEditor}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Template Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Template Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => {
                        setTemplateName(e.target.value);
                        setHasChanges(true);
                      }}
                      className="form-input"
                      placeholder="Template name"
                    />
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      value={templateDescription}
                      onChange={(e) => {
                        setTemplateDescription(e.target.value);
                        setHasChanges(true);
                      }}
                      className="form-input"
                      placeholder="Short description"
                    />
                  </div>
                </div>
              </div>

              {/* Layout Settings */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-gray-500" />
                  Layout
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Columns</label>
                    <select
                      value={config.layout.columns}
                      onChange={(e) => handleConfigChange('layout', 'columns', Number(e.target.value))}
                      className="form-input"
                    >
                      <option value={1}>Single Column</option>
                      <option value={2}>Two Columns</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Header Style</label>
                    <select
                      value={config.layout.headerStyle}
                      onChange={(e) => handleConfigChange('layout', 'headerStyle', e.target.value)}
                      className="form-input"
                    >
                      <option value="centered">Centered</option>
                      <option value="left">Left Aligned</option>
                      <option value="split">Split</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={config.layout.sidebar?.enabled || false}
                      onChange={(e) => handleNestedChange('layout', 'sidebar', 'enabled', e.target.checked)}
                      className="rounded text-primary-600"
                    />
                    <span className="text-sm text-gray-700">Enable Sidebar</span>
                  </label>
                  {config.layout.sidebar?.enabled && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Position:</span>
                      <select
                        value={config.layout.sidebar?.position || 'right'}
                        onChange={(e) => handleNestedChange('layout', 'sidebar', 'position', e.target.value)}
                        className="form-input py-1 text-sm"
                      >
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Color Settings */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-gray-500" />
                  Colors
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'primary', label: 'Primary' },
                    { key: 'secondary', label: 'Secondary' },
                    { key: 'accent', label: 'Accent' },
                    { key: 'text', label: 'Text' },
                    { key: 'background', label: 'Background' },
                    { key: 'headerBg', label: 'Header Bg' }
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="form-label">{label}</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.colors[key] || '#ffffff'}
                          onChange={(e) => handleConfigChange('colors', key, e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border border-gray-200"
                        />
                        <input
                          type="text"
                          value={config.colors[key] || ''}
                          onChange={(e) => handleConfigChange('colors', key, e.target.value)}
                          className="form-input flex-1 font-mono text-xs"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {config.layout.sidebar?.enabled && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="form-label">Sidebar Background</label>
                    <div className="flex gap-2 max-w-xs">
                      <input
                        type="color"
                        value={config.colors.sidebarBg || '#f8fafc'}
                        onChange={(e) => handleConfigChange('colors', 'sidebarBg', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-200"
                      />
                      <input
                        type="text"
                        value={config.colors.sidebarBg || '#f8fafc'}
                        onChange={(e) => handleConfigChange('colors', 'sidebarBg', e.target.value)}
                        className="form-input flex-1 font-mono text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Typography Settings */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Type className="w-5 h-5 text-gray-500" />
                  Typography
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Heading Font</label>
                    <select
                      value={config.fonts.heading}
                      onChange={(e) => handleConfigChange('fonts', 'heading', e.target.value)}
                      className="form-input"
                    >
                      <option value="Inter">Inter (Modern)</option>
                      <option value="Merriweather">Merriweather (Classic)</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Body Font</label>
                    <select
                      value={config.fonts.body}
                      onChange={(e) => handleConfigChange('fonts', 'body', e.target.value)}
                      className="form-input"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Merriweather">Merriweather</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {[
                    { key: 'name', label: 'Name Size' },
                    { key: 'title', label: 'Title Size' },
                    { key: 'sectionTitle', label: 'Section Title' },
                    { key: 'body', label: 'Body Size' }
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="form-label text-xs">{label}</label>
                      <input
                        type="text"
                        value={config.fonts.sizes?.[key] || ''}
                        onChange={(e) => handleNestedChange('fonts', 'sizes', key, e.target.value)}
                        className="form-input text-sm font-mono"
                        placeholder="12px"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Spacing Settings */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Spacing</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: 'padding', label: 'Padding' },
                    { key: 'sectionGap', label: 'Section Gap' },
                    { key: 'itemGap', label: 'Item Gap' }
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="form-label text-xs">{label}</label>
                      <input
                        type="text"
                        value={config.spacing?.[key] || ''}
                        onChange={(e) => handleConfigChange('spacing', key, e.target.value)}
                        className="form-input text-sm font-mono"
                        placeholder="20px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-0">
                <h3 className="font-semibold text-gray-900 mb-3">Live Preview</h3>
                <div className="aspect-[1/1.414] bg-gray-100 rounded-xl p-3">
                  <MiniPreview config={config} />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Preview updates as you make changes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t bg-gray-50 rounded-b-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              disabled={!hasChanges}
              className="btn btn-secondary inline-flex items-center gap-2 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            {hasChanges && (
              <span className="text-sm text-amber-600">Unsaved changes</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={closeTemplateEditor}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isBuiltIn ? 'Save as New Template' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
