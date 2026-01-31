import { useState } from 'react';
import { X, Search, Copy, CheckCircle, FileText } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import {
  extractKeywords,
  calculateATSScore,
  extractResumeText
} from '../../utils/atsAnalyzer';
import ATSScoreDisplay from './ATSScoreDisplay';
import KeywordList from './KeywordList';
import SuggestionCard from './SuggestionCard';

/**
 * ATS Keyword Analyzer Modal
 * Compares resume against job description
 */
export default function ATSAnalyzerModal({ isOpen, onClose }) {
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  const { resume } = useResumeStore();

  const handleAnalyze = () => {
    if (!jobDescription.trim()) return;

    setIsAnalyzing(true);

    // Small delay for UX feedback
    setTimeout(() => {
      try {
        // Extract keywords from job description
        const jobKeywords = extractKeywords(jobDescription);

        // Extract text from resume and get keywords
        const resumeText = extractResumeText(resume);
        const resumeKeywords = extractKeywords(resumeText);

        // Calculate score
        const scoreResults = calculateATSScore(jobKeywords, resumeKeywords);

        setResults(scoreResults);
      } catch (error) {
        console.error('Error analyzing keywords:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }, 300);
  };

  const copyMissingKeywords = () => {
    if (!results) return;

    const allMissing = [
      ...results.missing.technical,
      ...results.missing.phrases,
      ...results.missing.general
    ].join(', ');

    navigator.clipboard.writeText(allMissing).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClear = () => {
    setJobDescription('');
    setResults(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                ATS Keyword Analyzer
              </h2>
              <p className="text-sm text-gray-500">
                Compare your resume against a job description
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Job Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here to analyze keyword match..."
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={handleAnalyze}
                disabled={!jobDescription.trim() || isAnalyzing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Search size={16} />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Keywords'}
              </button>
              {jobDescription && (
                <button
                  onClick={handleClear}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          {results && (
            <div className="space-y-6">
              {/* Score Display */}
              <div className="flex justify-center">
                <ATSScoreDisplay score={results.score} />
              </div>

              {/* Keyword Lists */}
              <div className="space-y-3">
                <KeywordList
                  title="Matched Keywords"
                  keywords={results.matched}
                  type="matched"
                />
                <KeywordList
                  title="Missing Keywords"
                  keywords={results.missing}
                  type="missing"
                />
              </div>

              {/* Suggestions */}
              {results.suggestions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">
                    Suggestions
                  </h3>
                  {results.suggestions.map((suggestion, idx) => (
                    <SuggestionCard key={idx} suggestion={suggestion} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500">
            Analysis is performed locally. No data is sent to any server.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
            {results && (
              <button
                onClick={copyMissingKeywords}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy Missing Keywords
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
