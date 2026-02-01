import { useState, useMemo } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Camera, Loader2, X, AlertCircle } from 'lucide-react';
import { useResumeStore } from '../../../store/resumeStore';
import { compressImage, validateImageFile } from '../../../utils/imageUtils';
import { validateEmail, validatePhone, validateUrl } from '../../../utils/validationUtils';

// Format file size for display
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function PersonalInfo() {
  const { resume, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = resume;
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [compressionProgress, setCompressionProgress] = useState(null);
  const [fileSizeWarning, setFileSizeWarning] = useState(null);

  // Validation state
  const validationErrors = useMemo(() => ({
    email: validateEmail(personalInfo.email),
    phone: validatePhone(personalInfo.phone),
    linkedIn: validateUrl(personalInfo.linkedIn),
    github: validateUrl(personalInfo.github),
    portfolio: validateUrl(personalInfo.portfolio),
  }), [personalInfo.email, personalInfo.phone, personalInfo.linkedIn, personalInfo.github, personalInfo.portfolio]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error);
      return;
    }

    // Show file size warning for large files
    if (file.size > 5 * 1024 * 1024) { // > 5MB
      setFileSizeWarning(`Large file (${formatFileSize(file.size)}). Compressing...`);
    } else {
      setFileSizeWarning(null);
    }

    setUploadError(null);
    setIsCompressing(true);
    setCompressionProgress('Processing image...');

    try {
      // Compress image to max 400px dimension with size limit
      const result = await compressImage(file, {
        maxDimension: 400,
        quality: 0.8,
        maxSize: 100 * 1024 // 100KB max for localStorage efficiency
      });

      setCompressionProgress('Saving...');
      updatePersonalInfo('photo', result.dataUrl);

      // Show warning if image is still large after compression
      if (result.warning) {
        setFileSizeWarning(result.warning);
      } else {
        setFileSizeWarning(null);
      }
    } catch (error) {
      setUploadError('Failed to process image. Please try another file.');
      console.error('Image compression error:', error);
    } finally {
      setIsCompressing(false);
      setCompressionProgress(null);
    }
  };

  const handleRemovePhoto = () => {
    updatePersonalInfo('photo', null);
  };

  return (
    <div className="space-y-4">
      {/* Photo Upload */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {isCompressing ? (
            <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-primary-200 flex items-center justify-center flex-col">
              <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
            </div>
          ) : personalInfo.photo ? (
            <div className="relative group">
              <img
                src={personalInfo.photo}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
              {/* Remove photo overlay button */}
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                title="Remove photo"
                aria-label="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
              <Camera className="w-6 h-6 text-gray-400" />
            </div>
          )}
          {!personalInfo.photo && (
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handlePhotoUpload}
              disabled={isCompressing}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
            />
          )}
        </div>
        <div className="text-sm text-gray-500 flex-1">
          <p className="font-medium text-gray-700">Profile Photo</p>
          {isCompressing ? (
            <p className="text-primary-600">{compressionProgress || 'Compressing...'}</p>
          ) : personalInfo.photo ? (
            <p>Click photo to change or hover to remove</p>
          ) : (
            <p>Click to upload (optional)</p>
          )}
          {fileSizeWarning && (
            <p className="text-amber-600 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {fileSizeWarning}
            </p>
          )}
          {uploadError && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {uploadError}
            </p>
          )}
          {personalInfo.photo && !isCompressing && (
            <label className="inline-block mt-1">
              <span className="text-primary-600 text-xs cursor-pointer hover:underline">Change photo</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Name and Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            value={personalInfo.fullName}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            placeholder="John Doe"
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label">Professional Title *</label>
          <input
            type="text"
            value={personalInfo.title}
            onChange={(e) => updatePersonalInfo('title', e.target.value)}
            placeholder="Software Engineer"
            className="form-input"
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email-input" className="form-label flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" /> Email *
          </label>
          <input
            id="email-input"
            type="email"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            placeholder="john@example.com"
            className={`form-input ${!validationErrors.email.valid ? 'error' : ''}`}
            aria-invalid={!validationErrors.email.valid}
            aria-describedby={!validationErrors.email.valid ? 'email-error' : undefined}
          />
          {!validationErrors.email.valid && (
            <p id="email-error" className="form-error" role="alert">
              <AlertCircle className="w-3 h-3" aria-hidden="true" />
              {validationErrors.email.error}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="phone-input" className="form-label flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" /> Phone
          </label>
          <input
            id="phone-input"
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className={`form-input ${!validationErrors.phone.valid ? 'error' : ''}`}
            aria-invalid={!validationErrors.phone.valid}
            aria-describedby={!validationErrors.phone.valid ? 'phone-error' : undefined}
          />
          {!validationErrors.phone.valid && (
            <p id="phone-error" className="form-error" role="alert">
              <AlertCircle className="w-3 h-3" aria-hidden="true" />
              {validationErrors.phone.error}
            </p>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="form-label flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> Location
        </label>
        <input
          type="text"
          value={personalInfo.location}
          onChange={(e) => updatePersonalInfo('location', e.target.value)}
          placeholder="San Francisco, CA"
          className="form-input"
        />
      </div>

      {/* Social Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="linkedin-input" className="form-label flex items-center gap-1">
            <Linkedin className="w-3.5 h-3.5" /> LinkedIn
          </label>
          <input
            id="linkedin-input"
            type="text"
            value={personalInfo.linkedIn}
            onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)}
            placeholder="linkedin.com/in/username"
            className={`form-input ${!validationErrors.linkedIn.valid ? 'error' : ''}`}
            aria-invalid={!validationErrors.linkedIn.valid}
            aria-describedby={!validationErrors.linkedIn.valid ? 'linkedin-error' : undefined}
          />
          {!validationErrors.linkedIn.valid && (
            <p id="linkedin-error" className="form-error" role="alert">
              <AlertCircle className="w-3 h-3" aria-hidden="true" />
              {validationErrors.linkedIn.error}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="github-input" className="form-label flex items-center gap-1">
            <Github className="w-3.5 h-3.5" /> GitHub
          </label>
          <input
            id="github-input"
            type="text"
            value={personalInfo.github}
            onChange={(e) => updatePersonalInfo('github', e.target.value)}
            placeholder="github.com/username"
            className={`form-input ${!validationErrors.github.valid ? 'error' : ''}`}
            aria-invalid={!validationErrors.github.valid}
            aria-describedby={!validationErrors.github.valid ? 'github-error' : undefined}
          />
          {!validationErrors.github.valid && (
            <p id="github-error" className="form-error" role="alert">
              <AlertCircle className="w-3 h-3" aria-hidden="true" />
              {validationErrors.github.error}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="portfolio-input" className="form-label flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" /> Portfolio
          </label>
          <input
            id="portfolio-input"
            type="text"
            value={personalInfo.portfolio}
            onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
            placeholder="yourwebsite.com"
            className={`form-input ${!validationErrors.portfolio.valid ? 'error' : ''}`}
            aria-invalid={!validationErrors.portfolio.valid}
            aria-describedby={!validationErrors.portfolio.valid ? 'portfolio-error' : undefined}
          />
          {!validationErrors.portfolio.valid && (
            <p id="portfolio-error" className="form-error" role="alert">
              <AlertCircle className="w-3 h-3" aria-hidden="true" />
              {validationErrors.portfolio.error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
