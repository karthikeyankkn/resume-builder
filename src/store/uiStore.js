import { create } from 'zustand';

export const useUIStore = create((set, get) => ({
  // Active section for editor navigation
  activeSection: null,
  activeSectionId: null,

  // Expanded accordion section (null means all collapsed)
  expandedSection: 'personalInfo',

  // Preview zoom level
  zoom: 75,

  // Modals
  showTemplateGallery: false,
  showExportModal: false,
  showTemplateBuilder: false,
  showImportModal: false,
  showTemplateEditor: false,

  // Template being edited
  editingTemplateId: null,

  // Section refs for scrolling
  sectionRefs: {},

  // Highlight animation
  highlightedSection: null,

  // Set active section and scroll to it
  setActiveSection: (section, itemId = null) => {
    set({ activeSection: section, activeSectionId: itemId });

    const state = get();
    const ref = state.sectionRefs[section];

    if (ref?.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      // Trigger highlight animation
      set({ highlightedSection: section });
      setTimeout(() => set({ highlightedSection: null }), 600);
    }
  },

  // Register section ref
  registerSectionRef: (section, ref) => {
    set((state) => ({
      sectionRefs: { ...state.sectionRefs, [section]: ref }
    }));
  },

  // Zoom controls
  setZoom: (zoom) => set({ zoom: Math.min(150, Math.max(25, zoom)) }),
  zoomIn: () => set((state) => ({ zoom: Math.min(150, state.zoom + 10) })),
  zoomOut: () => set((state) => ({ zoom: Math.max(25, state.zoom - 10) })),

  // Modal controls
  openTemplateGallery: () => set({ showTemplateGallery: true }),
  closeTemplateGallery: () => set({ showTemplateGallery: false }),

  openExportModal: () => set({ showExportModal: true }),
  closeExportModal: () => set({ showExportModal: false }),

  openTemplateBuilder: () => set({ showTemplateBuilder: true }),
  closeTemplateBuilder: () => set({ showTemplateBuilder: false }),

  openImportModal: () => set({ showImportModal: true }),
  closeImportModal: () => set({ showImportModal: false }),

  openTemplateEditor: (templateId) => set({ showTemplateEditor: true, editingTemplateId: templateId }),
  closeTemplateEditor: () => set({ showTemplateEditor: false, editingTemplateId: null }),

  // Clear active section
  clearActiveSection: () => set({ activeSection: null, activeSectionId: null }),

  // Accordion controls
  setExpandedSection: (section) => set({ expandedSection: section }),
  toggleSection: (section) => set((state) => ({
    expandedSection: state.expandedSection === section ? null : section
  }))
}));
