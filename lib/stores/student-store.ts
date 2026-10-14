import { create } from "zustand";
import {
  StudentProfileData,
  StudentCourse,
  StudentBatch,
  StudentNotice,
  defaultStudentProfile,
  defaultStudentCourses,
  defaultStudentBatches,
  defaultStudentNotices,
} from "../student-data";
import { useUIStore } from "./ui-store";

interface StudentState {
  student: StudentProfileData;
  courses: StudentCourse[];
  batches: StudentBatch[];
  notices: StudentNotice[];
  showNoClassTodayDemo: boolean;
  mustChangePassword: boolean;

  // Actions
  setStudent: (student: StudentProfileData) => void;
  setCourses: (courses: StudentCourse[]) => void;
  setBatches: (batches: StudentBatch[]) => void;
  setNotices: (notices: StudentNotice[]) => void;
  setMustChangePassword: (val: boolean) => void;
  updateProfile: (updates: Partial<StudentProfileData>) => void;
  changePassword: (curr: string, next: string) => void;
  toggleNoClassTodayDemo: () => void;
  logout: () => void;
}

export const useStudentStore = create<StudentState>((set, get) => ({
  student: defaultStudentProfile,
  courses: defaultStudentCourses,
  batches: defaultStudentBatches,
  notices: defaultStudentNotices,
  showNoClassTodayDemo: false,
  mustChangePassword: false,

  setStudent: (student) => set({ student }),
  setCourses: (courses) => set({ courses }),
  setBatches: (batches) => set({ batches }),
  setNotices: (notices) => set({ notices }),
  setMustChangePassword: (mustChangePassword) => set({ mustChangePassword }),

  updateProfile: (updates) => {
    set((state) => ({ student: { ...state.student, ...updates } }));
    useUIStore.getState().addToast("Profile details updated successfully.", "success");
  },

  changePassword: () => {
    useUIStore.getState().addToast("Student password updated successfully.", "success");
  },

  toggleNoClassTodayDemo: () => {
    set((state) => ({ showNoClassTodayDemo: !state.showNoClassTodayDemo }));
  },

  logout: () => {
    useUIStore.getState().addToast("Signed out from student session.", "info");
    if (typeof window !== "undefined") {
      window.location.href = "/student/login";
    }
  },
}));
