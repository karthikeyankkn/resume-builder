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

// Contact icons as inline SVGs
const ContactIcons = {
  phone: (color) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  email: (color) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  linkedin: (color) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={color}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  website: (color) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  github: (color) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={color}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  ),
  location: (color) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
};

// Progress bar component for skills
function SkillProgressBar({ name, level, barColor, trackColor, textColor }) {
  const percentage = level || 75;
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '3px',
        fontSize: '9px',
        color: textColor
      }}>
        <span>{name}</span>
        <span>{percentage}%</span>
      </div>
      <div style={{
        height: '6px',
        backgroundColor: trackColor || 'rgba(255,255,255,0.2)',
        borderRadius: '3px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: barColor || '#800080',
          borderRadius: '3px',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
}

export default function ResumePreview() {
  const { resume } = useResumeStore();
  const { getCurrentTemplate } = useTemplateStore();

  const template = getCurrentTemplate();
  const { colors, fonts, spacing, features } = template?.styles || {};
  const { layout } = template || {};

  // Determine if using sidebar layout
  const hasSidebar = layout?.sidebar?.enabled;
  const sidebarPosition = layout?.sidebar?.position || 'right';
  const sidebarSections = layout?.sidebar?.sections || [];
  const isFullHeightSidebar = layout?.sidebar?.fullHeight;
  const isSplitHeader = layout?.headerStyle === 'split';
  const hasSkillProgressBars = features?.skillProgressBars;
  const hasContactIcons = features?.contactIcons;
  const hasAccentBullets = features?.accentBullets;

  // Check if header has dark background for contrast
  const headerBg = colors?.headerBg || colors?.background || '#ffffff';
  const hasHeader = headerBg && headerBg !== colors?.background;
  const headerIsDark = isDarkColor(headerBg);

  // Dynamic styles based on template
  // A4 size: 210mm x 297mm (794px x 1123px at 96 DPI)
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;

  const styles = {
    page: {
      fontFamily: `${fonts?.body || 'Inter'}, Helvetica, Arial, sans-serif`,
      fontSize: fonts?.sizes?.body || '10.5px',
      paddingTop: hasHeader ? '0' : (spacing?.padding || '32px'),
      paddingBottom: '0',
      paddingLeft: hasHeader ? '0' : (spacing?.padding || '36px'),
      paddingRight: hasHeader ? '0' : (spacing?.padding || '36px'),
      backgroundColor: colors?.background || '#ffffff',
      color: colors?.text || '#1e293b',
      width: `${A4_WIDTH_PX}px`,
      minHeight: `${A4_HEIGHT_PX}px`,
      boxSizing: 'border-box',
      lineHeight: '1.5'
    },
    header: {
      textAlign: layout?.headerStyle === 'centered' ? 'center' : 'left',
      marginBottom: '16px',
      backgroundColor: headerBg,
      padding: hasHeader ? (spacing?.padding || '32px') : '0',
      marginLeft: hasHeader ? '0' : '0',
      marginRight: hasHeader ? '0' : '0'
    },
    profileImage: {
      width: '70px',
      height: '70px',
      borderRadius: '35px',
      marginBottom: '10px',
      objectFit: 'cover',
      border: `2px solid ${headerIsDark ? '#ffffff' : (colors?.primary || '#2563eb')}`
    },
    name: {
      fontSize: fonts?.sizes?.name || '24px',
      fontWeight: '700',
      fontFamily: `${fonts?.heading || 'Inter'}, Helvetica, Arial, sans-serif`,
      color: headerIsDark ? '#ffffff' : (colors?.text || '#1e293b'),
      marginBottom: '4px',
      letterSpacing: '-0.5px',
      lineHeight: '1.2'
    },
    title: {
      fontSize: fonts?.sizes?.title || '13px',
      color: headerIsDark ? (colors?.accent || '#93c5fd') : (colors?.primary || '#2563eb'),
      marginBottom: '10px',
      fontWeight: '500',
      letterSpacing: '0.2px'
    },
    contactRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: layout?.headerStyle === 'centered' ? 'center' : 'flex-start',
      flexWrap: 'wrap',
      gap: '14px',
      fontSize: '10px',
      color: headerIsDark ? 'rgba(255,255,255,0.9)' : (colors?.text || '#1e293b'),
      lineHeight: '1.4'
    },
    contactLink: {
      color: headerIsDark ? 'rgba(255,255,255,0.9)' : (colors?.primary || '#2563eb'),
      textDecoration: 'none',
      borderBottom: headerIsDark ? 'none' : `1px solid transparent`,
      transition: 'border-color 0.2s'
    },
    section: {
      marginBottom: spacing?.sectionGap || '18px',
      marginTop: '6px'
    },
    sectionTitle: {
      fontSize: fonts?.sizes?.sectionTitle || '11px',
      fontWeight: '700',
      fontFamily: `${fonts?.heading || 'Inter'}, Helvetica, Arial, sans-serif`,
      color: colors?.primary || '#2563eb',
      textTransform: 'uppercase',
      letterSpacing: '1.2px',
      marginBottom: '10px',
      paddingBottom: '5px',
      borderBottom: `2px solid ${colors?.primary || '#2563eb'}`
    },
    summary: {
      fontSize: fonts?.sizes?.body || '10.5px',
      lineHeight: '1.6',
      color: colors?.secondary || '#64748b',
      whiteSpace: 'pre-line',
      textAlign: 'justify'
    },
    experienceItem: {
      marginBottom: spacing?.itemGap || '14px',
      breakInside: 'avoid',
      pageBreakInside: 'avoid'
    },
    experienceHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: '2px',
      alignItems: 'flex-start'
    },
    experienceLeft: {
      flex: 1
    },
    experienceRight: {
      textAlign: 'right',
      fontSize: '10px',
      color: colors?.secondary || '#64748b',
      lineHeight: '1.4'
    },
    positionTitle: {
      fontSize: '12px',
      fontWeight: '700',
      color: colors?.text || '#1e293b',
      lineHeight: '1.3',
      marginBottom: '1px'
    },
    companyName: {
      fontSize: '10.5px',
      color: colors?.secondary || '#64748b',
      fontWeight: '400',
      fontStyle: 'italic'
    },
    description: {
      fontSize: '10px',
      color: colors?.secondary || '#64748b',
      marginTop: '4px',
      marginBottom: '6px',
      whiteSpace: 'pre-line',
      lineHeight: '1.5'
    },
    bulletList: {
      marginLeft: '8px',
      marginTop: '4px'
    },
    bulletItem: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '3px',
      alignItems: 'flex-start'
    },
    bullet: {
      width: '12px',
      fontSize: '10px',
      color: colors?.secondary || '#64748b',
      lineHeight: '1.45'
    },
    bulletText: {
      flex: 1,
      fontSize: '10px',
      lineHeight: '1.45',
      color: colors?.text || '#1e293b'
    },
    educationItem: {
      marginBottom: '10px',
      breakInside: 'avoid',
      pageBreakInside: 'avoid'
    },
    educationHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    degree: {
      fontSize: '11px',
      fontWeight: '700',
      color: colors?.text || '#1e293b',
      lineHeight: '1.3'
    },
    institution: {
      fontSize: '10.5px',
      color: colors?.secondary || '#64748b',
      fontWeight: '400',
      fontStyle: 'italic'
    },
    skillCategory: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '8px',
      flexWrap: 'nowrap',
      alignItems: 'flex-start'
    },
    skillName: {
      fontWeight: '600',
      fontSize: '10.5px',
      color: colors?.text || '#1e293b',
      minWidth: hasSidebar ? 'auto' : '145px',
      width: hasSidebar ? 'auto' : '145px',
      marginRight: hasSidebar ? '8px' : '12px',
      flexShrink: 0,
      lineHeight: '1.5'
    },
    skillItems: {
      flex: 1,
      fontSize: '10.5px',
      color: colors?.text || '#1e293b',
      lineHeight: '1.5'
    },
    projectItem: {
      marginBottom: '12px',
      breakInside: 'avoid',
      pageBreakInside: 'avoid'
    },
    projectHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: '4px',
      gap: '8px'
    },
    projectName: {
      fontSize: '11px',
      fontWeight: '700',
      color: colors?.text || '#1e293b'
    },
    projectLink: {
      fontSize: '10px',
      color: colors?.primary || '#2563eb',
      textDecoration: 'underline',
      textUnderlineOffset: '2px'
    },
    projectTech: {
      fontSize: '10px',
      color: colors?.secondary || '#64748b',
      marginBottom: '5px',
      fontWeight: '500'
    },
    certificationItem: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: '8px',
      breakInside: 'avoid',
      pageBreakInside: 'avoid'
    },
    certName: {
      fontSize: '10.5px',
      fontWeight: '600',
      color: colors?.text || '#1e293b'
    },
    certIssuer: {
      fontSize: '10px',
      color: colors?.secondary || '#64748b',
      fontStyle: 'italic'
    },
    certDate: {
      fontSize: '10px',
      color: colors?.secondary || '#64748b',
      whiteSpace: 'nowrap'
    },
    sidebar: {
      padding: '16px',
      borderRadius: '6px',
      backgroundColor: colors?.sidebarBg || '#f8fafc'
    },
    // Modern 2026 specific styles
    fullHeightSidebar: {
      padding: spacing?.sidebarPadding || '24px',
      backgroundColor: colors?.sidebarBg || '#001F3F',
      color: colors?.sidebarText || '#ffffff',
      minHeight: `${A4_HEIGHT_PX}px`,
      width: '35%'
    },
    sidebarContactItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px',
      fontSize: '9.5px',
      color: colors?.sidebarText || '#ffffff'
    },
    sidebarContactIcon: {
      width: '26px',
      height: '26px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255,255,255,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    sidebarSectionTitle: {
      fontSize: fonts?.sizes?.sectionTitle || '12px',
      fontWeight: '600',
      fontFamily: `${fonts?.heading || 'Inter'}, Helvetica, Arial, sans-serif`,
      color: colors?.sidebarText || '#ffffff',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '12px',
      marginTop: '18px',
      paddingBottom: '6px',
      borderBottom: `1px solid rgba(255,255,255,0.3)`
    },
    mainContentArea: {
      padding: spacing?.mainPadding || '28px',
      flex: 1
    },
    accentBullet: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: colors?.accent || '#2E8B57',
      marginRight: '8px',
      marginTop: '4px',
      flexShrink: 0
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
                <div key={i} style={{ ...styles.bulletItem, alignItems: hasAccentBullets ? 'flex-start' : 'baseline' }}>
                  {hasAccentBullets ? (
                    <div style={styles.accentBullet} />
                  ) : (
                    <span style={styles.bullet}>•</span>
                  )}
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
  const renderSkills = (inSidebar = false) => (
    <ClickableRegion section="skills" style={styles.section} className="resume-section">
      {inSidebar && isFullHeightSidebar ? (
        <div style={styles.sidebarSectionTitle}>Skill Proficiency</div>
      ) : (
        renderSectionTitle('Skills')
      )}
      {hasSkillProgressBars && inSidebar ? (
        // Render progress bars for Modern 2026 template
        skills.categories.map((category) => (
          <div key={category.id} style={{ marginBottom: '12px' }}>
            <div style={{
              fontSize: '9px',
              fontWeight: '600',
              color: colors?.sidebarText || '#ffffff',
              marginBottom: '6px'
            }}>
              {category.name}
            </div>
            {category.items.map((skill, idx) => (
              <SkillProgressBar
                key={idx}
                name={skill}
                level={70 + (idx * 5) % 30}
                barColor={colors?.skillBar || '#800080'}
                trackColor="rgba(255,255,255,0.2)"
                textColor={colors?.sidebarText || '#ffffff'}
              />
            ))}
          </div>
        ))
      ) : (
        // Default skill rendering
        skills.categories.map((category) => (
          <div key={category.id} style={styles.skillCategory}>
            <span style={styles.skillName}>{category.name}:</span>
            <span style={styles.skillItems}>{category.items.join(', ')}</span>
          </div>
        ))
      )}
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
                View ↗
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

  // Render contact info with icons for sidebar
  const renderSidebarContact = () => {
    if (!hasContactIcons) return null;

    const contactItems = [
      { icon: 'phone', value: personalInfo.phone },
      { icon: 'email', value: personalInfo.email, link: `mailto:${personalInfo.email}` },
      { icon: 'linkedin', value: personalInfo.linkedIn, link: `https://${personalInfo.linkedIn}` },
      { icon: 'website', value: personalInfo.portfolio, link: `https://${personalInfo.portfolio}` },
      { icon: 'github', value: personalInfo.github, link: `https://${personalInfo.github}` },
      { icon: 'location', value: personalInfo.location }
    ].filter(item => item.value);

    return (
      <div style={{ marginBottom: '16px' }}>
        {contactItems.map((item, idx) => (
          <div key={idx} style={styles.sidebarContactItem}>
            <div style={styles.sidebarContactIcon}>
              {ContactIcons[item.icon](colors?.sidebarText || '#ffffff')}
            </div>
            {item.link ? (
              <a href={item.link} style={{ color: colors?.sidebarText || '#ffffff', textDecoration: 'none', fontSize: '8px', wordBreak: 'break-all' }}>
                {item.value}
              </a>
            ) : (
              <span style={{ fontSize: '8px', wordBreak: 'break-all' }}>{item.value}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render certifications for sidebar with different styling
  const renderSidebarCertifications = () => (
    <ClickableRegion section="certifications" style={styles.section} className="resume-section">
      <div style={styles.sidebarSectionTitle}>Certifications</div>
      {certifications.map((cert) => (
        <ClickableRegion
          key={cert.id}
          section="certifications"
          itemId={cert.id}
          style={{ marginBottom: '6px' }}
          className="resume-item"
        >
          <div style={{ fontSize: '9px', fontWeight: '500', color: colors?.sidebarText || '#ffffff' }}>
            {cert.name}
          </div>
          <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.7)' }}>
            {cert.issuer} • {formatDate(cert.date)}
          </div>
        </ClickableRegion>
      ))}
    </ClickableRegion>
  );

  // Get sections for sidebar
  const renderSidebarSections = () => {
    if (!hasSidebar) return null;

    const sections = {
      summary: personalInfo.summary && (
        <ClickableRegion key="summary" section="summary" style={styles.section} className="resume-section">
          {isFullHeightSidebar ? (
            <div style={styles.sidebarSectionTitle}>Summary</div>
          ) : (
            renderSectionTitle('Summary')
          )}
          <div style={{
            ...styles.summary,
            color: isFullHeightSidebar ? (colors?.sidebarText || '#ffffff') : (colors?.secondary || '#64748b')
          }}>
            {personalInfo.summary}
          </div>
        </ClickableRegion>
      ),
      skills: skills.categories.length > 0 && renderSkills(isFullHeightSidebar),
      certifications: certifications.length > 0 && (isFullHeightSidebar ? renderSidebarCertifications() : renderCertifications()),
      projects: projects.length > 0 && renderProjects()
    };

    return sidebarSections.map(key => sections[key]).filter(Boolean);
  };

  // Modern 2026 full-height sidebar layout
  if (isFullHeightSidebar && hasSidebar) {
    return (
      <div style={{
        ...styles.page,
        display: 'flex',
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        gap: 0
      }}>
        {/* Full-height Sidebar */}
        {sidebarPosition === 'left' && (
          <div style={styles.fullHeightSidebar}>
            <ClickableRegion section="personalInfo">
              {/* Profile photo in sidebar */}
              {personalInfo.photo && (
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <img
                    src={personalInfo.photo}
                    alt="Profile"
                    style={{
                      ...styles.profileImage,
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      border: `3px solid ${colors?.skillBar || '#800080'}`
                    }}
                  />
                </div>
              )}
              {/* Contact info with icons */}
              {renderSidebarContact()}
            </ClickableRegion>

            {/* Sidebar sections */}
            {renderSidebarSections()}
          </div>
        )}

        {/* Main Content Area */}
        <div style={styles.mainContentArea}>
          {/* Header in main content */}
          <ClickableRegion section="personalInfo" style={{
            ...styles.header,
            textAlign: 'left',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: `2px solid ${colors?.primary || '#001F3F'}`
          }}>
            <div style={{
              ...styles.name,
              fontSize: fonts?.sizes?.name || '24px',
              color: colors?.primary || '#001F3F',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              {personalInfo.fullName || 'Your Name'}
            </div>
            <div style={{
              ...styles.title,
              fontSize: fonts?.sizes?.title || '12px',
              color: colors?.secondary || '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {personalInfo.title || 'Your Title'}
            </div>
          </ClickableRegion>

          {/* Main sections */}
          {renderMainSections()}
          {customSections.length > 0 && renderCustomSections()}
        </div>

        {/* Right sidebar if position is right */}
        {sidebarPosition === 'right' && (
          <div style={styles.fullHeightSidebar}>
            <ClickableRegion section="personalInfo">
              {personalInfo.photo && (
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <img
                    src={personalInfo.photo}
                    alt="Profile"
                    style={{
                      ...styles.profileImage,
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      border: `3px solid ${colors?.skillBar || '#800080'}`
                    }}
                  />
                </div>
              )}
              {renderSidebarContact()}
            </ClickableRegion>
            {renderSidebarSections()}
          </div>
        )}
      </div>
    );
  }

  // Standard layout (existing logic)
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
          paddingLeft: hasHeader ? (spacing?.padding || '36px') : '0',
          paddingRight: hasHeader ? (spacing?.padding || '36px') : '0'
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
          paddingLeft: hasHeader ? (spacing?.padding || '36px') : '0',
          paddingRight: hasHeader ? (spacing?.padding || '36px') : '0'
        }}>
          {renderMainSections()}
          {customSections.length > 0 && renderCustomSections()}
        </div>
      )}
    </div>
  );
}
