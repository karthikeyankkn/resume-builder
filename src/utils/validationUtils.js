/**
 * Validation utilities for form fields
 */

/**
 * Validates an email address using RFC 5322 pattern
 * @param {string} email - Email to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { valid: true }; // Empty is valid (optional field)
  }

  // RFC 5322 compliant email regex
  const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailPattern.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  return { valid: true };
}

/**
 * Validates a URL (website, LinkedIn, GitHub)
 * @param {string} url - URL to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateUrl(url) {
  if (!url || !url.trim()) {
    return { valid: true }; // Empty is valid (optional field)
  }

  // Allow URLs with or without protocol
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

  if (!urlPattern.test(url)) {
    return { valid: false, error: 'Please enter a valid URL' };
  }

  return { valid: true };
}

/**
 * Validates a phone number (international format)
 * @param {string} phone - Phone number to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return { valid: true }; // Empty is valid (optional field)
  }

  // International phone pattern - allows various formats
  // Matches: +1 (555) 123-4567, +44 20 7946 0958, 555-123-4567, etc.
  const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

  // Minimum 7 digits for a valid phone number
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 7) {
    return { valid: false, error: 'Phone number must have at least 7 digits' };
  }

  if (!phonePattern.test(phone)) {
    return { valid: false, error: 'Please enter a valid phone number' };
  }

  return { valid: true };
}

/**
 * Validates a date string in YYYY-MM format
 * @param {string} dateStr - Date string to validate
 * @returns {{ valid: boolean, error?: string, date?: Date }}
 */
export function validateDate(dateStr) {
  if (!dateStr || !dateStr.trim()) {
    return { valid: true }; // Empty is valid (optional field)
  }

  // Check format: YYYY-MM
  const datePattern = /^\d{4}-(0[1-9]|1[0-2])$/;
  if (!datePattern.test(dateStr)) {
    return { valid: false, error: 'Date must be in YYYY-MM format' };
  }

  // Parse and validate the date
  const date = new Date(dateStr + '-01');

  // Check if the date is valid (not "Invalid Date")
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date' };
  }

  // Check reasonable year range (1900 to 10 years from now)
  const year = parseInt(dateStr.substring(0, 4), 10);
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear + 10) {
    return { valid: false, error: `Year must be between 1900 and ${currentYear + 10}` };
  }

  return { valid: true, date };
}

/**
 * Validates that start date is before end date
 * @param {string} startDate - Start date in YYYY-MM format
 * @param {string} endDate - End date in YYYY-MM format
 * @param {boolean} isCurrent - Whether this is a current position/education
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateDateRange(startDate, endDate, isCurrent = false) {
  // If both are empty, that's valid
  if (!startDate && !endDate) {
    return { valid: true };
  }

  // Validate individual dates first
  if (startDate) {
    const startValidation = validateDate(startDate);
    if (!startValidation.valid) {
      return { valid: false, error: `Start date: ${startValidation.error}` };
    }
  }

  if (endDate && !isCurrent) {
    const endValidation = validateDate(endDate);
    if (!endValidation.valid) {
      return { valid: false, error: `End date: ${endValidation.error}` };
    }
  }

  // If current position, no need to check end date
  if (isCurrent) {
    return { valid: true };
  }

  // If we have both dates, compare them
  if (startDate && endDate) {
    const start = new Date(startDate + '-01');
    const end = new Date(endDate + '-01');

    if (start > end) {
      return { valid: false, error: 'Start date must be before end date' };
    }
  }

  return { valid: true };
}

/**
 * Safely formats a date string, returning empty string for invalid dates
 * @param {string} dateStr - Date string in YYYY-MM format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date or empty string
 */
export function formatDateSafe(dateStr, options = { month: 'short', year: 'numeric' }) {
  if (!dateStr) return '';

  const validation = validateDate(dateStr);
  if (!validation.valid) return '';

  try {
    const date = new Date(dateStr + '-01');
    return date.toLocaleDateString('en-US', options);
  } catch {
    return '';
  }
}

/**
 * Validates required text field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateRequired(value, fieldName = 'This field') {
  if (!value || !value.trim()) {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true };
}

/**
 * Validates the entire resume and returns all validation errors
 * @param {object} resume - The resume object to validate
 * @returns {{ valid: boolean, errors: Array<{ section: string, field: string, error: string, severity: 'error' | 'warning' }> }}
 */
