/**
 * ATS Keyword Analyzer
 * Extracts keywords from text and calculates match scores
 * 100% client-side - no external APIs
 */

// Common words to ignore during keyword extraction
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'it', 'its',
  'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they',
  'what', 'which', 'who', 'whom', 'where', 'when', 'why', 'how', 'all',
  'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  'just', 'also', 'now', 'our', 'your', 'their', 'his', 'her', 'any',
  'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
  'why', 'how', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
  'such', 'nor', 'only', 'own', 'same', 'than', 'too', 'very', 'can',
  'will', 'just', 'should', 'now', 'while', 'being', 'having', 'doing',
  'able', 'across', 'after', 'almost', 'along', 'already', 'also', 'among',
  'around', 'become', 'becomes', 'becoming', 'been', 'being', 'come',
  'could', 'did', 'does', 'doing', 'done', 'etc', 'even', 'ever', 'every',
  'get', 'gets', 'getting', 'got', 'goes', 'going', 'gone', 'good', 'great',
  'had', 'has', 'have', 'having', 'hence', 'her', 'here', 'hers', 'herself',
  'him', 'himself', 'his', 'however', 'including', 'into', 'itself', 'its',
  'keep', 'keeps', 'kept', 'know', 'known', 'knows', 'last', 'least', 'less',
  'let', 'lets', 'like', 'likely', 'made', 'make', 'makes', 'making', 'many',
  'may', 'maybe', 'might', 'mine', 'more', 'moreover', 'much', 'must',
  'myself', 'need', 'needed', 'needs', 'neither', 'never', 'new', 'next',
  'none', 'nothing', 'now', 'often', 'once', 'one', 'ones', 'onto', 'others',
  'our', 'ours', 'ourselves', 'out', 'over', 'own', 'part', 'per', 'perhaps',
  'please', 'put', 'puts', 'rather', 'really', 'said', 'same', 'see', 'seem',
  'seemed', 'seems', 'sees', 'several', 'shall', 'she', 'should', 'show',
  'showed', 'shown', 'shows', 'since', 'some', 'something', 'still', 'such',
  'take', 'taken', 'takes', 'taking', 'tell', 'tells', 'than', 'that', 'the',
  'their', 'theirs', 'them', 'themselves', 'then', 'thence', 'there', 'therefore',
  'these', 'they', 'thing', 'things', 'think', 'thinks', 'this', 'those',
  'though', 'through', 'thus', 'till', 'together', 'told', 'toward', 'towards',
  'under', 'until', 'unto', 'upon', 'use', 'used', 'uses', 'using', 'usually',
  'want', 'wanted', 'wants', 'was', 'way', 'ways', 'well', 'went', 'were',
  'what', 'whatever', 'when', 'whenever', 'where', 'whereas', 'wherever',
  'whether', 'which', 'while', 'who', 'whoever', 'whole', 'whom', 'whose',
  'why', 'will', 'with', 'within', 'without', 'work', 'worked', 'working',
  'works', 'would', 'yet', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);

