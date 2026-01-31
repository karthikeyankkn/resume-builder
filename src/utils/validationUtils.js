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
