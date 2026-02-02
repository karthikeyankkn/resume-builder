import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
  Image
} from '@react-pdf/renderer';

import { splitTextByNewlines } from '../../utils/textUtils';

// Disable hyphenation to avoid potential issues
Font.registerHyphenationCallback(word => [word]);

// Use built-in PDF fonts for reliability
// Available: Helvetica, Times-Roman, Courier
const getFontFamily = (preferredFont) => {
  // Map template fonts to built-in PDF fonts
  const fontMap = {
    'Inter': 'Helvetica',
    'Merriweather': 'Times-Roman',
    'Roboto': 'Helvetica',
    'Open Sans': 'Helvetica',
    'default': 'Helvetica'
  };
  return fontMap[preferredFont] || fontMap['default'];
};

// Helper to format date
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + '-01');
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Helper to parse font size from string (e.g., "14px" -> 14)
const parseFontSize = (size, defaultSize) => {
  if (!size) return defaultSize;
  const parsed = parseInt(size, 10);
  return isNaN(parsed) ? defaultSize : parsed;
};

// Helper to parse padding from string (e.g., "40px" -> 40)
const parsePadding = (padding, defaultPadding) => {
  if (!padding) return defaultPadding;
  const parsed = parseInt(padding, 10);
  return isNaN(parsed) ? defaultPadding : parsed;
};

