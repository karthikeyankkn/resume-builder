import { X, Upload, Loader2, Sparkles, Palette, Layout, Type, Check } from 'lucide-react';
import { useState, useRef } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useTemplateStore } from '../../store/templateStore';

// Color extraction helper (simplified)
function extractColors(imageData) {
  // This is a simplified color extraction
  // In production, you'd use a more sophisticated algorithm
  const colors = {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#0ea5e9',
    text: '#1e293b',
    background: '#ffffff'
  };
  return colors;
}

export default function TemplateBuilder() {
  const { closeTemplateBuilder } = useUIStore();
  const { createFromScreenshot, setActiveTemplate } = useTemplateStore();

  const [step, setStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [templateName, setTemplateName] = useState('My Custom Template');
  const [templateConfig, setTemplateConfig] = useState({
    layout: {
      columns: 1,
      headerStyle: 'centered',
      sectionOrder: ['personalInfo', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
      sidebar: { enabled: false, position: 'right', sections: ['skills', 'certifications'] }
    },
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#0ea5e9',
      text: '#1e293b',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      sizes: { name: '28px', title: '14px', sectionTitle: '14px', body: '11px' }
    },
    spacing: {
      sectionGap: '20px',
      itemGap: '12px',
      padding: '40px'
    }
  });

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    setAnalyzing(true);

    // Simulate AI analysis (in production, this would call Claude Vision API)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock analysis result
    const mockResult = {
      layout: {
        columns: Math.random() > 0.5 ? 2 : 1,
        headerStyle: ['centered', 'left', 'split'][Math.floor(Math.random() * 3)],
        hasSidebar: Math.random() > 0.5
      },
      colors: {
        primary: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
        secondary: '#64748b',
        accent: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
        text: '#1e293b',
        background: '#ffffff'
      },
      fonts: {
        style: ['modern', 'classic', 'creative'][Math.floor(Math.random() * 3)]
      },
      confidence: 0.85
    };

    setAnalysisResult(mockResult);
    setTemplateConfig((prev) => ({
      ...prev,
      layout: {
        ...prev.layout,
        columns: mockResult.layout.columns,
        headerStyle: mockResult.layout.headerStyle,
        sidebar: {
          ...prev.layout.sidebar,
          enabled: mockResult.layout.hasSidebar
        }
      },
      colors: mockResult.colors
    }));

    setAnalyzing(false);
    setStep(2);
  };

  const handleCreateTemplate = () => {
    const templateId = createFromScreenshot({
      layout: templateConfig.layout,
      colors: templateConfig.colors,
      fonts: templateConfig.fonts,
      spacing: templateConfig.spacing,
      name: templateName
    });

    setActiveTemplate(templateId);
    closeTemplateBuilder();
  };

  return (
    <div className="modal-overlay" onClick={closeTemplateBuilder}>
      <div
        className="modal-content w-full max-w-3xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Create Template from Design
          </h2>
          <button
            onClick={closeTemplateBuilder}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 border-b">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                            ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <span className="text-sm font-medium">Upload</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-200" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                            ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <span className="text-sm font-medium">Customize</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-200" />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                            ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              3
            </div>
            <span className="text-sm font-medium">Create</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload a Resume Design
                </h3>
                <p className="text-sm text-gray-500">
                  Upload a screenshot or image of a resume design you like.
                  Our AI will analyze it and create a matching template.
                </p>
              </div>

              {!imagePreview ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center
                             hover:border-primary-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-400">
                    PNG, JPG, or WEBP (max 5MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Uploaded design"
                      className="max-h-80 mx-auto"
                    />
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setUploadedImage(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={analyzeImage}
                    disabled={analyzing}
                    className="btn-primary w-full py-3"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing Design...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Analyze with AI
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Customize */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Customize Your Template
                </h3>
                <p className="text-sm text-gray-500">
                  Fine-tune the detected settings or adjust them to your preference.
                </p>
              </div>

              {/* Template Name */}
              <div>
                <label className="form-label">Template Name</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Layout Settings */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  Layout
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Columns</label>
                    <select
                      value={templateConfig.layout.columns}
                      onChange={(e) => setTemplateConfig((prev) => ({
                        ...prev,
                        layout: { ...prev.layout, columns: Number(e.target.value) }
                      }))}
                      className="form-input"
                    >
                      <option value={1}>Single Column</option>
                      <option value={2}>Two Columns</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Header Style</label>
                    <select
                      value={templateConfig.layout.headerStyle}
                      onChange={(e) => setTemplateConfig((prev) => ({
                        ...prev,
                        layout: { ...prev.layout, headerStyle: e.target.value }
                      }))}
                      className="form-input"
                    >
                      <option value="centered">Centered</option>
                      <option value="left">Left Aligned</option>
                      <option value="split">Split</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={templateConfig.layout.sidebar.enabled}
                      onChange={(e) => setTemplateConfig((prev) => ({
                        ...prev,
                        layout: {
                          ...prev.layout,
                          sidebar: { ...prev.layout.sidebar, enabled: e.target.checked }
                        }
                      }))}
                      className="rounded text-primary-600"
                    />
                    <span className="text-sm">Enable Sidebar</span>
                  </label>
                </div>
              </div>

              {/* Color Settings */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Colors
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  {['primary', 'secondary', 'accent'].map((colorKey) => (
                    <div key={colorKey}>
                      <label className="form-label capitalize">{colorKey}</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={templateConfig.colors[colorKey]}
                          onChange={(e) => setTemplateConfig((prev) => ({
                            ...prev,
                            colors: { ...prev.colors, [colorKey]: e.target.value }
                          }))}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={templateConfig.colors[colorKey]}
                          onChange={(e) => setTemplateConfig((prev) => ({
                            ...prev,
                            colors: { ...prev.colors, [colorKey]: e.target.value }
                          }))}
                          className="form-input flex-1 font-mono text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Font Settings */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Typography
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Heading Font</label>
                    <select
                      value={templateConfig.fonts.heading}
                      onChange={(e) => setTemplateConfig((prev) => ({
                        ...prev,
                        fonts: { ...prev.fonts, heading: e.target.value }
                      }))}
                      className="form-input"
                    >
                      <option value="Inter">Inter (Modern)</option>
                      <option value="Merriweather">Merriweather (Classic)</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Body Font</label>
                    <select
                      value={templateConfig.fonts.body}
                      onChange={(e) => setTemplateConfig((prev) => ({
                        ...prev,
                        fonts: { ...prev.fonts, body: e.target.value }
                      }))}
                      className="form-input"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Merriweather">Merriweather</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                className="btn-primary w-full py-3"
              >
                Continue to Preview
              </button>
            </div>
          )}

          {/* Step 3: Preview & Create */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to Create Template
                </h3>
                <p className="text-sm text-gray-500">
                  Your template "{templateName}" is ready. Click create to add it to your gallery.
                </p>
              </div>

              {/* Preview Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Layout</h4>
                    <p className="text-sm text-gray-600">
                      {templateConfig.layout.columns} Column(s), {templateConfig.layout.headerStyle} header
                      {templateConfig.layout.sidebar.enabled && ', with sidebar'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Colors</h4>
                    <div className="flex gap-2">
                      {['primary', 'secondary', 'accent'].map((key) => (
                        <div
                          key={key}
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: templateConfig.colors[key] }}
                          title={key}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Typography</h4>
                    <p className="text-sm text-gray-600">
                      {templateConfig.fonts.heading} / {templateConfig.fonts.body}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="btn-secondary flex-1 py-3"
                >
                  Back to Edit
                </button>
                <button
                  onClick={handleCreateTemplate}
                  className="btn-primary flex-1 py-3"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Create Template
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
          <button onClick={closeTemplateBuilder} className="btn-ghost">
            Cancel
          </button>
          {step === 1 && analysisResult && (
            <div className="text-sm text-gray-500">
              AI Confidence: {Math.round(analysisResult.confidence * 100)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
