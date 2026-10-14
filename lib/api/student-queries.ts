import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  studentApi,
  StudentLoginPayload,
  StudentUpdatePasswordPayload,
} from "./student-api";
import {
  adaptBackendStudentCourse,
  adaptBackendStudentBatch,
  adaptBackendTodayClass,
  adaptBackendStudentNotice,
  adaptBackendStudentProfile,
} from "./student-adapters";
import { useStudentStore } from "../stores/student-store";
import { useUIStore } from "../stores/ui-store";
import {
  StudentBatch,
  StudentCourse,
  StudentNotice,
  StudentProfileData,
} from "../student-data";
import {
  setStudentAuthToken,
  clearStudentAuthToken,
  getStudentAuthToken,
} from "./client";

export const studentQueryKeys = {
  me: ["student", "me"] as const,
  dashboard: ["student", "dashboard"] as const,
  courses: ["student", "courses"] as const,
  batches: ["student", "batches"] as const,
  notices: (params?: any) => ["student", "notices", params] as const,
  notice: (id: string) => ["student", "notice", id] as const,
  profile: ["student", "profile"] as const,
};

function hasStudentToken(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(getStudentAuthToken());
}

/**
 * 1. Session & Identity Query
 */
export function useStudentMeQuery() {
  const setStudent = useStudentStore((s) => s.setStudent);
  const setMustChangePassword = useStudentStore((s) => s.setMustChangePassword);

  return useQuery({
    queryKey: studentQueryKeys.me,
    queryFn: async () => {
      try {
        const token = getStudentAuthToken();
        if (!token) return null;

        const res = await studentApi.getMe();
        const data = (res as any)?.data || res;
        if (data && (data.name || data.loginId)) {
          setMustChangePassword(Boolean(data.mustChangePassword));
          const current = useStudentStore.getState().student;
          setStudent({
            ...current,
            name: data.name || current.name,
            rollNumber: data.loginId || current.rollNumber,
          });
          return data;
        }
      } catch (err: any) {
        // Not authenticated
      }
      return null;
    },
    enabled: hasStudentToken(),
    refetchOnMount: true,
    retry: false,
  });
}

/**
 * 2. Login & Session Mutations
 */
export function useStudentLoginMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const setStudent = useStudentStore((s) => s.setStudent);
  const setMustChangePassword = useStudentStore((s) => s.setMustChangePassword);

  return useMutation({
    mutationFn: async (credentials: StudentLoginPayload) => {
      const res = await studentApi.login(credentials);
      const token = res.token || res.data?.token;
      if (token) {
        setStudentAuthToken(token, Boolean(credentials.remember));
      }
      return res;
    },
    onSuccess: (res) => {
      const data = res.data;
      if (data) {
        setMustChangePassword(Boolean(data.mustChangePassword));
        const current = useStudentStore.getState().student;
        setStudent({
          ...current,
          name: data.name || "Student",
          rollNumber: data.loginId || "—",
        });
      }

      addToast("Signed in successfully.", "success");
      queryClient.invalidateQueries({ queryKey: ["student"] });

      if (typeof window !== "undefined") {
        if (!data?.mustChangePassword) {
          window.location.href = "/student";
        }
      }
    },
    onError: (err: any) => {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Failed to sign in. Please check your credentials.";
      addToast(msg, "error");
    },
  });
}

export function useStudentLogoutMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: async () => {
      try {
        await studentApi.logout();
      } catch (e) {
        // Ignore network errors on logout
      }
      clearStudentAuthToken();
    },
    onSuccess: () => {
      addToast("Logged out successfully.", "info");
      queryClient.clear();
      if (typeof window !== "undefined") {
        window.location.href = "/student/login";
      }
    },
  });
}

export function useStudentUpdatePasswordMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const setMustChangePassword = useStudentStore((s) => s.setMustChangePassword);

  return useMutation({
    mutationFn: async (payload: StudentUpdatePasswordPayload) => {
      return studentApi.updatePassword(payload);
    },
    onSuccess: () => {
      setMustChangePassword(false);
      addToast("Password updated successfully. Full access unlocked.", "success");
      queryClient.invalidateQueries({ queryKey: ["student"] });
    },
    onError: (err: any) => {
      const msg = err?.data?.message || err?.message || "Failed to update password.";
      addToast(msg, "error");
    },
  });
}

/**
 * 3. Student Dashboard Query
 */
