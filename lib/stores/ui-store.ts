import { create } from "zustand";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface UIStore {
  toasts: ToastMessage[];
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  toasts: [],
  addToast: (message, type = "success") => {
    const id = "toast-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}));
