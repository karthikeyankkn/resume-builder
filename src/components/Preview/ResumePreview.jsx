import { useResumeStore } from '../../store/resumeStore';
import { useTemplateStore } from '../../store/templateStore';
import { useUIStore } from '../../store/uiStore';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from 'lucide-react';

// Clickable region wrapper component
function ClickableRegion({ section, itemId, children, className = '' }) {
  const { setActiveSection } = useUIStore();

  const handleClick = (e) => {
    e.stopPropagation();
    setActiveSection(section, itemId);
  };

  return (
    <div
      className={`clickable-region ${className}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}

// Format date helper
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + '-01');
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function ResumePreview() {
  const { resume } = useResumeStore();
  const { getCurrentTemplate } = useTemplateStore();

  const template = getCurrentTemplate();
  const { colors, fonts, spacing } = template?.styles || {};
  const { layout } = template || {};

  // Determine if using sidebar layout
  const hasSidebar = layout?.sidebar?.enabled;
  const sidebarPosition = layout?.sidebar?.position || 'right';
  const sidebarSections = layout?.sidebar?.sections || [];

  // Base styles
  const baseStyles = {
    fontFamily: fonts?.body || 'Inter, sans-serif',
    color: colors?.text || '#1e293b',
    fontSize: fonts?.sizes?.body || '11px',
    lineHeight: '1.5',
    padding: spacing?.padding || '40px'
  };

  const headingFont = fonts?.heading || 'Inter, sans-serif';
  const primaryColor = colors?.primary || '#2563eb';
  const secondaryColor = colors?.secondary || '#64748b';

  // Render contact info
  const renderContactInfo = () => (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs" style={{ color: secondaryColor }}>
      {resume.personalInfo.email && (
        <a href={`mailto:${resume.personalInfo.email}`} className="flex items-center gap-1 hover:underline">
          <Mail className="w-3 h-3" />
          {resume.personalInfo.email}
        </a>
      )}
      {resume.personalInfo.phone && (
        <span className="flex items-center gap-1">
          <Phone className="w-3 h-3" />
          {resume.personalInfo.phone}
        </span>
      )}
      {resume.personalInfo.location && (
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {resume.personalInfo.location}
        </span>
      )}
      {resume.personalInfo.linkedIn && (
        <a href={`https://${resume.personalInfo.linkedIn}`} className="flex items-center gap-1 hover:underline">
          <Linkedin className="w-3 h-3" />
          LinkedIn
        </a>
      )}
      {resume.personalInfo.github && (
        <a href={`https://${resume.personalInfo.github}`} className="flex items-center gap-1 hover:underline">
          <Github className="w-3 h-3" />
          GitHub
        </a>
      )}
      {resume.personalInfo.portfolio && (
        <a href={`https://${resume.personalInfo.portfolio}`} className="flex items-center gap-1 hover:underline">
          <Globe className="w-3 h-3" />
          Portfolio
        </a>
      )}
    </div>
  );

  // Render section title
  const renderSectionTitle = (title) => (
    <h3
      className="font-semibold uppercase tracking-wide mb-3 pb-1 border-b-2"
      style={{
        fontFamily: headingFont,
        fontSize: fonts?.sizes?.sectionTitle || '12px',
        color: primaryColor,
        borderColor: primaryColor
      }}
    >
      {title}
    </h3>
  );

  // Render Experience section
  const renderExperience = () => (
    <ClickableRegion section="experience" className="mb-5 resume-section">
      {renderSectionTitle('Experience')}
      <div className="space-y-4">
        {resume.experience.map((exp) => (
          <ClickableRegion key={exp.id} section="experience" itemId={exp.id} className="resume-item">
            <div className="flex justify-between items-start mb-1">
              <div>
                <h4 className="font-semibold" style={{ color: colors?.text }}>{exp.position}</h4>
                <p style={{ color: primaryColor }}>{exp.company}</p>
              </div>
              <div className="text-right text-xs" style={{ color: secondaryColor }}>
                <p>{exp.location}</p>
                <p>
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </p>
              </div>
            </div>
            {exp.description && (
              <p className="text-xs mt-1 whitespace-pre-line" style={{ color: secondaryColor }}>{exp.description}</p>
            )}
            {exp.highlights.length > 0 && (
              <ul className="list-disc list-outside ml-4 mt-2 space-y-0.5">
                {exp.highlights.filter(h => h).map((highlight, i) => (
                  <li key={i} className="text-xs">{highlight}</li>
                ))}
              </ul>
            )}
          </ClickableRegion>
        ))}
      </div>
    </ClickableRegion>
  );

  // Render Education section
  const renderEducation = () => (
    <ClickableRegion section="education" className="mb-5 resume-section">
      {renderSectionTitle('Education')}
      <div className="space-y-3">
        {resume.education.map((edu) => (
          <ClickableRegion key={edu.id} section="education" itemId={edu.id} className="resume-item">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold" style={{ color: colors?.text }}>
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h4>
                <p style={{ color: primaryColor }}>{edu.institution}</p>
              </div>
              <div className="text-right text-xs" style={{ color: secondaryColor }}>
                <p>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                {edu.gpa && <p>GPA: {edu.gpa}</p>}
              </div>
            </div>
            {edu.highlights.length > 0 && (
              <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5">
                {edu.highlights.filter(h => h).map((highlight, i) => (
                  <li key={i} className="text-xs" style={{ color: secondaryColor }}>{highlight}</li>
                ))}
              </ul>
            )}
          </ClickableRegion>
        ))}
      </div>
    </ClickableRegion>
  );

  // Render Skills section
  const renderSkills = () => (
    <ClickableRegion section="skills" className="mb-5 resume-section">
      {renderSectionTitle('Skills')}
      <div className="space-y-2">
        {resume.skills.categories.map((category) => (
          <div key={category.id}>
            <span className="font-medium text-xs" style={{ color: colors?.text }}>
              {category.name}:
            </span>{' '}
            <span className="text-xs" style={{ color: secondaryColor }}>
              {category.items.join(', ')}
            </span>
          </div>
        ))}
      </div>
    </ClickableRegion>
  );

  // Render Projects section
  const renderProjects = () => (
    <ClickableRegion section="projects" className="mb-5 resume-section">
      {renderSectionTitle('Projects')}
      <div className="space-y-3">
        {resume.projects.map((project) => (
          <ClickableRegion key={project.id} section="projects" itemId={project.id} className="resume-item">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold" style={{ color: colors?.text }}>
                {project.name}
                {project.link && (
                  <a
                    href={`https://${project.link}`}
                    className="ml-1 inline-flex items-center"
                    style={{ color: primaryColor }}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </h4>
            </div>
            {project.technologies.length > 0 && (
              <p className="text-xs" style={{ color: primaryColor }}>
                {project.technologies.join(' • ')}
              </p>
            )}
            {project.description && (
              <p className="text-xs mt-1 whitespace-pre-line" style={{ color: secondaryColor }}>{project.description}</p>
            )}
            {project.highlights.length > 0 && (
              <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5">
                {project.highlights.filter(h => h).map((highlight, i) => (
                  <li key={i} className="text-xs">{highlight}</li>
                ))}
              </ul>
            )}
          </ClickableRegion>
        ))}
      </div>
    </ClickableRegion>
  );

  // Render Certifications section
  const renderCertifications = () => (
    <ClickableRegion section="certifications" className="mb-5 resume-section">
      {renderSectionTitle('Certifications')}
      <div className="space-y-2">
        {resume.certifications.map((cert) => (
          <ClickableRegion key={cert.id} section="certifications" itemId={cert.id} className="resume-item">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-medium text-xs" style={{ color: colors?.text }}>{cert.name}</span>
                <span className="text-xs" style={{ color: secondaryColor }}> - {cert.issuer}</span>
              </div>
              <span className="text-xs" style={{ color: secondaryColor }}>{formatDate(cert.date)}</span>
            </div>
          </ClickableRegion>
        ))}
      </div>
    </ClickableRegion>
  );

  // Main content sections
  const renderMainContent = () => {
    const sections = {
      experience: resume.experience.length > 0 && renderExperience(),
      education: resume.education.length > 0 && renderEducation(),
      skills: resume.skills.categories.length > 0 && renderSkills(),
      projects: resume.projects.length > 0 && renderProjects(),
      certifications: resume.certifications.length > 0 && renderCertifications()
    };

    // Filter out sidebar sections if using sidebar layout
    const mainSections = hasSidebar
      ? Object.entries(sections).filter(([key]) => !sidebarSections.includes(key))
      : Object.entries(sections);

    return mainSections.map(([key, component]) => component && <div key={key}>{component}</div>);
  };

  // Sidebar content
  const renderSidebarContent = () => {
    if (!hasSidebar) return null;

    const sections = {
      skills: resume.skills.categories.length > 0 && renderSkills(),
      certifications: resume.certifications.length > 0 && renderCertifications(),
      projects: resume.projects.length > 0 && renderProjects()
    };

    return sidebarSections.map((key) => sections[key] && <div key={key}>{sections[key]}</div>);
  };

  return (
    <div style={baseStyles}>
      {/* Header */}
      <ClickableRegion section="personalInfo" className="text-center mb-6">
        {resume.personalInfo.photo && (
          <img
            src={resume.personalInfo.photo}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2"
            style={{ borderColor: primaryColor }}
          />
        )}
        <h1
          className="font-bold mb-1"
          style={{
            fontFamily: headingFont,
            fontSize: fonts?.sizes?.name || '28px',
            color: colors?.text
          }}
        >
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <p
          className="mb-3"
          style={{
            fontSize: fonts?.sizes?.title || '14px',
            color: primaryColor
          }}
        >
          {resume.personalInfo.title || 'Your Title'}
        </p>
        {renderContactInfo()}
      </ClickableRegion>

      {/* Summary */}
      {resume.personalInfo.summary && (
        <ClickableRegion section="summary" className="mb-5 resume-section">
          {renderSectionTitle('Summary')}
          <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: secondaryColor }}>
            {resume.personalInfo.summary}
          </p>
        </ClickableRegion>
      )}

      {/* Content Layout */}
      {hasSidebar ? (
        <div className="flex gap-6">
          {sidebarPosition === 'left' && (
            <div
              className="w-1/3 p-4 rounded"
              style={{ backgroundColor: colors?.sidebarBg || '#f8fafc' }}
            >
              {renderSidebarContent()}
            </div>
          )}
          <div className={sidebarPosition === 'left' ? 'w-2/3' : 'w-2/3'}>
            {renderMainContent()}
          </div>
          {sidebarPosition === 'right' && (
            <div
              className="w-1/3 p-4 rounded"
              style={{ backgroundColor: colors?.sidebarBg || '#f8fafc' }}
            >
              {renderSidebarContent()}
            </div>
          )}
        </div>
      ) : (
        <div>{renderMainContent()}</div>
      )}
    </div>
  );
}
