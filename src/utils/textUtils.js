/**
 * Text processing utilities for handling multi-line text
 */

/**
 * Splits text by newline characters for rendering in PDF
 * @param {string} text - Text to split
 * @returns {string[]} - Array of text lines
 */
export function splitTextByNewlines(text) {
  if (!text) return [];
  return text.split(/\r?\n/);
}

/**
 * Checks if text contains newline characters
 * @param {string} text - Text to check
 * @returns {boolean} - True if text contains newlines
 */
export function hasNewlines(text) {
  if (!text) return false;
  return /\r?\n/.test(text);
}

/**
 * Trims empty lines from the start and end of text
 * @param {string} text - Text to trim
 * @returns {string} - Trimmed text
 */
export function trimEmptyLines(text) {
  if (!text) return '';
  return text.replace(/^[\r\n]+|[\r\n]+$/g, '');
}

/**
 * Converts text with newlines to array of non-empty paragraphs
 * @param {string} text - Text to convert
 * @returns {string[]} - Array of non-empty paragraphs
 */
export function textToParagraphs(text) {
  if (!text) return [];
  return splitTextByNewlines(text).filter(line => line.trim().length > 0);
}
