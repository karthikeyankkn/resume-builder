import { useEffect, useRef, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useConfirmStore } from '../../store/confirmStore';

export default function ConfirmModal() {
  const {
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    variant,
    handleConfirm,
    closeConfirm,
  } = useConfirmStore();

  const modalRef = useRef(null);
  const confirmButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Store previously focused element and focus the modal when opened
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      // Focus the cancel button by default (safer option)
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 0);
    } else {
      // Return focus to the previously focused element
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // Handle escape key and focus trap
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      closeConfirm();
      return;
    }

    // Focus trap
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button:not([disabled])'
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [closeConfirm]);

  // Add keyboard listener when modal is open
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeConfirm();
    }
  };

  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="modal-content w-full max-w-md p-6 animate-scaleIn"
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 p-2 rounded-full ${
            isDanger ? 'bg-red-100' : 'bg-primary-100'
          }`}>
            <AlertTriangle className={`w-6 h-6 ${
              isDanger ? 'text-red-600' : 'text-primary-600'
            }`} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <h2
              id="confirm-dialog-title"
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </h2>
            <p
              id="confirm-dialog-description"
              className="mt-2 text-sm text-gray-600"
            >
              {message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={closeConfirm}
            className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelButtonRef}
            onClick={closeConfirm}
            className="btn btn-secondary"
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            onClick={handleConfirm}
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
