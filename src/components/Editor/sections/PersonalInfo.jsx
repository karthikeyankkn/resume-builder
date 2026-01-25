import { useState } from 'react';
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe, Camera, Loader2 } from 'lucide-react';
import { useResumeStore } from '../../../store/resumeStore';
import { compressImage, validateImageFile, formatFileSize } from '../../../utils/imageUtils';

export default function PersonalInfo() {
  const { resume, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = resume;
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error);
      return;
    }

    setUploadError(null);
    setIsCompressing(true);

    try {
      // Compress image to max 400px dimension with 0.8 JPEG quality
      const compressedImage = await compressImage(file, {
        maxDimension: 400,
        quality: 0.8
      });

      updatePersonalInfo('photo', compressedImage);
    } catch (error) {
      setUploadError('Failed to process image. Please try another file.');
      console.error('Image compression error:', error);
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-primary-600" />
        Personal Information
      </h2>

      <div className="space-y-4">
        {/* Photo Upload */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {isCompressing ? (
              <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-primary-200 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
              </div>
            ) : personalInfo.photo ? (
              <img
                src={personalInfo.photo}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                <Camera className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handlePhotoUpload}
              disabled={isCompressing}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
            />
          </div>
          <div className="text-sm text-gray-500">
            <p className="font-medium text-gray-700">Profile Photo</p>
            <p>{isCompressing ? 'Compressing...' : 'Click to upload (optional)'}</p>
            {uploadError && (
              <p className="text-red-500 text-xs mt-1">{uploadError}</p>
            )}
            {personalInfo.photo && !isCompressing && (
              <button
                type="button"
                onClick={() => updatePersonalInfo('photo', '')}
                className="text-red-500 text-xs mt-1 hover:underline"
              >
                Remove photo
              </button>
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
            <label className="form-label flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> Email *
            </label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              placeholder="john@example.com"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Phone
            </label>
            <input
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="form-input"
            />
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
            <label className="form-label flex items-center gap-1">
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </label>
            <input
              type="text"
              value={personalInfo.linkedIn}
              onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)}
              placeholder="linkedin.com/in/username"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label flex items-center gap-1">
              <Github className="w-3.5 h-3.5" /> GitHub
            </label>
            <input
              type="text"
              value={personalInfo.github}
              onChange={(e) => updatePersonalInfo('github', e.target.value)}
              placeholder="github.com/username"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Portfolio
            </label>
            <input
              type="text"
              value={personalInfo.portfolio}
              onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
              placeholder="yourwebsite.com"
              className="form-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
