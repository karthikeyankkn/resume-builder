import { useRef, useEffect, useCallback, useState } from 'react';
import { useUIStore } from '../../store/uiStore';
import PersonalInfo from './sections/PersonalInfo';
import Summary from './sections/Summary';
import Experience from './sections/Experience';
import Education from './sections/Education';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Certifications from './sections/Certifications';
import CustomSection from './sections/CustomSection';
import {
  Plus,
  ChevronDown,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderOpen,
  Award,
  LayoutList,
  ChevronsUpDown,
  ChevronsDownUp,
  Check
} from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

// Accordion Section Component
function AccordionSection({
  title,
  icon: Icon,
  isExpanded,
  onToggle,
  children,
  sectionRef,
  isHighlighted,
  sectionId,
  isComplete
}) {
  const headingId = `accordion-header-${sectionId}`;
  const contentId = `accordion-content-${sectionId}`;

  return (
    <div
      ref={sectionRef}
      data-tour={`section-${sectionId}`}
      className={`bg-white rounded-lg border overflow-hidden transition-all duration-200 ${
        isHighlighted ? 'ring-2 ring-primary-400 border-primary-400' : 'border-gray-200'
      } ${isExpanded ? 'shadow-md' : 'shadow-sm hover:shadow-md'}`}
    >
      {/* Accordion Header */}
      <button
        id={headingId}
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${
          isExpanded
            ? 'bg-primary-50 border-b border-primary-100'
            : 'bg-white hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-md ${isExpanded ? 'bg-primary-100' : 'bg-gray-100'}`}>
            <Icon className={`w-4 h-4 ${isExpanded ? 'text-primary-600' : 'text-gray-500'}`} aria-hidden="true" />
          </div>
          <span className={`font-medium ${isExpanded ? 'text-primary-700' : 'text-gray-700'}`}>
            {title}
          </span>
          {/* Completion indicator */}
          {isComplete && (
            <span className="flex items-center justify-center w-4 h-4 bg-green-100 rounded-full" title="Section has content">
              <Check className="w-3 h-3 text-green-600" aria-hidden="true" />
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Accordion Content */}
      <div
        id={contentId}
        role="region"
        aria-labelledby={headingId}
        hidden={!isExpanded}
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// Section definitions
const SECTIONS = [
  { id: 'personalInfo', title: 'Personal Information', icon: User, component: PersonalInfo },
  { id: 'summary', title: 'Professional Summary', icon: FileText, component: Summary },
  { id: 'experience', title: 'Work Experience', icon: Briefcase, component: Experience },
  { id: 'education', title: 'Education', icon: GraduationCap, component: Education },
  { id: 'skills', title: 'Skills', icon: Wrench, component: Skills },
  { id: 'projects', title: 'Projects', icon: FolderOpen, component: Projects },
  { id: 'certifications', title: 'Certifications', icon: Award, component: Certifications },
];

// Helper to check if a section has content
function checkSectionCompletion(resume, sectionId) {
  switch (sectionId) {
    case 'personalInfo':
      return !!(resume.personalInfo?.fullName?.trim() && resume.personalInfo?.email?.trim());
    case 'summary':
      return !!(resume.personalInfo?.summary?.trim());
    case 'experience':
      return resume.experience?.length > 0 && resume.experience.some(exp => exp.company?.trim() || exp.position?.trim());
    case 'education':
      return resume.education?.length > 0 && resume.education.some(edu => edu.institution?.trim() || edu.degree?.trim());
    case 'skills':
      return resume.skills?.categories?.length > 0 && resume.skills.categories.some(cat => cat.items?.length > 0);
    case 'projects':
      return resume.projects?.length > 0 && resume.projects.some(proj => proj.name?.trim());
    case 'certifications':
      return resume.certifications?.length > 0 && resume.certifications.some(cert => cert.name?.trim());
    default:
      return false;
  }
}

export default function EditorPanel() {
  const { highlightedSection, registerSectionRef, expandedSection, toggleSection, setExpandedSection } = useUIStore();
  const { resume, addCustomSection } = useResumeStore();

  // Track if all sections are expanded
  const allSectionIds = [...SECTIONS.map(s => s.id), ...(resume.customSections?.map(s => `custom-${s.id}`) || [])];
  const [multiExpandMode, setMultiExpandMode] = useState(false);
  const [expandedSectionsLocal, setExpandedSectionsLocal] = useState(new Set([expandedSection].filter(Boolean)));

  // Handle expand all
  const handleExpandAll = () => {
    setMultiExpandMode(true);
    setExpandedSectionsLocal(new Set(allSectionIds));
  };

  // Handle collapse all
  const handleCollapseAll = () => {
    setMultiExpandMode(true);
    setExpandedSectionsLocal(new Set());
  };

  // Check if section is expanded (supports both modes)
  const isSectionExpanded = (sectionId) => {
    if (multiExpandMode) {
      return expandedSectionsLocal.has(sectionId);
    }
    return expandedSection === sectionId;
  };

  // Create refs for each section - initialized once
  const sectionRefs = useRef({});

  // Initialize refs on mount
  useEffect(() => {
    SECTIONS.forEach(section => {
      if (!sectionRefs.current[section.id]) {
        sectionRefs.current[section.id] = { current: null };
      }
    });

    // Register refs with UI store
    Object.entries(sectionRefs.current).forEach(([section, ref]) => {
      registerSectionRef(section, ref);
    });
  }, [registerSectionRef]);

  // Scroll to section helper
  const scrollToSection = useCallback((sectionId) => {
    setTimeout(() => {
      sectionRefs.current[sectionId]?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 50);
  }, []);

  // Handle section toggle with scroll into view
  const handleToggle = useCallback((sectionId) => {
    if (multiExpandMode) {
      // In multi-expand mode, toggle individual sections
      setExpandedSectionsLocal(prev => {
        const newSet = new Set(prev);
        if (newSet.has(sectionId)) {
          newSet.delete(sectionId);
        } else {
          newSet.add(sectionId);
          scrollToSection(sectionId);
        }
        return newSet;
      });
    } else {
      const isCurrentlyExpanded = expandedSection === sectionId;
      toggleSection(sectionId);

      // Scroll to section if opening
      if (!isCurrentlyExpanded) {
        scrollToSection(sectionId);
      }
    }
  }, [expandedSection, toggleSection, scrollToSection, multiExpandMode]);

  // Handle navigation pill click
  const handleNavClick = useCallback((sectionId) => {
    setExpandedSection(sectionId);
    scrollToSection(sectionId);
  }, [setExpandedSection, scrollToSection]);

  // Handle add custom section
  const handleAddCustomSection = useCallback(() => {
    addCustomSection();
    // Expand the newly added custom section
    setTimeout(() => {
      const newSections = useResumeStore.getState().resume.customSections;
      if (newSections && newSections.length > 0) {
        const lastSection = newSections[newSections.length - 1];
        setExpandedSection(`custom-${lastSection.id}`);
      }
    }, 50);
  }, [addCustomSection, setExpandedSection]);

  // Ref callback for section elements
  const getSectionRef = useCallback((sectionId) => (el) => {
    if (!sectionRefs.current[sectionId]) {
      sectionRefs.current[sectionId] = { current: null };
    }
    sectionRefs.current[sectionId].current = el;
  }, []);

  return (
    <div className="h-full overflow-y-auto p-4 bg-gray-50" data-tour="editor-panel">
      <div className="max-w-2xl mx-auto space-y-2">
        {/* Section Navigation Pills */}
        <div className="bg-white rounded-lg border border-gray-200 p-2 mb-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-1">
            {SECTIONS.map(section => (
              <button
                key={section.id}
                onClick={() => handleNavClick(section.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  isSectionExpanded(section.id)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <section.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{section.title.split(' ')[0]}</span>
              </button>
            ))}
            {/* Expand/Collapse All Buttons */}
            <div className="ml-auto flex gap-1">
              <button
                onClick={handleExpandAll}
                className="px-2 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1"
                title="Expand all sections"
              >
                <ChevronsDownUp className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Expand All</span>
              </button>
              <button
                onClick={handleCollapseAll}
                className="px-2 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1"
                title="Collapse all sections"
              >
                <ChevronsUpDown className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Collapse All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Sections */}
        {SECTIONS.map(section => {
          const SectionComponent = section.component;
          return (
            <AccordionSection
              key={section.id}
              sectionId={section.id}
              title={section.title}
              icon={section.icon}
              isExpanded={isSectionExpanded(section.id)}
              onToggle={() => handleToggle(section.id)}
              sectionRef={getSectionRef(section.id)}
              isHighlighted={highlightedSection === section.id}
              isComplete={checkSectionCompletion(resume, section.id)}
            >
              <SectionComponent />
            </AccordionSection>
          );
        })}

        {/* Custom Sections */}
        {resume.customSections && resume.customSections.length > 0 && (
          <>
            {resume.customSections.map((section) => (
              <AccordionSection
                key={section.id}
                sectionId={`custom-${section.id}`}
                title={section.title || 'Custom Section'}
                icon={LayoutList}
                isExpanded={isSectionExpanded(`custom-${section.id}`)}
                onToggle={() => handleToggle(`custom-${section.id}`)}
                sectionRef={getSectionRef(`custom-${section.id}`)}
                isHighlighted={false}
                isComplete={section.content?.length > 0}
              >
                <CustomSection section={section} />
              </AccordionSection>
            ))}
          </>
        )}

        {/* Add Custom Section Button */}
        <button
          onClick={handleAddCustomSection}
          className="w-full py-3 border-2 border-dashed border-primary-200 rounded-lg
                     text-primary-500 hover:border-primary-400 hover:text-primary-600 hover:bg-white
                     focus:outline-none focus:ring-2 focus:ring-primary-200
                     transition-all flex items-center justify-center gap-2 font-medium bg-white/50"
        >
          <Plus className="w-5 h-5" />
          Add Custom Section
        </button>

        {/* Bottom Spacer */}
        <div className="h-20" />
      </div>
    </div>
  );
}
