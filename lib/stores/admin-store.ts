import { create } from "zustand";
import {
  AdminCourse,
  AdminBatch,
  AdminNotice,
  AdminStudent,
  AdminAdmissionRequest,
  initialCourses,
  initialBatches,
  initialNotices,
  initialStudents,
  initialAdmissionRequests,
} from "../admin-data";
import { useUIStore } from "./ui-store";
import { getStoredAdminNotices, saveStoredAdminNotices } from "../api/notice-store-sync";

export interface AdminUser {
  name: string;
  email: string;
  role: string;
  designation: string;
  phone?: string;
}

interface AdminState {
  courses: AdminCourse[];
  batches: AdminBatch[];
  notices: AdminNotice[];
  students: AdminStudent[];
  admissions: AdminAdmissionRequest[];
  adminUser: AdminUser;

  // Course actions
  setCourses: (courses: AdminCourse[]) => void;
  addCourse: (course: Omit<AdminCourse, "id" | "createdAt">) => void;
  updateCourse: (id: string, updates: Partial<AdminCourse>) => void;
  deleteCourse: (id: string) => void;

  // Batch actions
  setBatches: (batches: AdminBatch[]) => void;
  addBatch: (batch: Omit<AdminBatch, "id" | "createdAt" | "courseName">) => void;
  updateBatch: (id: string, updates: Partial<AdminBatch>) => void;
  deleteBatch: (id: string) => void;

  // Notice actions
  setNotices: (notices: AdminNotice[]) => void;
  addNotice: (notice: Omit<AdminNotice, "id" | "date">) => void;
  updateNotice: (id: string, updates: Partial<AdminNotice>) => void;
  deleteNotice: (id: string) => void;

  // Admissions actions
  setAdmissions: (admissions: AdminAdmissionRequest[]) => void;
  addAdmission: (admission: AdminAdmissionRequest) => void;
  approveAdmission: (admissionId: string, batchId: string) => void;
  rejectAdmission: (admissionId: string, reason?: string) => void;

  // Student actions
  setStudents: (students: AdminStudent[]) => void;
  toggleStudentStatus: (studentId: string) => void;
  changeStudentBatch: (studentId: string, courseId: string, newBatchId: string) => void;

  // Profile actions
  updateAdminProfile: (updates: Partial<AdminUser>) => void;
  changePassword: (curr: string, next: string) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  courses: initialCourses,
  batches: initialBatches,
  notices: typeof window !== "undefined" && getStoredAdminNotices().length > 0 ? getStoredAdminNotices() : initialNotices,
  students: initialStudents,
  admissions: initialAdmissionRequests,
  adminUser: {
    name: "Admin",
    email: "admin@college.com",
    role: "Administrator",
    designation: "System Administrator",
  },

