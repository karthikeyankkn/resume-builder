import { create } from 'zustand';

export const useConfirmStore = create((set, get) => ({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'default', // 'default' | 'danger'
  onConfirm: null,
  onCancel: null,

  openConfirm: ({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'default', onConfirm, onCancel }) => {
    set({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      variant,
      onConfirm,
      onCancel,
    });
  },

  closeConfirm: () => {
    const { onCancel } = get();
    if (onCancel) {
      onCancel();
    }
    set({
      isOpen: false,
      title: '',
      message: '',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      variant: 'default',
      onConfirm: null,
      onCancel: null,
    });
  },

  handleConfirm: () => {
    const { onConfirm } = get();
    if (onConfirm) {
      onConfirm();
    }
    set({
      isOpen: false,
      title: '',
      message: '',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      variant: 'default',
      onConfirm: null,
      onCancel: null,
    });
  },
}));

// Hook for easier usage
export const useConfirm = () => {
  const { openConfirm } = useConfirmStore();

  const confirm = ({ title, message, confirmText, cancelText, variant }) => {
    return new Promise((resolve) => {
      openConfirm({
        title,
        message,
        confirmText,
        cancelText,
        variant,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };

  return { confirm };
};
