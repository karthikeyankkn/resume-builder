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

// Colors
const colors = {
  primary: '#2563eb',
  text: '#1e293b',
  secondary: '#64748b',
  border: '#e2e8f0',
  background: '#ffffff'
};

// Styles - using Helvetica as fallback (built-in PDF font)
// Compact layout to fit content on single page
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 35,
    backgroundColor: colors.background,
    color: colors.text
  },
  header: {
    textAlign: 'center',
    marginBottom: 12,
    alignItems: 'center'
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    objectFit: 'cover'
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 2
  },
  title: {
    fontSize: 11,
    color: colors.primary,
    marginBottom: 6
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    fontSize: 8,
    color: colors.secondary
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  contactLink: {
    color: colors.secondary,
    textDecoration: 'none'
  },
  section: {
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 10,
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
    fontSize: 9,
    lineHeight: 1.4,
    color: colors.secondary
  },
  experienceItem: {
    marginBottom: 8
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
    fontSize: 10,
    fontWeight: 600,
    color: colors.text
  },
  companyName: {
    fontSize: 9,
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
    fontSize: 10,
    fontWeight: 600,
    color: colors.text
  },
  institution: {
    fontSize: 9,
    color: colors.primary
  },
  skillCategory: {
    flexDirection: 'row',
    marginBottom: 2
  },
  skillName: {
    fontWeight: 600,
    fontSize: 8,
    color: colors.text,
    width: 100
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
    fontSize: 9,
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
    fontSize: 9,
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
  }
});

// Helper to format date
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + '-01');
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Resume PDF Component
export default function ResumePDF({ resume }) {
  // Defensive checks for missing data
  if (!resume) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>No resume data available</Text>
        </Page>
      </Document>
    );
  }

  const personalInfo = resume.personalInfo || {};
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = resume.skills || { categories: [] };
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];

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

        {/* Summary */}
        {personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            {splitTextByNewlines(personalInfo.summary).map((line, i) => (
              <Text key={i} style={styles.summary}>{line || ' '}</Text>
            ))}
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
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
        )}

        {/* Education */}
        {education.length > 0 && (
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
        )}

        {/* Skills */}
        {skills.categories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.categories.map((category) => (
              <View key={category.id} style={styles.skillCategory}>
                <Text style={styles.skillName}>{category.name}:</Text>
                <Text style={styles.skillItems}>{category.items.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
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
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
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
        )}
      </Page>
    </Document>
  );
}
