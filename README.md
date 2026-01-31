# Resume Builder

A modern, client-side resume builder with real-time preview, ATS optimization, and PDF export. Built with React 19, Vite 7, and Tailwind CSS 4.

## Features

### Core Features
- **Real-time Preview** - See changes instantly as you type
- **PDF Export** - High-quality PDF generation with @react-pdf/renderer
- **Multiple Templates** - 5 built-in professional templates
- **Custom Templates** - Create and customize your own templates
- **Auto-save** - Changes persist to localStorage automatically
- **Undo/Redo** - Full history with 50-entry limit
- **Dark Mode** - System, light, and dark theme options

### ATS Optimization
- **ATS Keyword Analyzer** - Compare your resume against job descriptions
- **Keyword Match Score** - See percentage match with weighted scoring
- **Missing Keywords** - Identify gaps in technical skills and phrases
- **Smart Suggestions** - Get actionable recommendations to improve match rate

### Impact Statement Builder
- **Weak Phrase Detection** - Automatically identifies generic statements
- **Template-based Strengthening** - Transform weak bullets into quantified achievements
- **Strength Scoring** - Real-time scoring (0-100%) for each bullet point
- **Power Verbs Library** - 100+ categorized action verbs

### Resume Sections
- Personal Information (with photo support)
- Professional Summary
- Work Experience (with achievement highlights)
- Education
- Skills (categorized)
- Projects
- Certifications
- Custom Sections

## Screenshots

### Editor with Live Preview
Split-pane interface with form editor on the left and real-time preview on the right.

### ATS Keyword Analyzer
Paste a job description to see your keyword match score and missing keywords.

### Impact Statement Builder
Transform weak bullet points like "Managed a team" into strong statements like "Led 12-person engineering team to deliver $2M platform migration within 6 months".

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd resume-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save resume |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + E` | Export PDF |
| `Ctrl/Cmd + T` | Open templates |
| `Ctrl/Cmd + I` | Import resume |
| `Ctrl/Cmd + K` | ATS Analyzer |
| `Ctrl/Cmd + +` | Zoom in |
| `Ctrl/Cmd + -` | Zoom out |
| `Ctrl/Cmd + 0` | Reset zoom |
| `?` | Show shortcuts help |
| `Escape` | Close modals |

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Vite 7 | Build tool |
| Zustand | State management |
| Tailwind CSS 4 | Styling |
| @react-pdf/renderer | PDF generation |
| Lucide React | Icons |

## Project Structure

```
src/
├── components/
│   ├── ATS/                    # ATS Keyword Analyzer
│   │   ├── ATSAnalyzerModal.jsx
│   │   ├── ATSScoreDisplay.jsx
│   │   ├── KeywordList.jsx
│   │   └── SuggestionCard.jsx
│   ├── ImpactBuilder/          # Impact Statement Builder
│   │   ├── ImpactBuilderModal.jsx
│   │   ├── StrengthMeter.jsx
│   │   ├── TemplateForm.jsx
│   │   └── InlineStrengthIndicator.jsx
│   ├── Editor/                 # Resume editor forms
│   │   ├── EditorPanel.jsx
│   │   └── sections/
│   ├── Preview/                # Live preview
│   │   ├── PreviewPanel.jsx
│   │   └── ResumePreview.jsx
│   ├── Export/                 # PDF export
│   │   ├── ExportModal.jsx
│   │   └── ResumePDF.jsx
│   ├── Templates/              # Template gallery
│   └── Layout/                 # Header, SplitPane
├── store/                      # Zustand stores
│   ├── resumeStore.js          # Resume data
│   ├── templateStore.js        # Templates
│   ├── uiStore.js              # UI state
│   └── historyStore.js         # Undo/redo
├── utils/
│   ├── atsAnalyzer.js          # ATS scoring logic
│   └── impactTemplates.js      # Impact patterns
└── hooks/
    └── useKeyboardShortcuts.js
```

## Templates

### Built-in Templates

1. **Modern Minimal** - Clean, single-column design
2. **Tech Professional** - Two-column with sidebar
3. **Executive Classic** - Traditional elegant design
4. **Dev Dark Mode** - Dark theme for developers
5. **Modern 2026** - Dual-column with progress bars and modern styling

### Template Customization

Each template supports customization of:
- Colors (primary, secondary, accent, background)
- Fonts (heading, body)
- Font sizes
- Spacing
- Layout (columns, sidebar position)
- Section order

## Data Storage

All data is stored locally in the browser using localStorage:
- `resume-storage` - Resume content
- `template-storage` - Custom templates and active template
- No data is sent to any server

## ATS Analyzer Details

The ATS (Applicant Tracking System) analyzer helps optimize your resume for automated screening:

### How It Works
1. Extracts keywords from job description
2. Extracts keywords from your resume
3. Compares and calculates weighted match score
4. Identifies missing keywords
5. Provides actionable suggestions

### Scoring Weights
- Technical Skills: 3x weight
- Key Phrases: 2x weight
- General Keywords: 1x weight

### Technical Skills Database
Includes 200+ skills across categories:
- Programming languages
- Frontend/Backend frameworks
- Databases
- Cloud platforms
- DevOps tools
- Data science
- Soft skills

## Impact Statement Builder Details

Transforms weak bullet points into strong, quantified achievements:

### Detected Patterns
- "Managed team" → Led {size} {type} to {achievement}
- "Responsible for" → Owned {scope}, resulting in {outcome}
- "Worked on" → Built {deliverable} that {impact}
- "Improved" → Improved {target} by {metric}
- "Created/Developed" → Developed {solution} that {benefit}
- "Collaborated" → Partnered with {stakeholders} to achieve {result}
- "Communicated" → Presented {content} to {audience}, leading to {outcome}
- "Reduced costs" → Reduced {costType} by ${amount} through {method}

### Strength Scoring
- +40 points: Contains numbers/metrics
- +15 points: Starts with power verb
- +15 points: Has outcome words
- +10 points: Has scope indicators
- -20 points: Contains weak phrases

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- [React PDF](https://react-pdf.org/) for PDF generation
- [Lucide](https://lucide.dev/) for icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Zustand](https://zustand-demo.pmnd.rs/) for state management
