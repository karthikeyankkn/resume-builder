import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

// Tour steps configuration
const TOUR_STEPS = [
  {
    id: 'welcome',
    target: null, // Center modal for welcome
    title: 'Welcome to Resume Builder!',
    content: 'Create professional resumes in minutes. This quick tour will show you how to get started.',
    position: 'center'
  },
  {
    id: 'editor',
    target: '[data-tour="editor-panel"]',
    title: 'Resume Editor',
    content: 'Fill in your details here. Click on each section to expand and edit your information.',
    position: 'right'
  },
  {
    id: 'personal-info',
    target: '[data-tour="section-personalInfo"]',
    title: 'Start with Personal Info',
    content: 'Begin by adding your name, contact details, and a professional summary.',
    position: 'right'
  },
  {
    id: 'preview',
    target: '[data-tour="preview-panel"]',
    title: 'Live Preview',
    content: 'See your resume update in real-time as you type. Use the zoom controls to adjust the view.',
    position: 'left'
  },
  {
    id: 'templates',
    target: '[data-tour="templates-btn"]',
    title: 'Choose a Template',
    content: 'Pick from 5 professional templates to give your resume the perfect look.',
    position: 'bottom'
  },
  {
    id: 'export',
    target: '[data-tour="export-btn"]',
    title: 'Export Your Resume',
    content: 'When you\'re done, export your resume as a PDF. Your data is saved automatically in your browser.',
    position: 'bottom'
  },
  {
    id: 'shortcuts',
    target: '[data-tour="shortcuts-hint"]',
    title: 'Keyboard Shortcuts',
    content: 'Press ? anytime to see all available keyboard shortcuts for faster editing.',
    position: 'top'
  }
];

const STORAGE_KEY = 'resume-builder-tour-completed';

export default function GuidedTour({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const step = TOUR_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  // Check if tour should be shown
  useEffect(() => {
    const hasCompletedTour = localStorage.getItem(STORAGE_KEY);
    if (!hasCompletedTour) {
      // Small delay to let the app render first
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Update target element highlighting
  useEffect(() => {
    if (!isVisible || !step.target) {
      return;
    }

    const updateTargetPosition = () => {
      const targetEl = document.querySelector(step.target);
      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        setTargetRect(rect);

        // Calculate tooltip position based on step position
        const padding = 16;
        const tooltipWidth = 320;
        const tooltipHeight = 180;

        let top, left;

        switch (step.position) {
          case 'right':
            top = rect.top + rect.height / 2 - tooltipHeight / 2;
            left = rect.right + padding;
            break;
          case 'left':
            top = rect.top + rect.height / 2 - tooltipHeight / 2;
            left = rect.left - tooltipWidth - padding;
            break;
          case 'bottom':
            top = rect.bottom + padding;
            left = rect.left + rect.width / 2 - tooltipWidth / 2;
            break;
          case 'top':
            top = rect.top - tooltipHeight - padding;
            left = rect.left + rect.width / 2 - tooltipWidth / 2;
            break;
          default:
            top = window.innerHeight / 2 - tooltipHeight / 2;
            left = window.innerWidth / 2 - tooltipWidth / 2;
        }

        // Keep tooltip within viewport
        top = Math.max(padding, Math.min(window.innerHeight - tooltipHeight - padding, top));
        left = Math.max(padding, Math.min(window.innerWidth - tooltipWidth - padding, left));

        setTooltipPosition({ top, left });
      }
    };

    updateTargetPosition();
    window.addEventListener('resize', updateTargetPosition);
    window.addEventListener('scroll', updateTargetPosition, true);

    return () => {
      window.removeEventListener('resize', updateTargetPosition);
      window.removeEventListener('scroll', updateTargetPosition, true);
    };
  }, [isVisible, step, currentStep]);

  // Define handleComplete first since other callbacks depend on it
  const handleComplete = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
    onComplete?.();
  }, [onComplete]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  }, [isLastStep, handleComplete]);

  const handlePrev = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  }, [isFirstStep]);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleSkip();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleNext, handlePrev, handleSkip]);

  if (!isVisible) return null;

  const isCentered = step.position === 'center';

  return (
    <div className="fixed inset-0 z-[9999]" role="dialog" aria-modal="true" aria-label="Guided tour">
      {/* Overlay with spotlight cutout */}
      <div className="absolute inset-0">
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black/50 transition-opacity" />

        {/* Spotlight cutout for target element */}
        {targetRect && step.target && !isCentered && (
          <div
            className="absolute bg-transparent rounded-lg ring-4 ring-primary-400 ring-offset-4 ring-offset-transparent shadow-2xl"
            style={{
              top: targetRect.top - 8,
              left: targetRect.left - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div
        className={`absolute bg-white rounded-xl shadow-2xl border border-gray-200 w-80 transition-all duration-300 ${
          isCentered ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''
        }`}
        style={isCentered ? {} : { top: tooltipPosition.top, left: tooltipPosition.left }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Skip tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{step.content}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
            >
              {isLastStep ? 'Get Started' : 'Next'}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 pb-4">
          {TOUR_STEPS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep
                  ? 'bg-primary-600'
                  : index < currentStep
                    ? 'bg-primary-300'
                    : 'bg-gray-300'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
