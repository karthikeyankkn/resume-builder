import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { debouncedStorage } from '../utils/debouncedStorage';

// Built-in templates
const builtInTemplates = [
  {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Clean and contemporary design with subtle color accents',
    thumbnail: null,
    isCustom: false,
    createdFrom: 'preset',
    layout: {
      columns: 1,
      headerStyle: 'centered',
      sectionOrder: ['personalInfo', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
      sidebar: { enabled: false, position: 'left', sections: [] }
    },
    styles: {
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#0ea5e9',
        text: '#1e293b',
        background: '#ffffff',
        headerBg: '#f8fafc'
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
    }
  },
  {
    id: 'professional',
    name: 'Tech Professional',
    description: 'Two-column layout perfect for technical roles',
    thumbnail: null,
    isCustom: false,
    createdFrom: 'preset',
    layout: {
      columns: 2,
      headerStyle: 'left',
      sectionOrder: ['personalInfo', 'summary', 'experience', 'education', 'projects'],
      sidebar: { enabled: true, position: 'right', sections: ['skills', 'certifications'] }
    },
    styles: {
      colors: {
        primary: '#0f172a',
        secondary: '#475569',
        accent: '#3b82f6',
        text: '#1e293b',
        background: '#ffffff',
        headerBg: '#0f172a',
        sidebarBg: '#f1f5f9'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        sizes: { name: '26px', title: '13px', sectionTitle: '12px', body: '10px' }
      },
      spacing: {
        sectionGap: '16px',
        itemGap: '10px',
        padding: '32px'
      }
    }
  },
  {
    id: 'creative',
    name: 'Creative Bold',
    description: 'Stand out with colorful accents and modern typography',
    thumbnail: null,
    isCustom: false,
    createdFrom: 'preset',
    layout: {
      columns: 1,
      headerStyle: 'split',
      sectionOrder: ['personalInfo', 'summary', 'experience', 'projects', 'education', 'skills', 'certifications'],
      sidebar: { enabled: false, position: 'left', sections: [] }
    },
    styles: {
      colors: {
        primary: '#7c3aed',
        secondary: '#6b7280',
        accent: '#ec4899',
        text: '#111827',
        background: '#ffffff',
        headerBg: '#7c3aed'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        sizes: { name: '32px', title: '14px', sectionTitle: '14px', body: '11px' }
      },
      spacing: {
        sectionGap: '24px',
        itemGap: '14px',
        padding: '36px'
      }
    }
  },
  {
    id: 'executive',
    name: 'Executive Classic',
    description: 'Traditional and elegant design for senior positions',
    thumbnail: null,
    isCustom: false,
    createdFrom: 'preset',
    layout: {
      columns: 1,
      headerStyle: 'centered',
      sectionOrder: ['personalInfo', 'summary', 'experience', 'education', 'skills', 'certifications'],
      sidebar: { enabled: false, position: 'left', sections: [] }
    },
    styles: {
      colors: {
        primary: '#1e3a5f',
        secondary: '#4b5563',
        accent: '#b45309',
        text: '#1f2937',
        background: '#ffffff',
        headerBg: '#ffffff'
      },
      fonts: {
        heading: 'Merriweather',
        body: 'Inter',
        sizes: { name: '26px', title: '13px', sectionTitle: '13px', body: '11px' }
      },
      spacing: {
        sectionGap: '22px',
        itemGap: '12px',
        padding: '48px'
      }
    }
  },
  {
    id: 'compact',
    name: 'Compact Modern',
    description: 'Maximum content in minimal space',
    thumbnail: null,
    isCustom: false,
    createdFrom: 'preset',
    layout: {
      columns: 2,
      headerStyle: 'left',
      sectionOrder: ['personalInfo', 'experience', 'education'],
      sidebar: { enabled: true, position: 'left', sections: ['summary', 'skills', 'certifications', 'projects'] }
    },
    styles: {
      colors: {
        primary: '#059669',
        secondary: '#6b7280',
        accent: '#0891b2',
        text: '#1f2937',
        background: '#ffffff',
        headerBg: '#ffffff',
        sidebarBg: '#ecfdf5'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        sizes: { name: '22px', title: '11px', sectionTitle: '11px', body: '9px' }
      },
      spacing: {
        sectionGap: '12px',
        itemGap: '8px',
        padding: '24px'
      }
    }
  },
  {
    id: 'frontend-dev',
    name: 'Frontend Developer',
    description: 'Modern tech aesthetic with skills-focused layout for developers',
    thumbnail: null,
    isCustom: false,
    createdFrom: 'preset',
    layout: {
      columns: 2,
      headerStyle: 'left',
      sectionOrder: ['personalInfo', 'summary', 'experience', 'projects', 'education'],
      sidebar: { enabled: true, position: 'right', sections: ['skills', 'certifications'] }
    },
    styles: {
      colors: {
        primary: '#06b6d4',
        secondary: '#94a3b8',
        accent: '#a855f7',
        text: '#f1f5f9',
        background: '#ffffff',
        headerBg: '#0f172a',
        sidebarBg: '#f0fdfa'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        sizes: { name: '26px', title: '13px', sectionTitle: '12px', body: '10px' }
      },
      spacing: {
        sectionGap: '18px',
        itemGap: '10px',
        padding: '32px'
      }
    }
  },
  {
    id: 'developer-dark',
    name: 'Dev Dark Mode',
    description: 'Code editor inspired dark theme for tech professionals',
    thumbnail: null,
    isCustom: false,
    createdFrom: 'preset',
    layout: {
      columns: 1,
      headerStyle: 'left',
      sectionOrder: ['personalInfo', 'summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
      sidebar: { enabled: false, position: 'left', sections: [] }
    },
    styles: {
      colors: {
        primary: '#22d3ee',
        secondary: '#a1a1aa',
        accent: '#f472b6',
        text: '#e4e4e7',
        background: '#18181b',
        headerBg: '#09090b'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        sizes: { name: '28px', title: '14px', sectionTitle: '13px', body: '11px' }
      },
      spacing: {
        sectionGap: '20px',
        itemGap: '12px',
        padding: '36px'
      }
    }
  },
  {
    id: 'startup-modern',
    name: 'Startup Modern',
    description: 'Fresh gradient style perfect for startups and modern companies',
    thumbnail: null,
    isCustom: false,
    createdFrom: 'preset',
    layout: {
      columns: 2,
      headerStyle: 'centered',
      sectionOrder: ['personalInfo', 'summary', 'experience', 'projects'],
      sidebar: { enabled: true, position: 'left', sections: ['skills', 'education', 'certifications'] }
    },
    styles: {
      colors: {
        primary: '#8b5cf6',
        secondary: '#71717a',
        accent: '#f97316',
        text: '#18181b',
        background: '#ffffff',
        headerBg: '#8b5cf6',
        sidebarBg: '#faf5ff'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        sizes: { name: '28px', title: '13px', sectionTitle: '12px', body: '10px' }
      },
      spacing: {
        sectionGap: '18px',
        itemGap: '10px',
        padding: '32px'
      }
    }
  }
];

export const useTemplateStore = create(
  persist(
    (set, get) => ({
      templates: builtInTemplates,
      customTemplates: [],
      activeTemplate: 'modern',

      // Get current template
      getCurrentTemplate: () => {
        const state = get();
        const allTemplates = [...state.templates, ...state.customTemplates];
        return allTemplates.find((t) => t.id === state.activeTemplate) || state.templates[0];
      },

      // Set active template
      setActiveTemplate: (templateId) => set({ activeTemplate: templateId }),

      // Add custom template
      addCustomTemplate: (template) =>
        set((state) => ({
          customTemplates: [
            ...state.customTemplates,
            {
              ...template,
              id: uuidv4(),
              isCustom: true,
              createdFrom: template.createdFrom || 'manual'
            }
          ]
        })),

      // Update custom template
      updateCustomTemplate: (id, updates) =>
        set((state) => ({
          customTemplates: state.customTemplates.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          )
        })),

      // Delete custom template
      deleteCustomTemplate: (id) =>
        set((state) => ({
          customTemplates: state.customTemplates.filter((t) => t.id !== id),
          activeTemplate: state.activeTemplate === id ? 'modern' : state.activeTemplate
        })),

      // Duplicate template
      duplicateTemplate: (id) => {
        const state = get();
        const allTemplates = [...state.templates, ...state.customTemplates];
        const template = allTemplates.find((t) => t.id === id);
        if (template) {
          const newTemplate = {
            ...template,
            id: uuidv4(),
            name: `${template.name} (Copy)`,
            isCustom: true,
            createdFrom: 'manual'
          };
          set((s) => ({
            customTemplates: [...s.customTemplates, newTemplate]
          }));
          return newTemplate.id;
        }
        return null;
      },

      // Get all templates
      getAllTemplates: () => {
        const state = get();
        return [...state.templates, ...state.customTemplates];
      },

      // Update template styles
      updateTemplateStyles: (templateId, styles) => {
        const state = get();
        const isCustom = state.customTemplates.some((t) => t.id === templateId);

        if (isCustom) {
          set((s) => ({
            customTemplates: s.customTemplates.map((t) =>
              t.id === templateId
                ? { ...t, styles: { ...t.styles, ...styles } }
                : t
            )
          }));
        }
      },

      // Update template layout
      updateTemplateLayout: (templateId, layout) => {
        const state = get();
        const isCustom = state.customTemplates.some((t) => t.id === templateId);

        if (isCustom) {
          set((s) => ({
            customTemplates: s.customTemplates.map((t) =>
              t.id === templateId
                ? { ...t, layout: { ...t.layout, ...layout } }
                : t
            )
          }));
        }
      },

      // Create template from screenshot analysis
      createFromScreenshot: (analysisResult) => {
        const template = {
          id: uuidv4(),
          name: 'Custom Template',
          description: 'Generated from uploaded design',
          thumbnail: null,
          isCustom: true,
          createdFrom: 'screenshot',
          layout: analysisResult.layout || {
            columns: 1,
            headerStyle: 'centered',
            sectionOrder: ['personalInfo', 'summary', 'experience', 'education', 'skills'],
            sidebar: { enabled: false, position: 'left', sections: [] }
          },
          styles: {
            colors: analysisResult.colors || {
              primary: '#2563eb',
              secondary: '#64748b',
              accent: '#0ea5e9',
              text: '#1e293b',
              background: '#ffffff'
            },
            fonts: analysisResult.fonts || {
              heading: 'Inter',
              body: 'Inter',
              sizes: { name: '28px', title: '14px', sectionTitle: '14px', body: '11px' }
            },
            spacing: analysisResult.spacing || {
              sectionGap: '20px',
              itemGap: '12px',
              padding: '40px'
            }
          }
        };

        set((state) => ({
          customTemplates: [...state.customTemplates, template],
          activeTemplate: template.id
        }));

        return template.id;
      }
    }),
    {
      name: 'template-storage',
      version: 1,
      storage: debouncedStorage,
      partialize: (state) => ({
        customTemplates: state.customTemplates,
        activeTemplate: state.activeTemplate
      })
    }
  )
);