export function validateResume(resume) {
  const errors = [];

  // Helper to add error
  const addError = (section, field, error, severity = 'error') => {
    errors.push({ section, field, error, severity });
  };

  // Personal Info validation
  const personalInfo = resume?.personalInfo || {};

  // Required field: Full Name
  if (!personalInfo.fullName?.trim()) {
    addError('Personal Info', 'Full Name', 'Full name is required for your resume', 'error');
  }

  // Email validation (if provided)
  if (personalInfo.email?.trim()) {
    const emailResult = validateEmail(personalInfo.email);
    if (!emailResult.valid) {
      addError('Personal Info', 'Email', emailResult.error, 'error');
    }
  } else {
    addError('Personal Info', 'Email', 'Consider adding an email for recruiters to contact you', 'warning');
  }

  // Phone validation (if provided)
  if (personalInfo.phone?.trim()) {
    const phoneResult = validatePhone(personalInfo.phone);
    if (!phoneResult.valid) {
      addError('Personal Info', 'Phone', phoneResult.error, 'error');
    }
  }

  // URL validations
  if (personalInfo.linkedin?.trim()) {
    const linkedinResult = validateUrl(personalInfo.linkedin);
    if (!linkedinResult.valid) {
      addError('Personal Info', 'LinkedIn', linkedinResult.error, 'error');
    }
  }

  if (personalInfo.github?.trim()) {
    const githubResult = validateUrl(personalInfo.github);
    if (!githubResult.valid) {
      addError('Personal Info', 'GitHub', githubResult.error, 'error');
    }
  }

  if (personalInfo.portfolio?.trim()) {
    const portfolioResult = validateUrl(personalInfo.portfolio);
    if (!portfolioResult.valid) {
      addError('Personal Info', 'Portfolio', portfolioResult.error, 'error');
    }
  }

  if (personalInfo.website?.trim()) {
    const websiteResult = validateUrl(personalInfo.website);
    if (!websiteResult.valid) {
      addError('Personal Info', 'Website', websiteResult.error, 'error');
    }
  }

  // Experience validation
  const experiences = resume?.experience || [];
  experiences.forEach((exp, index) => {
    const expLabel = exp.company ? `Experience: ${exp.company}` : `Experience #${index + 1}`;

    if (!exp.company?.trim() && !exp.position?.trim()) {
      addError(expLabel, 'Company/Position', 'Experience entry is incomplete', 'warning');
    }

    // Date validation
    if (exp.startDate && exp.endDate && !exp.current) {
      const dateResult = validateDateRange(exp.startDate, exp.endDate, exp.current);
      if (!dateResult.valid) {
        addError(expLabel, 'Dates', dateResult.error, 'error');
      }
    }
  });

  // Education validation
  const education = resume?.education || [];
  education.forEach((edu, index) => {
    const eduLabel = edu.institution ? `Education: ${edu.institution}` : `Education #${index + 1}`;

    if (!edu.institution?.trim() && !edu.degree?.trim()) {
      addError(eduLabel, 'Institution/Degree', 'Education entry is incomplete', 'warning');
    }

    // Date validation
    if (edu.startDate && edu.endDate && !edu.current) {
      const dateResult = validateDateRange(edu.startDate, edu.endDate, edu.current);
      if (!dateResult.valid) {
        addError(eduLabel, 'Dates', dateResult.error, 'error');
      }
    }
  });

  // Projects validation
  const projects = resume?.projects || [];
  projects.forEach((project, index) => {
    const projectLabel = project.name ? `Project: ${project.name}` : `Project #${index + 1}`;

    if (project.link?.trim()) {
      const linkResult = validateUrl(project.link);
      if (!linkResult.valid) {
        addError(projectLabel, 'Link', linkResult.error, 'error');
      }
    }

    if (project.github?.trim()) {
      const githubResult = validateUrl(project.github);
      if (!githubResult.valid) {
        addError(projectLabel, 'GitHub', githubResult.error, 'error');
      }
    }
  });

  // Certifications validation
  const certifications = resume?.certifications || [];
  certifications.forEach((cert, index) => {
    const certLabel = cert.name ? `Certification: ${cert.name}` : `Certification #${index + 1}`;

    if (cert.url?.trim()) {
      const urlResult = validateUrl(cert.url);
      if (!urlResult.valid) {
        addError(certLabel, 'URL', urlResult.error, 'error');
      }
    }
  });

  // Check for empty resume warning
  const hasContent = personalInfo.fullName?.trim() ||
    experiences.length > 0 ||
    education.length > 0 ||
    projects.length > 0 ||
    (resume?.skills?.categories || []).some(cat => cat.items?.length > 0);

  if (!hasContent) {
    addError('Resume', 'Content', 'Your resume appears to be empty', 'error');
  }

  // Separate errors by severity
  const criticalErrors = errors.filter(e => e.severity === 'error');
  const warnings = errors.filter(e => e.severity === 'warning');

  return {
    valid: criticalErrors.length === 0,
    errors: criticalErrors,
    warnings: warnings,
    allIssues: errors
  };
}
