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

// Register fonts with error handling
try {
  Font.register({
    family: 'Inter',
    fonts: [
      {
        src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2',
        fontWeight: 400
      },
      {
        src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.woff2',
        fontWeight: 500
      },
      {
        src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff2',
        fontWeight: 600
      },
      {
        src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff2',
        fontWeight: 700
      }
    ]
  });
} catch (e) {
  console.warn('Failed to register Inter font, using fallback:', e);
}

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

  // Font sizes from template
  const fontSizes = {
    name: parseFontSize(templateFonts.sizes?.name, 20),
    title: parseFontSize(templateFonts.sizes?.title, 11),
    sectionTitle: parseFontSize(templateFonts.sizes?.sectionTitle, 10),
    body: parseFontSize(templateFonts.sizes?.body, 9)
  };

  // Spacing from template
  const padding = parsePadding(templateSpacing.padding, 35);
  const sectionGap = parsePadding(templateSpacing.sectionGap, 10);
  const itemGap = parsePadding(templateSpacing.itemGap, 8);

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

  // Create styles based on template
  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      fontSize: fontSizes.body,
      paddingTop: 30,
      paddingBottom: 30,
      paddingHorizontal: padding,
      backgroundColor: colors.background,
      color: colors.text
    },
    header: {
      textAlign: headerStyle === 'centered' ? 'center' : 'left',
      alignItems: headerStyle === 'centered' ? 'center' : 'flex-start',
      marginBottom: 12
    },
    profileImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginBottom: 8,
      objectFit: 'cover'
    },
    name: {
      fontSize: fontSizes.name,
      fontWeight: 700,
      color: colors.text,
      marginBottom: 2
    },
    title: {
      fontSize: fontSizes.title,
      color: colors.primary,
      marginBottom: 6
    },
    contactRow: {
      flexDirection: 'row',
      justifyContent: headerStyle === 'centered' ? 'center' : 'flex-start',
      flexWrap: 'wrap',
      gap: 10,
      fontSize: 8,
      color: colors.secondary
    },
    contactLink: {
      color: colors.secondary,
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
      letterSpacing: 0.5,
      marginBottom: 5,
      paddingBottom: 2,
      borderBottomWidth: 1,
      borderBottomColor: colors.primary
    },
    summary: {
      fontSize: fontSizes.body,
      lineHeight: 1.4,
      color: colors.secondary
    },
    experienceItem: {
      marginBottom: itemGap
    },
    experienceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 1
    },
    experienceLeft: {
      flex: 1
    },
    experienceRight: {
      textAlign: 'right',
      fontSize: 8,
      color: colors.secondary
    },
    positionTitle: {
      fontSize: fontSizes.sectionTitle,
      fontWeight: 600,
      color: colors.text
    },
    companyName: {
      fontSize: fontSizes.body,
      color: colors.primary
    },
    description: {
      fontSize: 8,
      color: colors.secondary,
      marginTop: 1,
      marginBottom: 2
    },
    bulletList: {
      marginLeft: 10
    },
    bulletItem: {
      flexDirection: 'row',
      marginBottom: 1
    },
    bullet: {
      width: 8,
      fontSize: 8
    },
    bulletText: {
      flex: 1,
      fontSize: 8,
      lineHeight: 1.3
    },
    educationItem: {
      marginBottom: 6
    },
    educationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    degree: {
      fontSize: fontSizes.sectionTitle,
      fontWeight: 600,
      color: colors.text
    },
    institution: {
      fontSize: fontSizes.body,
      color: colors.primary
    },
    skillCategory: {
      flexDirection: 'row',
      marginBottom: 2,
      flexWrap: 'wrap'
    },
    skillName: {
      fontWeight: 600,
      fontSize: 8,
      color: colors.text,
      width: hasSidebar ? 'auto' : 100,
      marginRight: hasSidebar ? 4 : 0
    },
    skillItems: {
      flex: 1,
      fontSize: 8,
      color: colors.secondary
    },
    projectItem: {
      marginBottom: 6
    },
    projectHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 1
    },
    projectName: {
      fontSize: fontSizes.body,
      fontWeight: 600,
      color: colors.text
    },
    projectLink: {
      fontSize: 8,
      color: colors.primary,
      marginLeft: 4,
      textDecoration: 'none'
    },
    projectTech: {
      fontSize: 8,
      color: colors.primary,
      marginBottom: 1
    },
    certificationItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 3
    },
    certName: {
      fontSize: fontSizes.body,
      fontWeight: 500,
      color: colors.text
    },
    certIssuer: {
      fontSize: 8,
      color: colors.secondary
    },
    certDate: {
      fontSize: 8,
      color: colors.secondary
    },
    twoColumnLayout: {
      flexDirection: 'row',
      gap: 16
    },
    mainColumn: {
      flex: 1
    },
    sidebarColumn: {
      width: '30%',
      backgroundColor: colors.sidebarBg,
      padding: 10,
      borderRadius: 4
    },
    // Modern 2026 full-height sidebar styles
    fullHeightSidebar: {
      width: '35%',
      backgroundColor: sidebarBg || '#001F3F',
      padding: 20,
      minHeight: '100%'
    },
    sidebarText: {
      color: sidebarText,
      fontSize: 8
    },
    sidebarSectionTitle: {
      fontSize: fontSizes.sectionTitle,
      fontWeight: 600,
      color: sidebarText,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
      marginTop: 14,
      paddingBottom: 4,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.3)'
    },
    sidebarContactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6
    },
    sidebarContactIcon: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'rgba(255,255,255,0.15)',
      marginRight: 8,
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

    const mainSectionKeys = hasSidebar
      ? Object.keys(sections).filter(key => !sidebarSections.includes(key))
      : Object.keys(sections);

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
        {hasSidebar ? (
          <View style={styles.twoColumnLayout}>
            {sidebarPosition === 'left' && (
              <View style={styles.sidebarColumn}>
                {renderSidebarContent()}
              </View>
            )}
            <View style={styles.mainColumn}>
              {renderMainSections()}
            </View>
            {sidebarPosition === 'right' && (
              <View style={styles.sidebarColumn}>
                {renderSidebarContent()}
              </View>
            )}
          </View>
        ) : (
          <View>{renderMainSections()}</View>
        )}
      </Page>
    </Document>
  );
}
