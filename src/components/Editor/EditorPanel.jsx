import { useRef, useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';
import PersonalInfo from './sections/PersonalInfo';
import Summary from './sections/Summary';
import Experience from './sections/Experience';
import Education from './sections/Education';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Certifications from './sections/Certifications';
import { Plus } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

export default function EditorPanel() {
  const { highlightedSection, registerSectionRef } = useUIStore();
  const { addCustomSection } = useResumeStore();

  // Create refs for each section
  const sectionRefs = {
    personalInfo: useRef(null),
    summary: useRef(null),
    experience: useRef(null),
    education: useRef(null),
    skills: useRef(null),
    projects: useRef(null),
    certifications: useRef(null)
  };

  // Register refs on mount
  useEffect(() => {
    Object.entries(sectionRefs).forEach(([section, ref]) => {
      registerSectionRef(section, ref);
    });
  }, []);

  const getSectionClass = (sectionName) => {
    const baseClass = 'editor-section';
    return highlightedSection === sectionName
      ? `${baseClass} section-highlight`
      : baseClass;
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Personal Info Section */}
        <div ref={sectionRefs.personalInfo} className={getSectionClass('personalInfo')}>
          <PersonalInfo />
        </div>

        {/* Summary Section */}
        <div ref={sectionRefs.summary} className={getSectionClass('summary')}>
          <Summary />
        </div>

        {/* Experience Section */}
        <div ref={sectionRefs.experience} className={getSectionClass('experience')}>
          <Experience />
        </div>

        {/* Education Section */}
        <div ref={sectionRefs.education} className={getSectionClass('education')}>
          <Education />
        </div>

        {/* Skills Section */}
        <div ref={sectionRefs.skills} className={getSectionClass('skills')}>
          <Skills />
        </div>

        {/* Projects Section */}
        <div ref={sectionRefs.projects} className={getSectionClass('projects')}>
          <Projects />
        </div>

        {/* Certifications Section */}
        <div ref={sectionRefs.certifications} className={getSectionClass('certifications')}>
          <Certifications />
        </div>

        {/* Add Custom Section Button */}
        <button
          onClick={addCustomSection}
          className="w-full py-3 border-2 border-dashed border-primary-200 rounded-lg
                     text-primary-500 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50
                     focus:outline-none focus:ring-2 focus:ring-primary-200
                     transition-all flex items-center justify-center gap-2 font-medium"
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
