"use client";

import * as React from "react";
import { useStudentStore } from "./stores/student-store";
import { useUIStore, ToastMessage } from "./stores/ui-store";
import {
  useStudentMeQuery,
  useStudentDashboardQuery,
  useStudentCoursesQuery,
  useStudentBatchesQuery,
  useStudentNoticesQuery,
  useStudentProfileQuery,
  useStudentLoginMutation,
  useStudentLogoutMutation,
  useStudentUpdatePasswordMutation,
} from "./api/student-queries";
import { StudentBatch, StudentCourse, StudentNotice, StudentProfileData } from "./student-data";

export type { ToastMessage };

/**
 * useStudent hook with React Query API Integration & Zustand Store
 * Fetches real data from the backend student endpoints, updates store, and manages toasts.
 */
export function useStudent() {
  const studentState = useStudentStore();
  const toasts = useUIStore((s) => s.toasts);
  const addToast = useUIStore((s) => s.addToast);
  const removeToast = useUIStore((s) => s.removeToast);

  // Queries
  const meQuery = useStudentMeQuery();
  const dashboardQuery = useStudentDashboardQuery();
  const coursesQuery = useStudentCoursesQuery();
  const batchesQuery = useStudentBatchesQuery();
  const noticesQuery = useStudentNoticesQuery();
  const profileQuery = useStudentProfileQuery();

  // Mutations
  const loginMutation = useStudentLoginMutation();
  const logoutMutation = useStudentLogoutMutation();
  const updatePasswordMutation = useStudentUpdatePasswordMutation();

  // Reactive data
  const student: StudentProfileData = profileQuery.data ?? studentState.student;
  const courses: StudentCourse[] = coursesQuery.data ?? studentState.courses;
  const batches: StudentBatch[] = batchesQuery.data ?? studentState.batches;
  const notices: StudentNotice[] = (noticesQuery.data as any)?.notices ?? studentState.notices;

  // Today classes: memoize computation to avoid creating new array references on every render
  const todayClasses: StudentBatch[] = React.useMemo(() => {
    if (dashboardQuery.data?.todaysClasses && dashboardQuery.data.todaysClasses.length > 0) {
      return dashboardQuery.data.todaysClasses;
    }
    if (studentState.showNoClassTodayDemo) return [];

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const todayName = days[new Date().getDay()];

    return batches.filter((b) =>
      b.schedule.some((slot) => slot.day === todayName || slot.day === "Monday")
    );
  }, [dashboardQuery.data?.todaysClasses, batches, studentState.showNoClassTodayDemo]);

  return {
    ...studentState,
    student,
    courses,
    batches,
    notices,
    todayClasses,
    dashboardData: dashboardQuery.data,
    toasts,
    addToast,
    removeToast,

    // Loading & Error states
    isLoading:
      dashboardQuery.isLoading ||
      coursesQuery.isLoading ||
      batchesQuery.isLoading ||
      noticesQuery.isLoading ||
      profileQuery.isLoading,
    isError:
      dashboardQuery.isError ||
      coursesQuery.isError ||
      batchesQuery.isError ||
      noticesQuery.isError ||
      profileQuery.isError,

    // Queries object & Refetch
    queries: {
      me: meQuery,
      dashboard: dashboardQuery,
      courses: coursesQuery,
      batches: batchesQuery,
      notices: noticesQuery,
      profile: profileQuery,
    },
    refetchAll: () => {
      meQuery.refetch();
      dashboardQuery.refetch();
      coursesQuery.refetch();
      batchesQuery.refetch();
      noticesQuery.refetch();
      profileQuery.refetch();
    },

    // Mutation actions
    loginMutation,
    logoutMutation,
    updatePasswordMutation,
    logout: () => logoutMutation.mutate(),
    changePassword: (oldPassword: string, newPassword: string) => {
      updatePasswordMutation.mutate({ oldPassword, newPassword });
    },
  };
}

export function StudentProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
