import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export const useToastStore = create((set) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = uuidv4();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));

export const useToast = () => {
    const { addToast } = useToastStore();
    return {
        showToast: addToast,
    }
};