// Technical skills dictionary organized by category
export const TECHNICAL_SKILLS = {
  programming: [
    'javascript', 'python', 'java', 'typescript', 'c++', 'c#', 'ruby', 'go',
    'rust', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl',
    'objective-c', 'dart', 'lua', 'haskell', 'clojure', 'elixir', 'erlang',
    'fortran', 'cobol', 'assembly', 'bash', 'powershell', 'groovy'
  ],
  frontend: [
    'react', 'reactjs', 'react.js', 'angular', 'angularjs', 'vue', 'vuejs',
    'vue.js', 'svelte', 'nextjs', 'next.js', 'nuxt', 'nuxtjs', 'gatsby',
    'html', 'html5', 'css', 'css3', 'sass', 'scss', 'less', 'tailwind',
    'tailwindcss', 'bootstrap', 'material-ui', 'mui', 'chakra', 'antd',
    'styled-components', 'emotion', 'webpack', 'vite', 'rollup', 'parcel',
    'babel', 'eslint', 'prettier', 'storybook', 'jest', 'cypress', 'playwright',
    'redux', 'mobx', 'zustand', 'recoil', 'context api', 'jquery'
  ],
  backend: [
    'node.js', 'nodejs', 'express', 'expressjs', 'fastify', 'koa', 'nestjs',
    'django', 'flask', 'fastapi', 'spring', 'spring boot', 'springboot',
    'rails', 'ruby on rails', 'laravel', 'symfony', 'asp.net', '.net',
    'dotnet', '.net core', 'gin', 'echo', 'fiber', 'actix', 'rocket',
    'graphql', 'rest', 'rest api', 'restful', 'api', 'microservices',
    'grpc', 'websocket', 'socket.io', 'rabbitmq', 'kafka', 'celery'
  ],
  database: [
    'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'sqlite',
    'oracle', 'sql server', 'mssql', 'mariadb', 'cassandra', 'dynamodb',
    'couchdb', 'couchbase', 'neo4j', 'elasticsearch', 'opensearch', 'solr',
    'firebase', 'firestore', 'supabase', 'prisma', 'sequelize', 'typeorm',
    'mongoose', 'knex', 'drizzle', 'database', 'nosql', 'rdbms'
  ],
  cloud: [
    'aws', 'amazon web services', 'azure', 'microsoft azure', 'gcp',
    'google cloud', 'google cloud platform', 'docker', 'kubernetes', 'k8s',
    'terraform', 'ansible', 'puppet', 'chef', 'jenkins', 'gitlab ci',
    'github actions', 'circleci', 'travis ci', 'ci/cd', 'cicd', 'devops',
    'devsecops', 'cloud', 'cloudformation', 'cdk', 'pulumi', 'vagrant',
    'helm', 'istio', 'envoy', 'nginx', 'apache', 'load balancer',
    'auto scaling', 'serverless', 'lambda', 'ec2', 's3', 'rds', 'eks',
    'ecs', 'fargate', 'cloudwatch', 'datadog', 'prometheus', 'grafana',
    'splunk', 'elk', 'logstash', 'kibana', 'newrelic', 'sentry'
  ],
  data: [
    'machine learning', 'ml', 'deep learning', 'dl', 'artificial intelligence',
    'ai', 'data science', 'data analysis', 'data analytics', 'big data',
    'pandas', 'numpy', 'scipy', 'scikit-learn', 'sklearn', 'tensorflow',
    'pytorch', 'keras', 'opencv', 'nlp', 'natural language processing',
    'computer vision', 'neural network', 'neural networks', 'cnn', 'rnn',
    'lstm', 'transformer', 'bert', 'gpt', 'llm', 'large language model',
    'tableau', 'power bi', 'powerbi', 'looker', 'metabase', 'superset',
    'spark', 'hadoop', 'hive', 'airflow', 'dbt', 'etl', 'data warehouse',
    'snowflake', 'redshift', 'bigquery', 'databricks', 'jupyter', 'notebook'
  ],
  tools: [
    'git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial',
    'jira', 'confluence', 'trello', 'asana', 'monday', 'notion', 'linear',
    'figma', 'sketch', 'adobe xd', 'invision', 'zeplin', 'photoshop',
    'illustrator', 'postman', 'insomnia', 'swagger', 'openapi',
    'vs code', 'vscode', 'visual studio', 'intellij', 'webstorm', 'pycharm',
    'eclipse', 'netbeans', 'sublime', 'atom', 'vim', 'neovim', 'emacs',
    'slack', 'teams', 'microsoft teams', 'zoom', 'discord'
  ],
  security: [
    'security', 'cybersecurity', 'infosec', 'penetration testing', 'pentest',
    'vulnerability', 'owasp', 'authentication', 'authorization', 'oauth',
    'oauth2', 'jwt', 'saml', 'sso', 'single sign-on', 'mfa', '2fa',
    'encryption', 'ssl', 'tls', 'https', 'firewall', 'vpn', 'iam',
    'identity management', 'access control', 'rbac', 'compliance',
    'gdpr', 'hipaa', 'soc2', 'pci-dss', 'iso 27001'
  ],
  methodologies: [
    'agile', 'scrum', 'kanban', 'waterfall', 'lean', 'six sigma',
    'tdd', 'test-driven development', 'bdd', 'behavior-driven development',
    'ddd', 'domain-driven design', 'pair programming', 'mob programming',
    'code review', 'continuous integration', 'continuous deployment',
    'continuous delivery', 'sprint', 'standup', 'retrospective', 'backlog',
    'user story', 'epic', 'mvp', 'poc', 'prototype'
  ],
  soft_skills: [
    'leadership', 'communication', 'teamwork', 'collaboration', 'problem-solving',
    'problem solving', 'analytical', 'critical thinking', 'creativity',
    'innovation', 'adaptability', 'flexibility', 'time management',
    'project management', 'stakeholder management', 'mentoring', 'coaching',
    'presentation', 'negotiation', 'conflict resolution', 'decision making',
    'strategic thinking', 'attention to detail', 'self-motivated',
    'cross-functional', 'customer-focused', 'results-oriented'
  ]
};

/**
 * Extract keywords from text
 * @param {string} text - Input text to analyze
 * @returns {Object} - Object with technical, general, and phrases sets
 */
