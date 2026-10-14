import { apiClient, ApiResponse } from "./client";

/**
 * 1. Authentication & Profile Types
 */
export interface StudentLoginPayload {
  studentId: string;
  password: string;
  remember?: boolean;
}

export interface StudentLoginResponseData {
  name: string;
  loginId: string;
  mustChangePassword: boolean;
  token?: string;
}

export interface StudentMeResponseData {
  name: string;
  loginId: string;
  mustChangePassword: boolean;
}

export interface StudentUpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

/**
 * 2. Dashboard Types
 */
export interface BackendTodayClass {
  courseName: string;
  batchName: string;
  teacherName?: string | null;
  teacher?: string | null;
  startTime: string;
  endTime: string;
  meetingLink: string | null;
  canJoin: boolean;
}

export interface BackendStudentNoticeSummary {
  _id: string;
  title: string;
  category: "urgent" | "holiday" | "exam" | "new_batch" | "general";
  description?: string;
  pdfUrl?: string;
  publishedAt: string;
}

export interface StudentDashboardResponseData {
  todaysClasses: BackendTodayClass[];
  latestNotices: BackendStudentNoticeSummary[];
}

/**
 * 3. Enrolled Courses Types
 */
export interface BackendStudentCourseEnrollment {
  enrollmentId: string;
  status: string;
  startDate: string;
  batchName: string | null;
  course: {
    id?: string;
    _id?: string;
    name: string;
    slug?: string;
    description?: string;
    ageGroup?: string;
  } | null;
}

/**
 * 4. Batches Types
 */
export interface BackendStudentBatchSlot {
  dayOfWeek: number; // 0=Sunday, 1=Monday, ... 6=Saturday
  startTime: string;
  endTime: string;
}

export interface BackendStudentBatch {
  enrollmentId?: string;
  _id?: string;
  batchId?: string;
  name: string;
  courseName: string;
  courseSlug?: string | null;
  teacherName: string | null;
  meetingLink: string | null;
  schedule: BackendStudentBatchSlot[];
  canJoin: boolean;
  nextClass?: BackendStudentBatchSlot | null;
}

/**
 * 5. Notices Types
 */
export interface BackendStudentNotice {
  _id: string;
  title: string;
  category: "urgent" | "holiday" | "exam" | "new_batch" | "general";
  description?: string;
  pdfUrl?: string;
  showOnTicker?: boolean;
  publishedAt: string;
}

export interface StudentNoticesResponseData {
  notices: BackendStudentNotice[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * 6. Profile Types
 */
export interface BackendStudentProfile {
  id?: string;
  _id?: string;
  name: string;
  studentId?: string;
  loginId?: string;
  phone: string | null;
  email: string | null;
  guardianName: string | null;
  address: string | null;
  dob: string | null;
  program?: string;
  academicYear?: string;
}

/**
 * Student API Service
 */
export const studentApi = {
  // 1. Auth & Session
  login: (data: StudentLoginPayload) =>
    apiClient<{
      success: boolean;
      message?: string;
      data: StudentLoginResponseData;
      token?: string;
    }>("/api/student/login", {
      method: "POST",
      body: JSON.stringify({
        studentId: data.studentId.trim(),
        password: data.password,
      }),
      role: "student",
    }),

  logout: () =>
    apiClient<ApiResponse<void>>("/api/student/logout", {
      method: "POST",
      role: "student",
    }),

  updatePassword: (data: StudentUpdatePasswordPayload) =>
    apiClient<{ success: boolean; message: string; data?: { mustChangePassword: boolean } }>(
      "/api/student/password",
      {
        method: "PATCH",
        body: JSON.stringify(data),
        role: "student",
      }
    ),

  getMe: () =>
    apiClient<ApiResponse<StudentMeResponseData>>("/api/student/me", {
      method: "GET",
      role: "student",
    }),

  // 2. Student Panel Data
  getDashboard: () =>
    apiClient<ApiResponse<StudentDashboardResponseData>>("/api/student/dashboard", {
      method: "GET",
      role: "student",
    }),

  getCourses: () =>
    apiClient<ApiResponse<BackendStudentCourseEnrollment[]>>("/api/student/courses", {
      method: "GET",
      role: "student",
    }),

  getBatches: () =>
    apiClient<ApiResponse<BackendStudentBatch[]>>("/api/student/batches", {
      method: "GET",
      role: "student",
    }),

  getNotices: (params?: { category?: string; page?: number; limit?: number }) =>
    apiClient<ApiResponse<StudentNoticesResponseData>>("/api/student/notices", {
      method: "GET",
      params,
      role: "student",
    }),

  getNoticeById: (id: string) =>
    apiClient<ApiResponse<BackendStudentNotice>>(`/api/student/notices/${id}`, {
      method: "GET",
      role: "student",
    }),

  getProfile: () =>
    apiClient<ApiResponse<BackendStudentProfile>>("/api/student/profile", {
      method: "GET",
      role: "student",
    }),
};