  // Courses
  setCourses: (courses) => set({ courses }),
  addCourse: (courseData) => {
    const newCourse: AdminCourse = {
      ...courseData,
      id: "course-" + Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    set((state) => ({ courses: [newCourse, ...state.courses] }));
    useUIStore.getState().addToast(`Course "${newCourse.name}" created successfully.`, "success");
  },
  updateCourse: (id, updates) => {
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
    useUIStore.getState().addToast("Course updated successfully.", "success");
  },
  deleteCourse: (id) => {
    const course = get().courses.find((c) => c.id === id);
    set((state) => ({
      courses: state.courses.filter((c) => c.id !== id),
      batches: state.batches.filter((b) => b.courseId !== id),
    }));
    useUIStore.getState().addToast(`Course "${course?.name || id}" deleted.`, "info");
  },

  // Batches
  setBatches: (batches) => set({ batches }),
  addBatch: (batchData) => {
    const course = get().courses.find((c) => c.id === batchData.courseId);
    const newBatch: AdminBatch = {
      ...batchData,
      id: "batch-" + Date.now(),
      courseName: course ? course.name : "Custom Course",
      createdAt: new Date().toISOString().split("T")[0],
    };
    set((state) => ({ batches: [newBatch, ...state.batches] }));
    useUIStore.getState().addToast(`Batch "${newBatch.name}" created.`, "success");
  },
  updateBatch: (id, updates) => {
    set((state) => ({
      batches: state.batches.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
    useUIStore.getState().addToast("Batch details updated.", "success");
  },
  deleteBatch: (id) => {
    const batch = get().batches.find((b) => b.id === id);
    set((state) => ({
      batches: state.batches.filter((b) => b.id !== id),
    }));
    useUIStore.getState().addToast(`Batch "${batch?.name || id}" deleted.`, "info");
  },

  // Notices
  setNotices: (notices) => {
    saveStoredAdminNotices(notices);
    set({ notices });
  },
  addNotice: (noticeData) => {
    const dateFormatted = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    const newNotice: AdminNotice = {
      ...noticeData,
      id: "not-" + Date.now(),
      date: dateFormatted,
    };
    const updated = [newNotice, ...get().notices];
    saveStoredAdminNotices(updated);
    set({ notices: updated });
    useUIStore.getState().addToast(`Notice "${newNotice.title}" published.`, "success");
  },
  updateNotice: (id, updates) => {
    const updated = get().notices.map((n) => (n.id === id ? { ...n, ...updates } : n));
    saveStoredAdminNotices(updated);
    set({ notices: updated });
    useUIStore.getState().addToast("Notice updated successfully.", "success");
  },
  deleteNotice: (id) => {
    const updated = get().notices.filter((n) => n.id !== id);
    saveStoredAdminNotices(updated);
    set({ notices: updated });
    useUIStore.getState().addToast("Notice deleted.", "info");
  },

  // Admissions
  setAdmissions: (admissions) => set({ admissions }),
  addAdmission: (admission) =>
    set((state) => ({
      admissions: [admission, ...state.admissions],
    })),
  approveAdmission: (admissionId, batchId) => {
    const admission = get().admissions.find((a) => a.id === admissionId);
    if (!admission) return;
    const batch = get().batches.find((b) => b.id === batchId);

    const newStudent: AdminStudent = {
      id: "stu-" + Date.now(),
      name: admission.applicantName,
      email: admission.email,
      phone: admission.phone,
      rollNumber: "JB-2026-" + Math.floor(1000 + Math.random() * 9000),
      guardianName: admission.guardianName,
      address: admission.address || "Agra, Uttar Pradesh",
      status: "Active",
      joinedDate: new Date().toISOString().split("T")[0],
      enrollments: [
        {
          courseId: admission.courseId,
          courseName: admission.courseName,
          batchId: batchId,
          batchName: batch?.name || "Assigned Batch",
          enrolledDate: new Date().toISOString().split("T")[0],
        },
      ],
    };

    set((state) => ({
      admissions: state.admissions.map((a) =>
        a.id === admissionId
          ? {
              ...a,
              status: "Approved",
              assignedBatchId: batchId,
            }
          : a
      ),
      students: [newStudent, ...state.students],
      batches: state.batches.map((b) =>
        b.id === batchId
          ? { ...b, enrolledCount: (b.enrolledCount || 0) + 1 }
          : b
      ),
    }));

    useUIStore.getState().addToast(
      `Admission for ${admission.applicantName} approved and assigned to ${batch?.name || "batch"}.`,
      "success"
    );
  },
  rejectAdmission: (admissionId, reason) => {
    const admission = get().admissions.find((a) => a.id === admissionId);
    set((state) => ({
      admissions: state.admissions.map((a) =>
        a.id === admissionId
          ? {
              ...a,
              status: "Rejected",
              notes: reason || "Does not meet course criteria",
            }
          : a
      ),
    }));
    useUIStore.getState().addToast(`Admission for ${admission?.applicantName} marked as Rejected.`, "info");
  },

  // Students
  setStudents: (students) => set({ students }),
  toggleStudentStatus: (studentId) => {
    set((state) => ({
      students: state.students.map((s) =>
        s.id === studentId ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s
      ),
    }));
    useUIStore.getState().addToast("Student status changed.", "success");
  },
  changeStudentBatch: (studentId, courseId, newBatchId) => {
    const newBatch = get().batches.find((b) => b.id === newBatchId);
    set((state) => ({
      students: state.students.map((s) =>
        s.id === studentId
          ? {
              ...s,
              enrollments: s.enrollments.map((enr) =>
                enr.courseId === courseId
                  ? { ...enr, batchId: newBatchId, batchName: newBatch?.name || enr.batchName }
                  : enr
              ),
            }
          : s
      ),
    }));
    useUIStore.getState().addToast(`Student transferred to ${newBatch?.name || "new batch"}.`, "success");
  },

  // Profile & Auth
  updateAdminProfile: (updates) => {
    set((state) => ({ adminUser: { ...state.adminUser, ...updates } }));
  },
  changePassword: () => {
  },
  logout: () => {
    useUIStore.getState().addToast("Admin session ended.", "info");
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
  },
}));
