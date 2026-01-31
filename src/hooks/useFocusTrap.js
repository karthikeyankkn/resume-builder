import { useEffect, useRef } from 'react';

/**
 * Hook to trap focus within a container (useful for modals)
 * @param {boolean} isActive - Whether the focus trap is active
 * @param {object} options - Options
 * @param {function} options.onEscape - Callback when Escape key is pressed
 * @returns {React.RefObject} Ref to attach to the container element
 */
export function useFocusTrap(isActive, options = {}) {
  const containerRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Store the currently focused element to restore later
    previousActiveElement.current = document.activeElement;

    // Get all focusable elements within the container
    const getFocusableElements = () => {
      const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ');

      return Array.from(container.querySelectorAll(focusableSelectors))
        .filter(el => el.offsetParent !== null); // Filter out hidden elements
    };

    // Focus the first focusable element or the container itself
    const focusFirst = () => {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        container.focus();
      }
    };

    // Handle keydown events
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && options.onEscape) {
        event.preventDefault();
        options.onEscape();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab on first element -> go to last
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      // Tab on last element -> go to first
      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
        return;
      }

      // If focus is outside the container, bring it back
      if (!container.contains(document.activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    // Set initial focus
    requestAnimationFrame(focusFirst);

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus to previously focused element
      if (previousActiveElement.current && previousActiveElement.current.focus) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive, options.onEscape]);

  return containerRef;
}

export default useFocusTrap;