// Check if a color is dark (for contrast calculation)
const isDarkColor = (hexColor) => {
  if (!hexColor || hexColor === 'transparent') return false;
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

// Progress bar component for skills in PDF
const SkillProgressBarPDF = ({ name, level, barColor, trackColor, textColor }) => {
  const percentage = level || 75;
  return (
    <View style={{ marginBottom: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
        <Text style={{ fontSize: 8, color: textColor }}>{name}</Text>
        <Text style={{ fontSize: 7, color: textColor }}>{percentage}%</Text>
      </View>
      <View style={{
        height: 5,
        backgroundColor: trackColor || 'rgba(255,255,255,0.2)',
        borderRadius: 2
      }}>
        <View style={{
          width: `${percentage}%`,
          height: 5,
          backgroundColor: barColor || '#800080',
          borderRadius: 2
        }} />
      </View>
    </View>
  );
};

// Resume PDF Component
export default function ResumePDF({ resume, template }) {
  // Defensive checks for missing data
  if (!resume) {
    return (
      <Document>
        <Page size="A4" style={{ padding: 30 }}>
          <Text>No resume data available</Text>
        </Page>
      </Document>
    );
  }

  // Get template styles with defaults
  const templateColors = template?.styles?.colors || {};
  const templateFonts = template?.styles?.fonts || {};
  const templateSpacing = template?.styles?.spacing || {};
  const templateLayout = template?.layout || {};

  // Colors from template
  const colors = {
    primary: templateColors.primary || '#2563eb',
    text: templateColors.text || '#1e293b',
    secondary: templateColors.secondary || '#64748b',
    border: templateColors.border || '#e2e8f0',
    background: templateColors.background || '#ffffff',
    sidebarBg: templateColors.sidebarBg || '#f8fafc'
  };

  // Font sizes from template (improved defaults for better typography)
  const fontSizes = {
    name: parseFontSize(templateFonts.sizes?.name, 24),
    title: parseFontSize(templateFonts.sizes?.title, 13),
    sectionTitle: parseFontSize(templateFonts.sizes?.sectionTitle, 12),
    body: parseFontSize(templateFonts.sizes?.body, 10.5)
  };

  // Spacing from template (improved defaults for better visual hierarchy)
  const padding = parsePadding(templateSpacing.padding, 36);
  const sectionGap = parsePadding(templateSpacing.sectionGap, 16);
  const itemGap = parsePadding(templateSpacing.itemGap, 14);

  // Layout settings
  const hasSidebar = templateLayout.sidebar?.enabled;
  const sidebarPosition = templateLayout.sidebar?.position || 'right';
  const sidebarSections = templateLayout.sidebar?.sections || [];
  const headerStyle = templateLayout.headerStyle || 'centered';
  const isFullHeightSidebar = templateLayout.sidebar?.fullHeight;
  const templateFeatures = template?.styles?.features || {};
  const hasSkillProgressBars = templateFeatures.skillProgressBars;
  const hasContactIcons = templateFeatures.contactIcons;

  // Additional colors for Modern 2026
  const sidebarBg = templateColors.sidebarBg || colors.sidebarBg;
  const sidebarText = templateColors.sidebarText || '#ffffff';
  const skillBarColor = templateColors.skillBar || '#800080';
  const accentColor = templateColors.accent || '#2E8B57';

  // Header background support (to match preview)
  const headerBg = templateColors.headerBg || colors.background;
  const hasHeaderBg = headerBg && headerBg !== colors.background;
  const headerIsDark = isDarkColor(headerBg);

  // Get font family with fallback for offline scenarios
  const bodyFont = getFontFamily(templateFonts.body || 'Inter');

  // Create styles based on template
  const styles = StyleSheet.create({
    page: {
      fontFamily: bodyFont,
      fontSize: fontSizes.body,
      paddingTop: hasHeaderBg ? 0 : 32,
      paddingBottom: 32,
      paddingHorizontal: hasHeaderBg ? 0 : padding,
      backgroundColor: colors.background,
      color: colors.text,
      lineHeight: 1.5
    },
    header: {
      textAlign: headerStyle === 'centered' ? 'center' : 'left',
      alignItems: headerStyle === 'centered' ? 'center' : 'flex-start',
      marginBottom: 16,
      backgroundColor: hasHeaderBg ? headerBg : 'transparent',
      padding: hasHeaderBg ? padding : 0
    },
    profileImage: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginBottom: 10,
      objectFit: 'cover'
    },
    name: {
      fontSize: fontSizes.name,
      fontWeight: 700,
      color: headerIsDark ? '#ffffff' : colors.text,
      marginBottom: 4,
      letterSpacing: -0.5,
      lineHeight: 1.2
    },
    title: {
      fontSize: fontSizes.title,
      color: headerIsDark ? (accentColor || '#93c5fd') : colors.primary,
      marginBottom: 10,
      fontWeight: 500,
      letterSpacing: 0.2
    },
    contactRow: {
      flexDirection: 'row',
      justifyContent: headerStyle === 'centered' ? 'center' : 'flex-start',
      flexWrap: 'wrap',
      gap: 12,
      fontSize: 9.5,
      color: headerIsDark ? 'rgba(255,255,255,0.85)' : colors.secondary
    },
    contactLink: {
      color: headerIsDark ? 'rgba(255,255,255,0.85)' : colors.secondary,
      textDecoration: 'none'
    },
    section: {
      marginBottom: sectionGap
    },
    sectionTitle: {
      fontSize: fontSizes.sectionTitle,
      fontWeight: 600,
      color: colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
      paddingBottom: 4,
      borderBottomWidth: 1.5,
      borderBottomColor: colors.primary
    },
    summary: {
      fontSize: fontSizes.body,
      lineHeight: 1.6,
      color: colors.secondary
    },
    experienceItem: {
      marginBottom: itemGap
    },
    experienceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 3
    },
    experienceLeft: {
      flex: 1
    },
    experienceRight: {
      textAlign: 'right',
      fontSize: 9.5,
      color: colors.secondary
    },
    positionTitle: {
      fontSize: fontSizes.sectionTitle,
      fontWeight: 600,
      color: colors.text,
      lineHeight: 1.3
    },
    companyName: {
      fontSize: fontSizes.body,
      color: colors.primary,
      fontWeight: 500
    },
    description: {
      fontSize: 10,
      color: colors.secondary,
      marginTop: 4,
      marginBottom: 6,
      lineHeight: 1.5
    },
    bulletList: {
      marginLeft: 12
    },
    bulletItem: {
      flexDirection: 'row',
      marginBottom: 4
    },
    bullet: {
      width: 10,
      fontSize: 10,
      color: colors.primary
    },
    bulletText: {
      flex: 1,
      fontSize: 10,
      lineHeight: 1.5
    },
    educationItem: {
      marginBottom: 12
    },
    educationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    degree: {
      fontSize: fontSizes.sectionTitle,
      fontWeight: 600,
      color: colors.text,
      lineHeight: 1.3
    },
    institution: {
      fontSize: fontSizes.body,
      color: colors.primary,
      fontWeight: 500
    },
    skillCategory: {
      flexDirection: 'row',
      marginBottom: 6,
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    skillName: {
      fontWeight: 600,
      fontSize: 10,
      color: colors.text,
      width: hasSidebar ? 'auto' : 110,
      marginRight: hasSidebar ? 6 : 0
    },
    skillItems: {
      flex: 1,
      fontSize: 10,
      color: colors.secondary,
      lineHeight: 1.5
    },
    projectItem: {
      marginBottom: 12
    },
    projectHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 3
    },
    projectName: {
      fontSize: fontSizes.body,
      fontWeight: 600,
      color: colors.text
    },
    projectLink: {
      fontSize: 9.5,
      color: colors.primary,
      marginLeft: 6,
      textDecoration: 'none'
    },
    projectTech: {
      fontSize: 9.5,
      color: colors.primary,
      marginBottom: 4,
      fontStyle: 'italic'
    },
    certificationItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8
    },
    certName: {
      fontSize: fontSizes.body,
      fontWeight: 600,
      color: colors.text
    },
    certIssuer: {
      fontSize: 9.5,
      color: colors.secondary
    },
    certDate: {
      fontSize: 9.5,
      color: colors.secondary
    },
    twoColumnLayout: {
      flexDirection: 'row',
      gap: 18
    },
    mainColumn: {
      flex: 1
    },
    sidebarColumn: {
      width: '30%',
      backgroundColor: colors.sidebarBg,
      padding: 16,
      borderRadius: 6
    },
    // Modern 2026 full-height sidebar styles
    fullHeightSidebar: {
      width: '35%',
      backgroundColor: sidebarBg || '#001F3F',
      padding: 24,
      minHeight: '100%'
    },
    sidebarText: {
      color: sidebarText,
      fontSize: 9.5
    },
    sidebarSectionTitle: {
      fontSize: fontSizes.sectionTitle,
      fontWeight: 600,
      color: sidebarText,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 12,
      marginTop: 18,
      paddingBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.3)'
    },
    sidebarContactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10
    },
    sidebarContactIcon: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: 'rgba(255,255,255,0.15)',
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center'
    },
    mainContentArea: {
      flex: 1,
      padding: 24
    },
    splitHeader: {
      marginBottom: 16,
      paddingBottom: 10,
      borderBottomWidth: 2,
      borderBottomColor: colors.primary
    },
    splitHeaderName: {
      fontSize: fontSizes.name,
      fontWeight: 700,
      color: colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 2
    },
    splitHeaderTitle: {
      fontSize: fontSizes.title,
      color: colors.secondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginTop: 2
    }
  });

  const personalInfo = resume.personalInfo || {};
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = resume.skills || { categories: [] };
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];
  const customSections = resume.customSections || [];

  // Render Summary
  const renderSummary = () => (
    personalInfo.summary && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        {splitTextByNewlines(personalInfo.summary).map((line, i) => (
          <Text key={i} style={styles.summary}>{line || ' '}</Text>
        ))}
      </View>
    )
  );

  // Render Experience
  const renderExperience = () => (
    experience.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        {experience.map((exp) => (
          <View key={exp.id} style={styles.experienceItem} wrap={false}>
            <View style={styles.experienceHeader}>
              <View style={styles.experienceLeft}>
                <Text style={styles.positionTitle}>{exp.position}</Text>
                <Text style={styles.companyName}>{exp.company}</Text>
              </View>
              <View style={styles.experienceRight}>
                <Text>{exp.location}</Text>
                <Text>
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </Text>
              </View>
            </View>
            {exp.description && (
              <View>
                {splitTextByNewlines(exp.description).map((line, i) => (
                  <Text key={i} style={styles.description}>{line || ' '}</Text>
                ))}
              </View>
            )}
            {exp.highlights.filter(h => h).length > 0 && (
              <View style={styles.bulletList}>
                {exp.highlights.filter(h => h).map((highlight, i) => (
                  <View key={i} style={{ ...styles.bulletItem, alignItems: templateFeatures.accentBullets ? 'flex-start' : 'center' }}>
                    {templateFeatures.accentBullets ? (
                      <View style={{
                        width: 5,
                        height: 5,
                        borderRadius: 2.5,
                        backgroundColor: accentColor,
                        marginRight: 6,
                        marginTop: 3
                      }} />
                    ) : (
                      <Text style={styles.bullet}>•</Text>
                    )}
                    <Text style={styles.bulletText}>{highlight}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    )
  );

  // Render Education
  const renderEducation = () => (
    education.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        {education.map((edu) => (
          <View key={edu.id} style={styles.educationItem} wrap={false}>
            <View style={styles.educationHeader}>
              <View>
                <Text style={styles.degree}>
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </Text>
                <Text style={styles.institution}>{edu.institution}</Text>
              </View>
              <View style={styles.experienceRight}>
                <Text>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</Text>
                {edu.gpa && <Text>GPA: {edu.gpa}</Text>}
              </View>
            </View>
            {edu.highlights.filter(h => h).length > 0 && (
              <View style={styles.bulletList}>
                {edu.highlights.filter(h => h).map((highlight, i) => (
                  <View key={i} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{highlight}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    )
  );

  // Render Skills
  const renderSkills = (inSidebar = false) => (
    skills.categories.length > 0 && (
      <View style={styles.section}>
        {inSidebar && isFullHeightSidebar ? (
          <Text style={styles.sidebarSectionTitle}>Skill Proficiency</Text>
        ) : (
          <Text style={styles.sectionTitle}>Skills</Text>
        )}
        {hasSkillProgressBars && inSidebar ? (
          // Render progress bars for Modern 2026 template
          skills.categories.map((category) => (
            <View key={category.id} style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 8, fontWeight: 600, color: sidebarText, marginBottom: 4 }}>
                {category.name}
              </Text>
              {category.items.map((skill, idx) => (
                <SkillProgressBarPDF
                  key={idx}
                  name={skill}
                  level={70 + (idx * 5) % 30}
                  barColor={skillBarColor}
                  trackColor="rgba(255,255,255,0.2)"
                  textColor={sidebarText}
                />
              ))}
            </View>
          ))
        ) : (
          // Default skill rendering
          skills.categories.map((category) => (
            <View key={category.id} style={styles.skillCategory}>
              <Text style={styles.skillName}>{category.name}:</Text>
              <Text style={styles.skillItems}>{category.items.join(', ')}</Text>
            </View>
          ))
        )}
      </View>
    )
  );

  // Render Projects
  const renderProjects = () => (
    projects.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projects</Text>
        {projects.map((project) => (
          <View key={project.id} style={styles.projectItem} wrap={false}>
            <View style={styles.projectHeader}>
              <Text style={styles.projectName}>{project.name}</Text>
              {project.link && (
                <Link src={`https://${project.link}`} style={styles.projectLink}>
                  [Link]
                </Link>
              )}
            </View>
            {project.technologies.length > 0 && (
              <Text style={styles.projectTech}>
                {project.technologies.join(' • ')}
              </Text>
            )}
            {project.description && (
              <View>
                {splitTextByNewlines(project.description).map((line, i) => (
                  <Text key={i} style={styles.description}>{line || ' '}</Text>
                ))}
              </View>
            )}
            {project.highlights.filter(h => h).length > 0 && (
              <View style={styles.bulletList}>
                {project.highlights.filter(h => h).map((highlight, i) => (
                  <View key={i} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{highlight}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    )
  );

  // Render Certifications
  const renderCertifications = () => (
    certifications.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certifications</Text>
        {certifications.map((cert) => (
          <View key={cert.id} style={styles.certificationItem} wrap={false}>
            <View>
              <Text style={styles.certName}>{cert.name}</Text>
              <Text style={styles.certIssuer}>{cert.issuer}</Text>
            </View>
            <Text style={styles.certDate}>{formatDate(cert.date)}</Text>
          </View>
        ))}
      </View>
    )
  );

  // Render Custom Sections
  const renderCustomSections = () => (
    customSections.length > 0 && (
      <>
        {customSections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.type === 'text' ? (
              <Text style={styles.summary}>
                {section.content?.[0]?.text || ''}
              </Text>
            ) : section.type === 'grid' ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {(section.content || []).filter(item => item.text).map((item) => {
                  const [label, value] = item.text.includes(':')
                    ? item.text.split(':').map(s => s.trim())
                    : [item.text, ''];
                  return (
                    <View key={item.id} style={{ width: '50%', flexDirection: 'row', marginBottom: 2 }}>
                      <Text style={{ fontWeight: 500, fontSize: 8, color: colors.text }}>{label}</Text>
                      {value && <Text style={{ fontSize: 8, color: colors.secondary, marginLeft: 4 }}>{value}</Text>}
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.bulletList}>
                {(section.content || []).filter(item => item.text).map((item) => (
                  <View key={item.id} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </>
    )
  );

  // Get main content sections (excluding sidebar sections)
  const renderMainSections = () => {
    const sections = {
      summary: renderSummary(),
      experience: renderExperience(),
      education: renderEducation(),
      skills: renderSkills(),
      projects: renderProjects(),
      certifications: renderCertifications()
    };

    // Use template's section order, falling back to default order
    const defaultOrder = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'];
    const templateOrder = templateLayout.sectionOrder || defaultOrder;

    // Filter to only sections that exist (excluding personalInfo which is in header)
    const orderedKeys = templateOrder.filter(key => key !== 'personalInfo' && key in sections);

    // Filter out sidebar sections if using sidebar layout
    const mainSectionKeys = hasSidebar
      ? orderedKeys.filter(key => !sidebarSections.includes(key))
      : orderedKeys;

    return mainSectionKeys.map(key => sections[key]);
  };

  // Render certifications for sidebar with different styling
  const renderSidebarCertifications = () => (
    certifications.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sidebarSectionTitle}>Certifications</Text>
        {certifications.map((cert) => (
          <View key={cert.id} style={{ marginBottom: 5 }} wrap={false}>
            <Text style={{ fontSize: 8, fontWeight: 500, color: sidebarText }}>{cert.name}</Text>
            <Text style={{ fontSize: 7, color: 'rgba(255,255,255,0.7)' }}>
              {cert.issuer} • {formatDate(cert.date)}
            </Text>
          </View>
        ))}
      </View>
    )
  );

  // Render contact info for sidebar
  const renderSidebarContact = () => {
    if (!hasContactIcons) return null;

    const contactItems = [
      { label: 'Phone', value: personalInfo.phone },
      { label: 'Email', value: personalInfo.email },
      { label: 'LinkedIn', value: personalInfo.linkedIn },
      { label: 'Portfolio', value: personalInfo.portfolio },
      { label: 'GitHub', value: personalInfo.github },
      { label: 'Location', value: personalInfo.location }
    ].filter(item => item.value);

    return (
      <View style={{ marginBottom: 12 }}>
        {contactItems.map((item, idx) => (
          <View key={idx} style={styles.sidebarContactItem}>
            <View style={styles.sidebarContactIcon}>
              <Text style={{ fontSize: 6, color: sidebarText }}>•</Text>
            </View>
            <Text style={{ fontSize: 7, color: sidebarText }}>{item.value}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Get sidebar sections
  const renderSidebarContent = () => {
    const sections = {
      summary: renderSummary(),
      skills: renderSkills(isFullHeightSidebar),
      certifications: isFullHeightSidebar ? renderSidebarCertifications() : renderCertifications(),
      projects: renderProjects()
    };

    return sidebarSections.map(key => sections[key]).filter(Boolean);
  };

  // Modern 2026 full-height sidebar layout
  if (isFullHeightSidebar && hasSidebar) {
    return (
      <Document
        title={`${personalInfo.fullName} - Resume`}
        author={personalInfo.fullName}
        subject="Professional Resume"
        keywords="resume, cv, professional"
      >
        <Page size="A4" style={{ ...styles.page, flexDirection: 'row', padding: 0 }}>
          {/* Full-height Sidebar */}
          {sidebarPosition === 'left' && (
            <View style={styles.fullHeightSidebar}>
              {/* Profile photo in sidebar */}
              {personalInfo.photo && (
                <View style={{ alignItems: 'center', marginBottom: 12 }}>
                  <Image
                    src={personalInfo.photo}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 35,
                      objectFit: 'cover'
                    }}
                  />
                </View>
              )}
              {/* Contact info */}
              {renderSidebarContact()}
              {/* Sidebar sections */}
              {renderSidebarContent()}
            </View>
          )}

          {/* Main Content Area */}
          <View style={styles.mainContentArea}>
            {/* Header in main content */}
            <View style={styles.splitHeader}>
              <Text style={styles.splitHeaderName}>
                {personalInfo.fullName || 'Your Name'}
              </Text>
              <Text style={styles.splitHeaderTitle}>
                {personalInfo.title || 'Your Title'}
              </Text>
            </View>

            {/* Main sections */}
            {renderMainSections()}
            {renderCustomSections()}
          </View>

          {/* Right sidebar if position is right */}
          {sidebarPosition === 'right' && (
            <View style={styles.fullHeightSidebar}>
              {personalInfo.photo && (
                <View style={{ alignItems: 'center', marginBottom: 12 }}>
                  <Image
                    src={personalInfo.photo}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 35,
                      objectFit: 'cover'
                    }}
                  />
                </View>
              )}
              {renderSidebarContact()}
              {renderSidebarContent()}
            </View>
          )}
        </Page>
      </Document>
    );
  }

  // Standard layout
  return (
    <Document
      title={`${personalInfo.fullName} - Resume`}
      author={personalInfo.fullName}
      subject="Professional Resume"
      keywords="resume, cv, professional"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {personalInfo.photo && (
            <Image src={personalInfo.photo} style={styles.profileImage} />
          )}
          <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>
          <Text style={styles.title}>{personalInfo.title || 'Your Title'}</Text>

          <View style={styles.contactRow}>
            {personalInfo.email && (
              <Link src={`mailto:${personalInfo.email}`} style={styles.contactLink}>
                {personalInfo.email}
              </Link>
            )}
            {personalInfo.phone && (
              <Text>{personalInfo.phone}</Text>
            )}
            {personalInfo.location && (
              <Text>{personalInfo.location}</Text>
            )}
            {personalInfo.linkedIn && (
              <Link src={`https://${personalInfo.linkedIn}`} style={styles.contactLink}>
                LinkedIn
              </Link>
            )}
            {personalInfo.github && (
              <Link src={`https://${personalInfo.github}`} style={styles.contactLink}>
                GitHub
              </Link>
            )}
            {personalInfo.portfolio && (
              <Link src={`https://${personalInfo.portfolio}`} style={styles.contactLink}>
                Portfolio
              </Link>
            )}
          </View>
        </View>

        {/* Content Layout */}
        <View style={hasHeaderBg ? { paddingHorizontal: padding } : {}}>
          {hasSidebar ? (
            <View style={styles.twoColumnLayout}>
              {sidebarPosition === 'left' && (
                <View style={styles.sidebarColumn}>
                  {renderSidebarContent()}
                </View>
              )}
              <View style={styles.mainColumn}>
                {renderMainSections()}
                {renderCustomSections()}
              </View>
              {sidebarPosition === 'right' && (
                <View style={styles.sidebarColumn}>
                  {renderSidebarContent()}
                </View>
              )}
            </View>
          ) : (
            <View>
              {renderMainSections()}
              {renderCustomSections()}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
