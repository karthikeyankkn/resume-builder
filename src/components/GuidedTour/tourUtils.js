const STORAGE_KEY = 'resume-builder-tour-completed';

// Reset tour (for testing/debugging or re-showing to user)
export function resetTour() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}

// Check if tour is completed
export function isTourCompleted() {
  return localStorage.getItem(STORAGE_KEY) === 'true';
}
