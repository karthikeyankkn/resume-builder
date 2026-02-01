/**
 * Image compression utilities for handling large image uploads
 *
 * These utilities handle profile photo compression with size limits to prevent
 * localStorage quota exhaustion. Photos are compressed to fit within storage
 * constraints while maintaining acceptable visual quality.
 */

const MAX_DIMENSION = 400;
const JPEG_QUALITY = 0.8;
const MAX_FILE_SIZE = 500 * 1024; // 500KB after compression
const MAX_COMPRESSED_SIZE = 100 * 1024; // 100KB max for localStorage efficiency

/**
 * Compresses an image to a maximum dimension while maintaining aspect ratio.
 * Uses progressive quality reduction to ensure the final size stays within limits.
 *
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @param {number} options.maxDimension - Maximum width or height (default: 400)
 * @param {number} options.quality - Initial JPEG quality 0-1 (default: 0.8)
 * @param {number} options.maxSize - Maximum compressed size in bytes (default: 100KB)
 * @returns {Promise<{dataUrl: string, size: number, quality: number, warning: string|null}>}
 */
export async function compressImage(file, options = {}) {
  const {
    maxDimension = MAX_DIMENSION,
    quality = JPEG_QUALITY,
    maxSize = MAX_COMPRESSED_SIZE
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          // Calculate new dimensions maintaining aspect ratio
          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');

          // Use better image smoothing for quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(img, 0, 0, width, height);

          // Progressive compression to meet size limit
          let currentQuality = quality;
          let compressedDataUrl = canvas.toDataURL('image/jpeg', currentQuality);
          let compressedSize = getBase64Size(compressedDataUrl);
          const minQuality = 0.3; // Don't go below 30% quality

          // Reduce quality until we meet size limit or hit minimum quality
          while (compressedSize > maxSize && currentQuality > minQuality) {
            currentQuality -= 0.1;
            compressedDataUrl = canvas.toDataURL('image/jpeg', currentQuality);
            compressedSize = getBase64Size(compressedDataUrl);
          }

          // Generate warning if still too large
          let warning = null;
          if (compressedSize > maxSize) {
            warning = `Image is ${formatFileSize(compressedSize)} (target: ${formatFileSize(maxSize)}). Consider using a smaller image.`;
          }

          resolve({
            dataUrl: compressedDataUrl,
            size: compressedSize,
            quality: currentQuality,
            warning
          });
        } catch (error) {
          reject(new Error('Failed to compress image: ' + error.message));
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validates an image file before processing
 * @param {File} file - The file to validate
 * @returns {Object} - Validation result { valid: boolean, error?: string }
 */
export function validateImageFile(file) {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 20 * 1024 * 1024; // 20MB max input size

  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please use JPEG, PNG, GIF, or WebP.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File too large. Maximum size is 20MB.' };
  }

  return { valid: true };
}

/**
 * Gets the size of a base64 encoded string in bytes
 * @param {string} base64String - Base64 encoded string
 * @returns {number} - Size in bytes
 */
export function getBase64Size(base64String) {
  if (!base64String) return 0;

  // Remove data URL prefix if present
  const base64 = base64String.split(',')[1] || base64String;

  // Calculate size: base64 encodes 3 bytes as 4 characters
  const padding = (base64.match(/=/g) || []).length;
  return Math.floor((base64.length * 3) / 4) - padding;
}

/**
 * Formats file size for display
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size string
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
