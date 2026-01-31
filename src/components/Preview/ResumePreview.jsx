import { useResumeStore } from '../../store/resumeStore';
import { useTemplateStore } from '../../store/templateStore';
import { useUIStore } from '../../store/uiStore';

// Clickable region wrapper component
function ClickableRegion({ section, itemId, children, className = '', style = {} }) {
  const { setActiveSection } = useUIStore();

  const handleClick = (e) => {
    e.stopPropagation();
    setActiveSection(section, itemId);
  };

  return (
    <div
      className={`clickable-region ${className}`}
      onClick={handleClick}
      style={style}
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

// Check if a color is dark (for contrast calculation)
function isDarkColor(hexColor) {
  if (!hexColor || hexColor === 'transparent') return false;
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
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

  // Check if header has dark background for contrast
  const headerBg = colors?.headerBg || colors?.background || '#ffffff';
  const hasHeader = headerBg && headerBg !== colors?.background;
  const headerIsDark = isDarkColor(headerBg);

  // Dynamic styles based on template
  const styles = {
    page: {
      fontFamily: `${fonts?.body || 'Inter'}, Helvetica, Arial, sans-serif`,
      fontSize: fonts?.sizes?.body || '9px',
      paddingTop: hasHeader ? '0' : (spacing?.padding || '30px'),
      paddingBottom: spacing?.padding || '30px',
      paddingLeft: hasHeader ? '0' : (spacing?.padding || '35px'),
      paddingRight: hasHeader ? '0' : (spacing?.padding || '35px'),
      backgroundColor: colors?.background || '#ffffff',
      color: colors?.text || '#1e293b',
      minHeight: '297mm',
      boxSizing: 'border-box'
    },
    header: {
      textAlign: layout?.headerStyle === 'centered' ? 'center' : 'left',
      marginBottom: '12px',
      backgroundColor: headerBg,
      padding: hasHeader ? (spacing?.padding || '30px') : '0',
      marginLeft: hasHeader ? '0' : '0',
      marginRight: hasHeader ? '0' : '0'
    },
    profileImage: {
      width: '60px',
      height: '60px',
      borderRadius: '30px',
      marginBottom: '8px',
      objectFit: 'cover',
      border: `2px solid ${headerIsDark ? '#ffffff' : (colors?.primary || '#2563eb')}`
    },
    name: {
      fontSize: fonts?.sizes?.name || '20px',
      fontWeight: '700',
      fontFamily: `${fonts?.heading || 'Inter'}, Helvetica, Arial, sans-serif`,
      color: headerIsDark ? '#ffffff' : (colors?.text || '#1e293b'),
      marginBottom: '2px'
    },
    title: {
      fontSize: fonts?.sizes?.title || '11px',
      color: headerIsDark ? (colors?.accent || '#93c5fd') : (colors?.primary || '#2563eb'),
      marginBottom: '6px'
    },
    contactRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: layout?.headerStyle === 'centered' ? 'center' : 'flex-start',
      flexWrap: 'wrap',
      gap: '10px',
      fontSize: '8px',
      color: headerIsDark ? 'rgba(255,255,255,0.8)' : (colors?.secondary || '#64748b')
    },
    contactLink: {
      color: headerIsDark ? 'rgba(255,255,255,0.8)' : (colors?.secondary || '#64748b'),
      textDecoration: 'none'
    },
    section: {
      marginBottom: spacing?.sectionGap || '10px'
    },
    sectionTitle: {
      fontSize: fonts?.sizes?.sectionTitle || '10px',
      fontWeight: '600',
      fontFamily: `${fonts?.heading || 'Inter'}, Helvetica, Arial, sans-serif`,
      color: colors?.primary || '#2563eb',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '5px',
      paddingBottom: '2px',
      borderBottom: `1px solid ${colors?.primary || '#2563eb'}`
    },
    summary: {
      fontSize: fonts?.sizes?.body || '9px',
      lineHeight: '1.4',
      color: colors?.secondary || '#64748b',
      whiteSpace: 'pre-line'
    },
    experienceItem: {
      marginBottom: spacing?.itemGap || '8px',
      breakInside: 'avoid',
      pageBreakInside: 'avoid'
    },
    experienceHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: '1px'
    },
    experienceLeft: {
      flex: 1
    },
    experienceRight: {
      textAlign: 'right',
      fontSize: '8px',
      color: colors?.secondary || '#64748b'
    },
    positionTitle: {
      fontSize: fonts?.sizes?.sectionTitle || '10px',
      fontWeight: '600',
      color: colors?.text || '#1e293b'
    },
    companyName: {
      fontSize: fonts?.sizes?.body || '9px',
      color: colors?.primary || '#2563eb'
    },
    description: {
      fontSize: '8px',
      color: colors?.secondary || '#64748b',
      marginTop: '1px',
      marginBottom: '2px',
      whiteSpace: 'pre-line'
    },
    bulletList: {
      marginLeft: '10px'
    },
    bulletItem: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '1px'
    },
    bullet: {
      width: '8px',
      fontSize: '8px'
    },
    bulletText: {
      flex: 1,
      fontSize: '8px',
      lineHeight: '1.3'
    },
    educationItem: {
      marginBottom: '6px',
      breakInside: 'avoid',
      pageBreakInside: 'avoid'
    },
    educationHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    degree: {
      fontSize: fonts?.sizes?.sectionTitle || '10px',
      fontWeight: '600',
      color: colors?.text || '#1e293b'
    },
    institution: {
      fontSize: fonts?.sizes?.body || '9px',
      color: colors?.primary || '#2563eb'
    },
    skillCategory: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '2px',
      flexWrap: 'wrap'
    },
    skillName: {
      fontWeight: '600',
      fontSize: '8px',
      color: colors?.text || '#1e293b',
      width: hasSidebar ? 'auto' : '100px',
      marginRight: hasSidebar ? '4px' : '0',
      flexShrink: 0
    },
    skillItems: {
      flex: 1,
      fontSize: '8px',
      color: colors?.secondary || '#64748b'
    },
    projectItem: {
      marginBottom: '6px',
      breakInside: 'avoid',
      pageBreakInside: 'avoid'
    },
    projectHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: '1px'
    },
    projectName: {
      fontSize: fonts?.sizes?.body || '9px',
      fontWeight: '600',
      color: colors?.text || '#1e293b'
    },
    projectLink: {
      fontSize: '8px',
      color: colors?.primary || '#2563eb',
      marginLeft: '4px',
      textDecoration: 'none'
    },
    projectTech: {
      fontSize: '8px',
      color: colors?.primary || '#2563eb',
      marginBottom: '1px'
    },
    certificationItem: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: '3px',
      breakInside: 'avoid',
      pageBreakInside: 'avoid'
    },
    certName: {
      fontSize: fonts?.sizes?.body || '9px',
      fontWeight: '500',
      color: colors?.text || '#1e293b'
    },
    certIssuer: {
      fontSize: '8px',
      color: colors?.secondary || '#64748b'
    },
    certDate: {
      fontSize: '8px',
      color: colors?.secondary || '#64748b'
    },
    sidebar: {
      padding: '12px',
      borderRadius: '4px',
      backgroundColor: colors?.sidebarBg || '#f8fafc'
    }
  };

  const personalInfo = resume.personalInfo || {};
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = resume.skills || { categories: [] };
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];
  const customSections = resume.customSections || [];

  // Render section title
  const renderSectionTitle = (title) => (
    <div style={styles.sectionTitle}>{title}</div>
  );

  // Render Experience section
  const renderExperience = () => (
    <ClickableRegion section="experience" style={styles.section} className="resume-section">
      {renderSectionTitle('Experience')}
      {experience.map((exp) => (
        <ClickableRegion
          key={exp.id}
          section="experience"
          itemId={exp.id}
          style={styles.experienceItem}
          className="resume-item"
        >
          <div style={styles.experienceHeader}>
            <div style={styles.experienceLeft}>
              <div style={styles.positionTitle}>{exp.position}</div>
              <div style={styles.companyName}>{exp.company}</div>
            </div>
            <div style={styles.experienceRight}>
              <div>{exp.location}</div>
              <div>
                {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
              </div>
            </div>
          </div>
          {exp.description && (
            <div style={styles.description}>{exp.description}</div>
          )}
          {exp.highlights.filter(h => h).length > 0 && (
            <div style={styles.bulletList}>
              {exp.highlights.filter(h => h).map((highlight, i) => (
                <div key={i} style={styles.bulletItem}>
                  <span style={styles.bullet}>•</span>
                  <span style={styles.bulletText}>{highlight}</span>
                </div>
              ))}
            </div>
          )}
        </ClickableRegion>
      ))}
    </ClickableRegion>
  );

  // Render Education section
  const renderEducation = () => (
    <ClickableRegion section="education" style={styles.section} className="resume-section">
      {renderSectionTitle('Education')}
      {education.map((edu) => (
        <ClickableRegion
          key={edu.id}
          section="education"
          itemId={edu.id}
          style={styles.educationItem}
          className="resume-item"
        >
          <div style={styles.educationHeader}>
            <div>
              <div style={styles.degree}>
                {edu.degree} {edu.field && `in ${edu.field}`}
              </div>
              <div style={styles.institution}>{edu.institution}</div>
            </div>
            <div style={styles.experienceRight}>
              <div>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</div>
              {edu.gpa && <div>GPA: {edu.gpa}</div>}
            </div>
          </div>
          {edu.highlights.filter(h => h).length > 0 && (
            <div style={styles.bulletList}>
              {edu.highlights.filter(h => h).map((highlight, i) => (
                <div key={i} style={styles.bulletItem}>
                  <span style={styles.bullet}>•</span>
                  <span style={styles.bulletText}>{highlight}</span>
                </div>
              ))}
            </div>
          )}
        </ClickableRegion>
      ))}
    </ClickableRegion>
  );

  // Render Skills section
  const renderSkills = () => (
    <ClickableRegion section="skills" style={styles.section} className="resume-section">
      {renderSectionTitle('Skills')}
      {skills.categories.map((category) => (
        <div key={category.id} style={styles.skillCategory}>
          <span style={styles.skillName}>{category.name}:</span>
          <span style={styles.skillItems}>{category.items.join(', ')}</span>
        </div>
      ))}
    </ClickableRegion>
  );

  // Render Projects section
  const renderProjects = () => (
    <ClickableRegion section="projects" style={styles.section} className="resume-section">
      {renderSectionTitle('Projects')}
      {projects.map((project) => (
        <ClickableRegion
          key={project.id}
          section="projects"
          itemId={project.id}
          style={styles.projectItem}
          className="resume-item"
        >
          <div style={styles.projectHeader}>
            <span style={styles.projectName}>{project.name}</span>
            {project.link && (
              <a href={`https://${project.link}`} style={styles.projectLink}>
                [Link]
              </a>
            )}
          </div>
          {project.technologies.length > 0 && (
            <div style={styles.projectTech}>
              {project.technologies.join(' • ')}
            </div>
          )}
          {project.description && (
            <div style={styles.description}>{project.description}</div>
          )}
          {project.highlights.filter(h => h).length > 0 && (
            <div style={styles.bulletList}>
              {project.highlights.filter(h => h).map((highlight, i) => (
                <div key={i} style={styles.bulletItem}>
                  <span style={styles.bullet}>•</span>
                  <span style={styles.bulletText}>{highlight}</span>
                </div>
              ))}
            </div>
          )}
        </ClickableRegion>
      ))}
    </ClickableRegion>
  );

  // Render Certifications section
  const renderCertifications = () => (
    <ClickableRegion section="certifications" style={styles.section} className="resume-section">
      {renderSectionTitle('Certifications')}
      {certifications.map((cert) => (
        <ClickableRegion
          key={cert.id}
          section="certifications"
          itemId={cert.id}
          style={styles.certificationItem}
          className="resume-item"
        >
          <div>
            <span style={styles.certName}>{cert.name}</span>
            <div style={styles.certIssuer}>{cert.issuer}</div>
          </div>
          <span style={styles.certDate}>{formatDate(cert.date)}</span>
        </ClickableRegion>
      ))}
    </ClickableRegion>
  );

  // Render Custom Sections
  const renderCustomSections = () => (
    <>
      {customSections.map((section) => (
        <div key={section.id} style={styles.section} className="resume-section">
          {renderSectionTitle(section.title)}
          {section.type === 'text' ? (
            <div style={styles.summary}>
              {section.content?.[0]?.text || ''}
            </div>
          ) : section.type === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              {(section.content || []).filter(item => item.text).map((item) => {
                const [label, value] = item.text.includes(':')
                  ? item.text.split(':').map(s => s.trim())
                  : [item.text, ''];
                return (
                  <div key={item.id} style={{ display: 'flex', gap: '4px' }}>
                    <span style={{ fontWeight: 500, fontSize: '8px', color: colors?.text }}>{label}</span>
                    {value && <span style={{ fontSize: '8px', color: colors?.secondary }}>{value}</span>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={styles.bulletList}>
              {(section.content || []).filter(item => item.text).map((item) => (
                <div key={item.id} style={styles.bulletItem}>
                  <span style={styles.bullet}>•</span>
                  <span style={styles.bulletText}>{item.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );

  // Get sections for main content (excluding sidebar sections)
  const renderMainSections = () => {
    const sections = {
      summary: personalInfo.summary && (
        <ClickableRegion key="summary" section="summary" style={styles.section} className="resume-section">
          {renderSectionTitle('Summary')}
          <div style={styles.summary}>{personalInfo.summary}</div>
        </ClickableRegion>
      ),
      experience: experience.length > 0 && renderExperience(),
      education: education.length > 0 && renderEducation(),
      skills: skills.categories.length > 0 && renderSkills(),
      projects: projects.length > 0 && renderProjects(),
      certifications: certifications.length > 0 && renderCertifications()
    };

    // Use template's section order, falling back to default order
    const defaultOrder = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'];
    const templateOrder = layout?.sectionOrder || defaultOrder;

    // Filter to only sections that exist (excluding personalInfo which is in header)
    const orderedKeys = templateOrder.filter(key => key !== 'personalInfo' && key in sections);

    // Filter out sidebar sections if using sidebar layout
    const mainSectionKeys = hasSidebar
      ? orderedKeys.filter(key => !sidebarSections.includes(key))
      : orderedKeys;

    return mainSectionKeys.map(key => sections[key]);
  };

  // Get sections for sidebar
  const renderSidebarSections = () => {
    if (!hasSidebar) return null;

    const sections = {
      summary: personalInfo.summary && (
        <ClickableRegion key="summary" section="summary" style={styles.section} className="resume-section">
          {renderSectionTitle('Summary')}
          <div style={styles.summary}>{personalInfo.summary}</div>
        </ClickableRegion>
      ),
      skills: skills.categories.length > 0 && renderSkills(),
      certifications: certifications.length > 0 && renderCertifications(),
      projects: projects.length > 0 && renderProjects()
    };

    return sidebarSections.map(key => sections[key]).filter(Boolean);
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <ClickableRegion section="personalInfo" style={styles.header}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: layout?.headerStyle === 'centered' ? 'center' : 'flex-start' }}>
          {personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt="Profile"
              style={styles.profileImage}
            />
          )}
          <div style={styles.name}>{personalInfo.fullName || 'Your Name'}</div>
          <div style={styles.title}>{personalInfo.title || 'Your Title'}</div>

          <div style={styles.contactRow}>
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} style={styles.contactLink}>
                {personalInfo.email}
              </a>
            )}
            {personalInfo.phone && (
              <span>{personalInfo.phone}</span>
            )}
            {personalInfo.location && (
              <span>{personalInfo.location}</span>
            )}
            {personalInfo.linkedIn && (
              <a href={`https://${personalInfo.linkedIn}`} style={styles.contactLink}>
                LinkedIn
              </a>
            )}
            {personalInfo.github && (
              <a href={`https://${personalInfo.github}`} style={styles.contactLink}>
                GitHub
              </a>
            )}
            {personalInfo.portfolio && (
              <a href={`https://${personalInfo.portfolio}`} style={styles.contactLink}>
                Portfolio
              </a>
            )}
          </div>
        </div>
      </ClickableRegion>

      {/* Content Layout */}
      {hasSidebar ? (
        <div style={{
          display: 'flex',
          gap: '16px',
          padding: hasHeader ? `0 ${spacing?.padding || '35px'} 0 ${spacing?.padding || '35px'}` : '0'
        }}>
          {sidebarPosition === 'left' && (
            <div style={{ ...styles.sidebar, width: '30%' }}>
              {renderSidebarSections()}
            </div>
          )}
          <div style={{ flex: 1 }}>
            {renderMainSections()}
            {customSections.length > 0 && renderCustomSections()}
          </div>
          {sidebarPosition === 'right' && (
            <div style={{ ...styles.sidebar, width: '30%' }}>
              {renderSidebarSections()}
            </div>
          )}
        </div>
      ) : (
        <div style={{
          padding: hasHeader ? `0 ${spacing?.padding || '35px'} 0 ${spacing?.padding || '35px'}` : '0'
        }}>
          {renderMainSections()}
          {customSections.length > 0 && renderCustomSections()}
        </div>
      )}
    </div>
  );
}
