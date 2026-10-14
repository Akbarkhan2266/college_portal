"use client";

import * as React from "react";
import { useAdminStore } from "./stores/admin-store";
import { useUIStore, ToastMessage } from "./stores/ui-store";
import {
  useAdminMeQuery,
  useCoursesQuery,
  useBatchesQuery,
  useNoticesQuery,
  useAdmissionsQuery,
  useStudentsQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useCreateBatchMutation,
  useUpdateBatchMutation,
  useDeleteBatchMutation,
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
  useApproveAdmissionMutation,
  useRejectAdmissionMutation,
  useTransferStudentBatchMutation,
  useSetStudentStatusMutation,
  useAdminLogoutMutation,
  useAdminChangePasswordMutation,
  useAdminUpdateProfileMutation,
} from "./api/admin-queries";
import { AdminCourse, AdminBatch, AdminNotice, AdminStudent, AdminAdmissionRequest } from "./admin-data";

export type { ToastMessage };

/**
 * useAdmin hook with React Query API Integration & Zustand Store
 * Fetches real data from the backend, updates local store, and handles errors with toasts.
 */
export function useAdmin() {
  const adminState = useAdminStore();
  const toasts = useUIStore((s) => s.toasts);
  const addToast = useUIStore((s) => s.addToast);
  const removeToast = useUIStore((s) => s.removeToast);

  // React Query queries (auto-populates and updates store on mount & focus)
  const meQuery = useAdminMeQuery();
  const coursesQuery = useCoursesQuery();
  const batchesQuery = useBatchesQuery();
  const noticesQuery = useNoticesQuery();
  const admissionsQuery = useAdmissionsQuery();
  const studentsQuery = useStudentsQuery();

  // Mutations
  const createCourseMutation = useCreateCourseMutation();
  const updateCourseMutation = useUpdateCourseMutation();
  const deleteCourseMutation = useDeleteCourseMutation();

  const createBatchMutation = useCreateBatchMutation();
  const updateBatchMutation = useUpdateBatchMutation();
  const deleteBatchMutation = useDeleteBatchMutation();

  const createNoticeMutation = useCreateNoticeMutation();
  const updateNoticeMutation = useUpdateNoticeMutation();
  const deleteNoticeMutation = useDeleteNoticeMutation();

  const approveAdmissionMutation = useApproveAdmissionMutation();
  const rejectAdmissionMutation = useRejectAdmissionMutation();

  const transferStudentMutation = useTransferStudentBatchMutation();
  const setStudentStatusMutation = useSetStudentStatusMutation();
  const logoutMutation = useAdminLogoutMutation();
  const changePasswordMutation = useAdminChangePasswordMutation();
  const updateProfileMutation = useAdminUpdateProfileMutation();

  const activeAdminUser = {
    ...adminState.adminUser,
    ...(meQuery.data && typeof meQuery.data === "object" ? meQuery.data : {}),
  };

  return {
    ...adminState,
    adminUser: activeAdminUser,
    courses: (coursesQuery.data ?? adminState.courses) as AdminCourse[],
    batches: (batchesQuery.data ?? adminState.batches) as AdminBatch[],
    notices: (noticesQuery.data ?? adminState.notices) as AdminNotice[],
    admissions: (admissionsQuery.data ?? adminState.admissions) as AdminAdmissionRequest[],
    students: (studentsQuery.data ?? adminState.students) as AdminStudent[],
    toasts,
    addToast,
    removeToast,

    // Loading & Error States
    isLoading:
      coursesQuery.isLoading ||
      batchesQuery.isLoading ||
      noticesQuery.isLoading ||
      admissionsQuery.isLoading ||
      studentsQuery.isLoading,
    isError:
      coursesQuery.isError ||
      batchesQuery.isError ||
      noticesQuery.isError ||
      admissionsQuery.isError ||
      studentsQuery.isError,

    // Expose individual queries and global refetch
    queries: {
      courses: coursesQuery,
      batches: batchesQuery,
      notices: noticesQuery,
      admissions: admissionsQuery,
      students: studentsQuery,
      me: meQuery,
    },
    refetchAll: () => {
      coursesQuery.refetch();
      batchesQuery.refetch();
      noticesQuery.refetch();
      admissionsQuery.refetch();
      studentsQuery.refetch();
      meQuery.refetch();
    },

    // Intercepted Actions with API Mutations & Error Handling
    addCourse: (course: Omit<AdminCourse, "id" | "createdAt">) => {
      createCourseMutation.mutate(course);
    },
    updateCourse: (id: string, updates: Partial<AdminCourse>) => {
      updateCourseMutation.mutate({ id, updates });
    },
    deleteCourse: (id: string) => {
      deleteCourseMutation.mutate(id);
    },

    addBatch: (batch: Omit<AdminBatch, "id" | "createdAt" | "courseName">) => {
      createBatchMutation.mutate(batch);
    },
    updateBatch: (id: string, updates: Partial<AdminBatch>) => {
      updateBatchMutation.mutate({ id, updates });
    },
    deleteBatch: (id: string) => {
      deleteBatchMutation.mutate(id);
    },

    addNotice: (notice: Omit<AdminNotice, "id" | "date"> & { pdfFile?: File | null }) => {
      createNoticeMutation.mutate(notice);
    },
    updateNotice: (id: string, updates: Partial<AdminNotice>) => {
      updateNoticeMutation.mutate({ id, updates });
    },
    deleteNotice: (id: string) => {
      deleteNoticeMutation.mutate(id);
    },

    approveAdmission: (admissionId: string, batchId: string) => {
      approveAdmissionMutation.mutate({ admissionId, batchId });
    },
    rejectAdmission: (admissionId: string, reason?: string) => {
      rejectAdmissionMutation.mutate({ admissionId, reason: reason || "Does not meet course criteria" });
    },

    changeStudentBatch: (studentId: string, courseId: string, newBatchId: string) => {
      const student = adminState.students.find((s) => s.id === studentId);
      const enrollment = student?.enrollments.find((e) => e.courseId === courseId) || student?.enrollments[0];
      const enrollmentId = enrollment?.courseId || "enr-default";
      transferStudentMutation.mutate({ studentId, enrollmentId, newBatchId, courseId });
    },
    toggleStudentStatus: (studentId: string) => {
      const student = adminState.students.find((s) => s.id === studentId);
      const isCurrentlyActive = student?.status === "Active";
      setStudentStatusMutation.mutate({ studentId, isActive: !isCurrentlyActive });
    },

    updateAdminProfile: async (updates: Partial<{ name: string; email: string; phone?: string; designation?: string }>) => {
      if (updates.name && updates.email) {
        return updateProfileMutation.mutateAsync({
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          designation: updates.designation,
        });
      } else {
        adminState.updateAdminProfile(updates);
      }
    },

    changePassword: async (oldPassword: string, newPassword: string) => {
      return changePasswordMutation.mutateAsync({ oldPassword, newPassword });
    },

    logout: () => {
      logoutMutation.mutate();
    },

    mutations: {
      changePassword: changePasswordMutation,
      updateProfile: updateProfileMutation,
      logout: logoutMutation,
    },
  };
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