export function extractKeywords(text) {
  if (!text || typeof text !== 'string') {
    return { technical: new Set(), general: new Set(), phrases: new Set() };
  }

  const normalized = text.toLowerCase().replace(/[^\w\s\-\+\#\.]/g, ' ');

  const keywords = {
    technical: new Set(),
    general: new Set(),
    phrases: new Set()
  };

  // Extract technical skills (check all categories)
  Object.values(TECHNICAL_SKILLS).flat().forEach(skill => {
    const skillLower = skill.toLowerCase();
    // Use word boundary matching for accuracy
    const regex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(normalized)) {
      keywords.technical.add(skill);
    }
  });

  // Extract general keywords (words 4+ chars, not stop words)
  const words = normalized.split(/\s+/);
  words.forEach(word => {
    const cleaned = word.replace(/^[^a-z]+|[^a-z]+$/g, '');
    if (cleaned.length >= 4 && !STOP_WORDS.has(cleaned)) {
      // Skip if it's already a technical skill
      const isTechnical = keywords.technical.has(cleaned);
      if (!isTechnical) {
        keywords.general.add(cleaned);
      }
    }
  });

  // Extract 2-3 word phrases
  const phraseRegex = /\b([a-z][\w\-]*(?:\s+[a-z][\w\-]*){1,2})\b/g;
  let match;
  while ((match = phraseRegex.exec(normalized)) !== null) {
    const phrase = match[1].trim();
    const phraseWords = phrase.split(/\s+/);

    // Only include if most words are meaningful
    const meaningfulWords = phraseWords.filter(w => !STOP_WORDS.has(w) && w.length >= 3);
    if (meaningfulWords.length >= 2) {
      // Skip if it's a technical skill
      const isTechnical = [...keywords.technical].some(t =>
        t.toLowerCase() === phrase || phrase.includes(t.toLowerCase())
      );
      if (!isTechnical) {
        keywords.phrases.add(phrase);
      }
    }
  }

  return keywords;
}

/**
 * Calculate ATS match score between job description and resume
 * @param {Object} jobKeywords - Keywords extracted from job description
 * @param {Object} resumeKeywords - Keywords extracted from resume
 * @returns {Object} - Score results with matched/missing keywords and suggestions
 */
export function calculateATSScore(jobKeywords, resumeKeywords) {
  const results = {
    score: 0,
    matched: {
      technical: [],
      general: [],
      phrases: []
    },
    missing: {
      technical: [],
      general: [],
      phrases: []
    },
    suggestions: []
  };

  // Weight factors (technical skills matter most)
  const WEIGHTS = {
    technical: 3,
    phrases: 2,
    general: 1
  };

  let totalWeight = 0;
  let matchedWeight = 0;

  // Helper to check if keyword exists in resume (case-insensitive)
  const resumeHas = (keyword, type) => {
    const keywordLower = keyword.toLowerCase();
    if (type === 'technical') {
      return [...resumeKeywords.technical].some(k => k.toLowerCase() === keywordLower) ||
             [...resumeKeywords.general].some(k => k.toLowerCase() === keywordLower);
    }
    if (type === 'phrases') {
      return [...resumeKeywords.phrases].some(p => p.toLowerCase().includes(keywordLower) || keywordLower.includes(p.toLowerCase()));
    }
    return [...resumeKeywords.general].some(k => k.toLowerCase() === keywordLower);
  };

  // Compare technical skills
  jobKeywords.technical.forEach(skill => {
    totalWeight += WEIGHTS.technical;
    if (resumeHas(skill, 'technical')) {
      results.matched.technical.push(skill);
      matchedWeight += WEIGHTS.technical;
    } else {
      results.missing.technical.push(skill);
    }
  });

  // Compare phrases (limit to top 15 by length - longer phrases are more specific)
  const topPhrases = [...jobKeywords.phrases]
    .sort((a, b) => b.length - a.length)
    .slice(0, 15);

  topPhrases.forEach(phrase => {
    totalWeight += WEIGHTS.phrases;
    if (resumeHas(phrase, 'phrases')) {
      results.matched.phrases.push(phrase);
      matchedWeight += WEIGHTS.phrases;
    } else {
      results.missing.phrases.push(phrase);
    }
  });

  // Compare general keywords (limit to top 20)
  const topGeneralKeywords = [...jobKeywords.general].slice(0, 20);
  topGeneralKeywords.forEach(keyword => {
    totalWeight += WEIGHTS.general;
    if (resumeHas(keyword, 'general')) {
      results.matched.general.push(keyword);
      matchedWeight += WEIGHTS.general;
    } else {
      results.missing.general.push(keyword);
    }
  });

  // Calculate percentage score
  results.score = totalWeight > 0
    ? Math.round((matchedWeight / totalWeight) * 100)
    : 0;

  // Generate suggestions
  results.suggestions = generateSuggestions(results.missing, results.score);

  return results;
}

/**
 * Generate actionable suggestions based on missing keywords
 */
function generateSuggestions(missing, score) {
  const suggestions = [];

  // Critical: Missing technical skills
  if (missing.technical.length > 0) {
    const topMissing = missing.technical.slice(0, 5);
    suggestions.push({
      type: 'critical',
      icon: '⚠️',
      title: 'Missing Technical Skills',
      message: `Add these skills if you have experience: ${topMissing.join(', ')}`,
      keywords: topMissing
    });
  }

  // Important: Missing key phrases
  if (missing.phrases.length > 0) {
    const topPhrases = missing.phrases.slice(0, 3);
    suggestions.push({
      type: 'important',
      icon: '💡',
      title: 'Consider These Phrases',
      message: `Include these terms in your descriptions: ${topPhrases.join(', ')}`,
      keywords: topPhrases
    });
  }

  // Optional: General keywords
  if (missing.general.length > 5) {
    const topGeneral = missing.general.slice(0, 5);
    suggestions.push({
      type: 'optional',
      icon: 'ℹ️',
      title: 'Additional Keywords',
      message: `These words appear in the job posting: ${topGeneral.join(', ')}`,
      keywords: topGeneral
    });
  }

  // Score-based advice
  if (score < 40) {
    suggestions.push({
      type: 'warning',
      icon: '🎯',
      title: 'Low Match Score',
      message: 'Your resume may not pass ATS filters. Focus on adding the missing technical skills.',
      keywords: []
    });
  } else if (score >= 70) {
    suggestions.push({
      type: 'success',
      icon: '✅',
      title: 'Good Match',
      message: 'Your resume aligns well with this job. Fine-tune by adding any missing keywords.',
      keywords: []
    });
  }

  return suggestions;
}

/**
 * Extract all text content from resume object
 * @param {Object} resume - Resume data from store
 * @returns {string} - Combined text content
 */
export function extractResumeText(resume) {
  if (!resume) return '';

  const parts = [];

  // Personal info
  if (resume.personalInfo) {
    const pi = resume.personalInfo;
    if (pi.title) parts.push(pi.title);
    if (pi.summary) parts.push(pi.summary);
  }

  // Experience
  (resume.experience || []).forEach(exp => {
    if (exp.position) parts.push(exp.position);
    if (exp.company) parts.push(exp.company);
    if (exp.description) parts.push(exp.description);
    if (exp.highlights?.length) {
      parts.push(exp.highlights.filter(h => h).join(' '));
    }
  });

  // Education
  (resume.education || []).forEach(edu => {
    if (edu.degree) parts.push(edu.degree);
    if (edu.field) parts.push(edu.field);
    if (edu.institution) parts.push(edu.institution);
    if (edu.highlights?.length) {
      parts.push(edu.highlights.filter(h => h).join(' '));
    }
  });

  // Skills
  (resume.skills?.categories || []).forEach(cat => {
    if (cat.name) parts.push(cat.name);
    if (cat.items?.length) {
      parts.push(cat.items.join(' '));
    }
  });

  // Projects
  (resume.projects || []).forEach(proj => {
    if (proj.name) parts.push(proj.name);
    if (proj.description) parts.push(proj.description);
    if (proj.technologies?.length) {
      parts.push(proj.technologies.join(' '));
    }
    if (proj.highlights?.length) {
      parts.push(proj.highlights.filter(h => h).join(' '));
    }
  });

  // Certifications
  (resume.certifications || []).forEach(cert => {
    if (cert.name) parts.push(cert.name);
    if (cert.issuer) parts.push(cert.issuer);
  });

  // Custom sections
  (resume.customSections || []).forEach(section => {
    if (section.title) parts.push(section.title);
    if (section.content?.length) {
      section.content.forEach(item => {
        if (item.text) parts.push(item.text);
      });
    }
  });

  return parts.join(' ');
}

/**
 * Get score color based on percentage
 */
export function getScoreColor(score) {
  if (score >= 70) return '#22c55e'; // green
  if (score >= 50) return '#eab308'; // yellow
  if (score >= 30) return '#f97316'; // orange
  return '#ef4444'; // red
}

/**
 * Get score label based on percentage
 */
export function getScoreLabel(score) {
  if (score >= 80) return 'Excellent Match';
  if (score >= 70) return 'Good Match';
  if (score >= 50) return 'Fair Match';
  if (score >= 30) return 'Needs Improvement';
  return 'Low Match';
}