export function useStudentDashboardQuery() {
  const setNotices = useStudentStore((s) => s.setNotices);
  const localBatches = useStudentStore((s) => s.batches);
  const localNotices = useStudentStore((s) => s.notices);

  return useQuery({
    queryKey: studentQueryKeys.dashboard,
    queryFn: async () => {
      try {
        const res = await studentApi.getDashboard();
        const data = (res as any)?.data || res;
        if (data) {
          const todaysClasses: StudentBatch[] = (data.todaysClasses || []).map(
            (tc: any, idx: number) => adaptBackendTodayClass(tc, idx)
          );
          const latestNotices: StudentNotice[] = (data.latestNotices || []).map(
            (n: any, idx: number) => adaptBackendStudentNotice(n, idx)
          );

          if (latestNotices.length > 0) {
            setNotices(latestNotices);
          }
          return {
            todaysClasses,
            latestNotices,
          };
        }
      } catch (err: any) {
        console.warn("Unable to fetch student dashboard:", err?.message);
      }
      return {
        todaysClasses: localBatches,
        latestNotices: localNotices.slice(0, 3),
      };
    },
    enabled: hasStudentToken(),
    refetchOnMount: true,
  });
}

/**
 * 4. Enrolled Courses Query
 */
export function useStudentCoursesQuery() {
  const setCourses = useStudentStore((s) => s.setCourses);
  const localCourses = useStudentStore((s) => s.courses);

  return useQuery<StudentCourse[]>({
    queryKey: studentQueryKeys.courses,
    queryFn: async (): Promise<StudentCourse[]> => {
      try {
        const res = await studentApi.getCourses();
        const rawList = Array.isArray((res as any)?.data)
          ? (res as any).data
          : Array.isArray(res)
          ? (res as any)
          : null;

        if (rawList !== null) {
          const adapted = rawList.map(adaptBackendStudentCourse);
          setCourses(adapted);
          return adapted;
        }
      } catch (err: any) {
        console.warn("Unable to fetch enrolled courses:", err?.message);
      }
      return localCourses;
    },
    enabled: hasStudentToken(),
    placeholderData: () => localCourses,
    refetchOnMount: true,
  });
}

/**
 * 5. Batches & Schedules Query
 */
export function useStudentBatchesQuery() {
  const setBatches = useStudentStore((s) => s.setBatches);
  const localBatches = useStudentStore((s) => s.batches);

  return useQuery<StudentBatch[]>({
    queryKey: studentQueryKeys.batches,
    queryFn: async (): Promise<StudentBatch[]> => {
      try {
        const res = await studentApi.getBatches();
        const rawList = Array.isArray((res as any)?.data)
          ? (res as any).data
          : Array.isArray(res)
          ? (res as any)
          : null;

        if (rawList !== null) {
          const adapted = rawList.map(adaptBackendStudentBatch);
          setBatches(adapted);
          return adapted;
        }
      } catch (err: any) {
        console.warn("Unable to fetch student batches:", err?.message);
      }
      return localBatches;
    },
    enabled: hasStudentToken(),
    placeholderData: () => localBatches,
    refetchOnMount: true,
  });
}

/**
 * 6. Notices Query
 */
export function useStudentNoticesQuery(params?: { category?: string; page?: number; limit?: number }) {
  const setNotices = useStudentStore((s) => s.setNotices);
  const localNotices = useStudentStore((s) => s.notices);

  return useQuery({
    queryKey: studentQueryKeys.notices(params),
    queryFn: async () => {
      try {
        const res = await studentApi.getNotices(params);
        const data = (res as any)?.data || res;
        const rawList = Array.isArray(data?.notices)
          ? data.notices
          : Array.isArray(data)
          ? data
          : null;

        if (rawList !== null) {
          const adapted = rawList.map(adaptBackendStudentNotice);
          setNotices(adapted);
          return {
            notices: adapted,
            pagination: data?.pagination || { total: adapted.length, page: 1, limit: 20, totalPages: 1 },
          };
        }
      } catch (err: any) {
        console.warn("Unable to fetch student notices:", err?.message);
      }
      return {
        notices: localNotices,
        pagination: { total: localNotices.length, page: 1, limit: 20, totalPages: 1 },
      };
    },
    enabled: hasStudentToken(),
    placeholderData: () => ({
      notices: localNotices,
      pagination: { total: localNotices.length, page: 1, limit: 20, totalPages: 1 },
    }),
    refetchOnMount: true,
  });
}

/**
 * 7. Student Profile Query
 */
export function useStudentProfileQuery() {
  const setStudent = useStudentStore((s) => s.setStudent);
  const localStudent = useStudentStore((s) => s.student);

  return useQuery<StudentProfileData>({
    queryKey: studentQueryKeys.profile,
    queryFn: async (): Promise<StudentProfileData> => {
      try {
        const res = await studentApi.getProfile();
        const data = (res as any)?.data || res;
        if (data) {
          const adapted = adaptBackendStudentProfile(data);
          setStudent(adapted);
          return adapted;
        }
      } catch (err: any) {
        console.warn("Unable to fetch student profile:", err?.message);
      }
      return localStudent;
    },
    enabled: hasStudentToken(),
    placeholderData: () => localStudent,
    refetchOnMount: true,
  });
}
