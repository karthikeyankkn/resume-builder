import { useResumeStore } from '../../../store/resumeStore';

export default function Summary() {
  const { resume, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = resume;

  return (
    <div>
      <label className="form-label">
        Write a brief summary of your professional background and key strengths
      </label>
      <textarea
        value={personalInfo.summary}
        onChange={(e) => updatePersonalInfo('summary', e.target.value)}
        placeholder="Experienced software engineer with expertise in..."
        rows={4}
        className="form-textarea"
      />
      <p className="mt-1 text-xs text-gray-500">
        {personalInfo.summary.length}/500 characters (recommended: 150-300)
      </p>
    </div>
  );
}
