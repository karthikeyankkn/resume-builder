# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Resume Builder is a client-side React application for creating, customizing, and exporting professional resumes. Users can edit resume content with real-time preview and export to PDF.

**Tech Stack:** React 19, Vite 7, Zustand, Tailwind CSS 4, @react-pdf/renderer

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:5173)
npm run build        # Production build to /dist
npm run preview      # Preview production build
npm run lint         # ESLint check on .js/.jsx files
```

**Note:** No test framework is configured.

## Architecture

### State Management (Zustand Stores)

All stores in `/src/store/` use Zustand with localStorage persistence:

- **resumeStore.js** - Resume data CRUD (personalInfo, experience, education, skills, projects, certifications, customSections). Persists to "resume-storage".
- **templateStore.js** - 5 built-in templates + custom template management. Persists to "template-storage".
- **uiStore.js** - UI state (active section, zoom, modals). No persistence.
- **historyStore.js** - Undo/redo with 50-entry limit. No persistence.

### Component Structure

```
/src/components/
├── Layout/           # Header (toolbar), SplitPane (editor/preview columns)
├── Editor/           # EditorPanel + section forms (PersonalInfo, Experience, etc.)
├── Preview/          # PreviewPanel + ResumePreview (PDF renderer)
├── Export/           # ExportModal
├── Templates/        # TemplateGallery
└── TemplateBuilder/  # Advanced template customization
```

### Data Flow

1. User edits form → resumeStore updates → ResumePreview re-renders → localStorage persists
2. Undo/redo managed via historyStore.pushState()/undo()/redo()

### Key Patterns

- **Lazy loading:** TemplateGallery, ExportModal, TemplateBuilder, ImportModal are React.lazy() loaded
- **Keyboard shortcuts:** Global handlers in `/src/hooks/useKeyboardShortcuts.js` (Ctrl/Cmd+S save, Z undo, E export, T templates, I import, +/- zoom)
- **Template structure:** Layout (columns, header style, sections) + styles (colors, fonts, spacing)

### Resume Data Structure

```javascript
resume = {
  id, metadata, personalInfo,
  experience[], education[],
  skills: { categories[] },
  projects[], certifications[], customSections[]
}
```

## Build Configuration

Vite config (`vite.config.js`) includes:
- Code splitting for vendor chunks (react, @react-pdf/renderer, lucide-react, zustand)
- 800KB chunk size warning limit (due to PDF renderer size)
- Pre-bundled deps optimization for react-pdf

## Empty Directories

`/src/utils/` and `/src/services/` exist but are empty, ready for expansion.
