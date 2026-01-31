import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { debouncedStorage } from '../utils/debouncedStorage';

const defaultResume = {
  id: uuidv4(),
  metadata: {
    templateId: 'modern',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: '1.0'
  },
  personalInfo: {
    fullName: 'John Anderson',
    title: 'Senior Software Engineer',
    email: 'john.anderson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedIn: 'linkedin.com/in/johnanderson',
    github: 'github.com/johnanderson',
    portfolio: 'johnanderson.dev',
    photo: null,
    summary: 'Passionate software engineer with 8+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies. Led teams to deliver high-impact products serving millions of users.'
  },
  experience: [
    {
      id: uuidv4(),
      company: 'Tech Innovation Inc.',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: 'Leading development of microservices architecture serving 10M+ users.',
      highlights: [
        'Architected and implemented a new real-time notification system reducing latency by 60%',
        'Mentored 5 junior developers and established code review best practices',
        'Led migration from monolith to microservices, improving deployment frequency by 300%'
      ]
    },
    {
      id: uuidv4(),
      company: 'Digital Solutions Corp',
      position: 'Software Engineer',
      location: 'Seattle, WA',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      description: 'Full-stack development for enterprise SaaS platform.',
      highlights: [
        'Developed RESTful APIs handling 1M+ daily requests with 99.9% uptime',
        'Implemented CI/CD pipelines reducing deployment time from hours to minutes',
        'Built responsive React dashboard used by 500+ enterprise clients'
      ]
    }
  ],
  education: [
    {
      id: uuidv4(),
      institution: 'Stanford University',
      degree: 'Master of Science',
      field: 'Computer Science',
      startDate: '2016-09',
      endDate: '2018-06',
      gpa: '3.9',
      highlights: ['Focus on Distributed Systems and Machine Learning']
    },
    {
      id: uuidv4(),
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2012-09',
      endDate: '2016-05',
      gpa: '3.7',
      highlights: ['Summa Cum Laude', 'Dean\'s List all semesters']
    }
  ],
  skills: {
    categories: [
      {
        id: uuidv4(),
        name: 'Programming Languages',
        items: ['JavaScript', 'TypeScript', 'Python', 'Go', 'SQL']
      },
      {
        id: uuidv4(),
        name: 'Frameworks & Libraries',
        items: ['React', 'Node.js', 'Express', 'Next.js', 'GraphQL']
      },
      {
        id: uuidv4(),
        name: 'Tools & Platforms',
        items: ['AWS', 'Docker', 'Kubernetes', 'Git', 'PostgreSQL', 'Redis']
      }
    ]
  },
  projects: [
    {
      id: uuidv4(),
      name: 'Open Source Analytics Platform',
      description: 'Built a real-time analytics dashboard processing 100K+ events/second',
      technologies: ['React', 'Node.js', 'ClickHouse', 'WebSocket'],
      link: 'github.com/johnanderson/analytics',
      highlights: ['1.2K+ GitHub stars', 'Featured in JavaScript Weekly']
    }
  ],
  certifications: [
    {
      id: uuidv4(),
      name: 'AWS Solutions Architect Professional',
      issuer: 'Amazon Web Services',
      date: '2023-05',
      credentialId: 'AWS-SAP-123456',
      link: ''
    },
    {
      id: uuidv4(),
      name: 'Google Cloud Professional Developer',
      issuer: 'Google Cloud',
      date: '2022-11',
      credentialId: 'GCP-PD-789012',
      link: ''
    }
  ],
  customSections: []
};

export const useResumeStore = create(
  persist(
    (set, get) => ({
      resume: defaultResume,
      savedResumes: [],
      isDirty: false,
      lastSavedAt: null,

      // Mark as dirty (unsaved changes)
      markDirty: () => set({ isDirty: true }),

      // Clear dirty flag
      clearDirty: () => set({ isDirty: false, lastSavedAt: new Date().toISOString() }),

      // Update personal info
      updatePersonalInfo: (field, value) =>
        set((state) => ({
          isDirty: true,
          resume: {
            ...state.resume,
            personalInfo: {
              ...state.resume.personalInfo,
              [field]: value
            },
            metadata: {
              ...state.resume.metadata,
              updatedAt: new Date().toISOString()
            }
          }
        })),

      // Experience CRUD
      addExperience: () =>
        set((state) => ({
          isDirty: true,
          resume: {
            ...state.resume,
            experience: [
              ...state.resume.experience,
              {
                id: uuidv4(),
                company: '',
                position: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
                highlights: ['']
              }
            ]
          }
        })),

      updateExperience: (id, field, value) =>
        set((state) => ({
          isDirty: true,
          resume: {
            ...state.resume,
            experience: state.resume.experience.map((exp) =>
              exp.id === id ? { ...exp, [field]: value } : exp
            )
          }
        })),

      removeExperience: (id) =>
        set((state) => ({
          isDirty: true,
          resume: {
            ...state.resume,
            experience: state.resume.experience.filter((exp) => exp.id !== id)
          }
        })),

      reorderExperience: (fromIndex, toIndex) =>
        set((state) => {
          const experience = [...state.resume.experience];
          const [removed] = experience.splice(fromIndex, 1);
          experience.splice(toIndex, 0, removed);
          return { isDirty: true, resume: { ...state.resume, experience } };
        }),

      // Education CRUD
      addEducation: () =>
        set((state) => ({
          isDirty: true,
          resume: {
            ...state.resume,
            education: [
              ...state.resume.education,
              {
                id: uuidv4(),
                institution: '',
                degree: '',
                field: '',
                startDate: '',
                endDate: '',
                gpa: '',
                highlights: []
              }
            ]
          }
        })),

      updateEducation: (id, field, value) =>
        set((state) => ({
          isDirty: true,
          resume: {
            ...state.resume,
            education: state.resume.education.map((edu) =>
              edu.id === id ? { ...edu, [field]: value } : edu
            )
          }
        })),

      removeEducation: (id) =>
        set((state) => ({
          isDirty: true,
          resume: {
            ...state.resume,
            education: state.resume.education.filter((edu) => edu.id !== id)
          }
        })),

      reorderEducation: (fromIndex, toIndex) =>
        set((state) => {
          const education = [...state.resume.education];
          const [removed] = education.splice(fromIndex, 1);
          education.splice(toIndex, 0, removed);
          return { isDirty: true, resume: { ...state.resume, education } };
        }),

      // Skills CRUD
      addSkillCategory: () =>
        set((state) => ({
          isDirty: true,
          resume: {
            ...state.resume,
            skills: {
              categories: [
                ...state.resume.skills.categories,
                { id: uuidv4(), name: 'New Category', items: [] }
              ]
            }
          }
        })),

      updateSkillCategory: (id, field, value) =>
        set((state) => ({
          isDirty: true,
          resume: {
            ...state.resume,
            skills: {
              categories: state.resume.skills.categories.map((cat) =>
                cat.id === id ? { ...cat, [field]: value } : cat
              )
            }
          }
        })),

      removeSkillCategory: (id) =>
        set((state) => ({
          isDirty: true,
          resume: {
            ...state.resume,
            skills: {
              categories: state.resume.skills.categories.filter((cat) => cat.id !== id)
            }
          }
        })),

      // Projects CRUD
      addProject: () =>
        set((state) => ({
          isDirty: true,
          resume: {
            ...state.resume,
            projects: [
              ...state.resume.projects,
              {
                id: uuidv4(),
                name: '',
                description: '',
                technologies: [],
                link: '',
                highlights: []
              }
            ]
          }
        })),

      updateProject: (id, field, value) =>
        set((state) => ({
          isDirty: true,
          resume: {
            ...state.resume,
            projects: state.resume.projects.map((proj) =>
              proj.id === id ? { ...proj, [field]: value } : proj
            )
          }
        })),

      removeProject: (id) =>
        set((state) => ({
          isDirty: true,
          resume: {
            ...state.resume,
            projects: state.resume.projects.filter((proj) => proj.id !== id)
          }
        })),

      reorderProjects: (fromIndex, toIndex) =>
        set((state) => {
          const projects = [...state.resume.projects];
          const [removed] = projects.splice(fromIndex, 1);
          projects.splice(toIndex, 0, removed);
          return { isDirty: true, resume: { ...state.resume, projects } };
        }),

      // Certifications CRUD
      addCertification: () =>
        set((state) => ({
          isDirty: true,
          resume: {
            ...state.resume,
            certifications: [
              ...state.resume.certifications,
              {
                id: uuidv4(),
                name: '',
                issuer: '',
                date: '',
                credentialId: '',
                link: ''
              }
            ]
          }
        })),

      updateCertification: (id, field, value) =>
        set((state) => ({
          isDirty: true,
          resume: {
            ...state.resume,
            certifications: state.resume.certifications.map((cert) =>
              cert.id === id ? { ...cert, [field]: value } : cert
            )
          }
        })),

      removeCertification: (id) =>
        set((state) => ({
          isDirty: true,
          resume: {
            ...state.resume,
            certifications: state.resume.certifications.filter((cert) => cert.id !== id)
          }
        })),

      reorderCertifications: (fromIndex, toIndex) =>
        set((state) => {
          const certifications = [...state.resume.certifications];
          const [removed] = certifications.splice(fromIndex, 1);
          certifications.splice(toIndex, 0, removed);
          return { isDirty: true, resume: { ...state.resume, certifications } };
        }),

      // Custom Sections
      addCustomSection: () =>
        set((state) => ({
          isDirty: true,
          resume: {
            ...state.resume,
            customSections: [
              ...state.resume.customSections,
              {
                id: uuidv4(),
                title: 'Custom Section',
                type: 'list',
                content: []
              }
            ]
          }
        })),

      updateCustomSection: (id, field, value) =>
        set((state) => ({
          isDirty: true,
          resume: {
            ...state.resume,
            customSections: state.resume.customSections.map((sec) =>
              sec.id === id ? { ...sec, [field]: value } : sec
            )
          }
        })),

      removeCustomSection: (id) =>
        set((state) => ({
          isDirty: true,
          resume: {
            ...state.resume,
            customSections: state.resume.customSections.filter((sec) => sec.id !== id)
          }
        })),

      // Save/Load Resume
      saveCurrentResume: () => {
        const state = get();
        const resume = { ...state.resume, id: uuidv4() };
        set({
          savedResumes: [...state.savedResumes, resume],
          isDirty: false,
          lastSavedAt: new Date().toISOString()
        });
      },

      loadResume: (id) => {
        const state = get();
        const resume = state.savedResumes.find((r) => r.id === id);
        if (resume) {
          set({ resume });
        }
      },

      deleteResume: (id) =>
        set((state) => ({
          savedResumes: state.savedResumes.filter((r) => r.id !== id)
        })),

      // Reset to default
      resetResume: () => set({ resume: { ...defaultResume, id: uuidv4() }, isDirty: false, lastSavedAt: new Date().toISOString() }),

      // Import/Export
      exportResume: () => {
        const state = get();
        return JSON.stringify(state.resume, null, 2);
      },

      importResume: (jsonString) => {
        try {
          const resume = JSON.parse(jsonString);
          set({ resume: { ...resume, id: uuidv4() }, isDirty: false, lastSavedAt: new Date().toISOString() });
          return true;
        } catch (e) {
          console.error('Failed to import resume:', e);
          return false;
        }
      },

      // Set template
      setTemplate: (templateId) =>
        set((state) => ({
          resume: {
            ...state.resume,
            metadata: {
              ...state.resume.metadata,
              templateId
            }
          }
        }))
    }),
    {
      name: 'resume-storage',
      version: 1,
      storage: debouncedStorage,
      partialize: (state) => ({
        resume: state.resume,
        savedResumes: state.savedResumes
      })
    }
  )
);
