import { apiClient } from "./client";

/**
 * Standard Backend Response Envelope
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * 1. Admin Auth & Profile Types
 */
export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginResponseData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    mustChangePassword?: boolean;
  };
  token: string;
}

export interface AdminProfileData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  mustChangePassword?: boolean;
}

/**
 * 2. Courses Types
 */
export interface BackendCourse {
  _id: string;
  name: string;
  slug?: string;
  description: string;
  ageGroup: string;
  isActive: boolean;
  isPinned: boolean;
  monthlyFee?: string;
  imageSrc?: string;
  imageUrl?: string;
  image?: string;
  batchCount?: number;
  studentCount?: number;
}

export interface CourseListResponseData {
  courses: BackendCourse[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateCoursePayload {
  name: string;
  description: string;
  ageGroup: string;
  isActive: boolean;
  isPinned: boolean;
  monthlyFee?: string;
  imageSrc?: string;
  imageUrl?: string;
  image?: string;
}

export interface UpdateCoursePayload {
  name?: string;
  description?: string;
  ageGroup?: string;
  isActive?: boolean;
  isPinned?: boolean;
  monthlyFee?: string;
  imageSrc?: string;
  imageUrl?: string;
  image?: string;
}

/**
 * 3. Batches Types
 */
export interface BatchScheduleSlot {
  dayOfWeek: number; // 0=Sunday, 1=Monday, ... 6=Saturday
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

export interface BackendBatch {
  _id: string;
  name: string;
  courseId:
    | string
    | {
        _id: string;
        name: string;
        slug?: string;
      };
  teacherName: string;
  meetingLink: string;
  capacity: number;
  status: "active" | "inactive";
  enrolledCount?: number;
  schedule?: BatchScheduleSlot[];
}

export interface CreateBatchPayload {
  courseId: string;
  name: string;
  teacherName: string;
  meetingLink: string;
  capacity: number;
  status: "active" | "inactive";
  schedule: BatchScheduleSlot[];
}

export interface UpdateBatchPayload {
  name?: string;
  teacherName?: string;
  meetingLink?: string;
  capacity?: number;
  status?: "active" | "inactive";
  schedule?: BatchScheduleSlot[];
}

/**
 * 4. Notices Types
 */
export interface BackendNotice {
  _id: string;
  title: string;
  category: "urgent" | "holiday" | "exam" | "new_batch" | "general";
  description: string;
  pdfUrl?: string;
  showOnTicker: boolean;
  isActive: boolean;
  publishedAt?: string;
}

export interface NoticeListResponseData {
  notices: BackendNotice[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateNoticePayload {
  title: string;
  category: "urgent" | "holiday" | "exam" | "new_batch" | "general";
  description: string;
  showOnTicker: boolean;
  isActive?: boolean;
  pdfUrl?: string;
  pdfAttachment?: string;
}

/**
 * 5. Admissions Types
 */
export interface BackendAdmission {
  _id: string;
  name: string;
  phone: string;
  email: string;
  guardianName: string;
  address?: string;
  dob?: string;
  courseId: {
    _id: string;
    name: string;
    slug?: string;
  } | string;
  status: "pending" | "approved" | "rejected";
  rejectReason?: string;
  createdAt: string;
}

export interface AdmissionListResponseData {
  admissions: BackendAdmission[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApproveAdmissionResponseData {
  studentId: string;
  loginId: string;
  temporaryPassword?: string;
  name: string;
  isExistingUser: boolean;
  batchName: string;
}

/**
 * 6. Students Types
 */
export interface BackendStudentEnrollment {
  _id: string;
  courseName: string;
  batchName: string;
  status: string;
}

export interface BackendStudent {
  _id: string;
  name: string;
  loginId: string;
  email: string;
  phone: string;
  isActive: boolean;
  mustChangePassword?: boolean;
  profile?: {
    guardianName?: string;
    address?: string;
    dob?: string;
  };
  enrollments: BackendStudentEnrollment[];
}

export interface StudentListResponseData {
  students: BackendStudent[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Admin API Endpoints Service
 */
export const adminApi = {
  // Auth & Profile
  login: (data: AdminLoginPayload) =>
    apiClient<ApiResponse<AdminLoginResponseData>>("/api/admin/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiClient<ApiResponse<void>>("/api/admin/logout", {
      method: "POST",
    }),

  getMe: () =>
    apiClient<ApiResponse<AdminProfileData>>("/api/admin/me", {
      method: "GET",
    }),

  updatePassword: (passwords: { oldPassword: string; newPassword: string }) =>
    apiClient<ApiResponse<void>>("/api/admin/password", {
      method: "PATCH",
      body: JSON.stringify(passwords),
    }),

  updateProfile: (profile: { name: string; email: string; phone?: string }) =>
    apiClient<ApiResponse<any>>("/api/admin/profile", {
      method: "PATCH",
      body: JSON.stringify(profile),
    }),

  // Courses
  getCourses: (params?: { search?: string; isActive?: boolean; page?: number; limit?: number }) =>
    apiClient<ApiResponse<CourseListResponseData>>("/api/admin/courses", {
      method: "GET",
      params,
    }),

  getCourseById: (id: string) =>
    apiClient<ApiResponse<BackendCourse>>(`/api/admin/courses/${id}`, {
      method: "GET",
    }),

  createCourse: (data: CreateCoursePayload) =>
    apiClient<ApiResponse<BackendCourse>>("/api/admin/courses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCourse: (id: string, data: UpdateCoursePayload) =>
    apiClient<ApiResponse<BackendCourse>>(`/api/admin/courses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteCourse: (id: string) =>
    apiClient<ApiResponse<void>>(`/api/admin/courses/${id}`, {
      method: "DELETE",
    }),

  // Batches
  getBatches: (params?: { courseId?: string; status?: "active" | "inactive" }) =>
    apiClient<ApiResponse<BackendBatch[]>>("/api/admin/batches", {
      method: "GET",
      params,
    }),

  getBatchById: (id: string) =>
    apiClient<ApiResponse<BackendBatch>>(`/api/admin/batches/${id}`, {
      method: "GET",
    }),

  createBatch: (data: CreateBatchPayload) =>
    apiClient<ApiResponse<BackendBatch>>("/api/admin/batches", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateBatch: (id: string, data: UpdateBatchPayload) =>
    apiClient<ApiResponse<BackendBatch>>(`/api/admin/batches/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteBatch: (id: string) =>
    apiClient<ApiResponse<void>>(`/api/admin/batches/${id}`, {
      method: "DELETE",
    }),

  // Notices
  getNotices: (params?: {
    category?: string;
    showOnTicker?: boolean;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) =>
    apiClient<ApiResponse<NoticeListResponseData>>("/api/admin/notices", {
      method: "GET",
      params,
    }),

  createNotice: (data: CreateNoticePayload | FormData) => {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    return apiClient<ApiResponse<BackendNotice>>("/api/admin/notices", {
      method: "POST",
      isFormData,
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  updateNotice: (id: string, data: Partial<CreateNoticePayload> | FormData) => {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    return apiClient<ApiResponse<BackendNotice>>(`/api/admin/notices/${id}`, {
      method: "PATCH",
      isFormData,
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  deleteNotice: (id: string) =>
    apiClient<ApiResponse<void>>(`/api/admin/notices/${id}`, {
      method: "DELETE",
    }),

  // Admissions
  getAdmissions: (params?: {
    status?: "pending" | "approved" | "rejected";
    search?: string;
    page?: number;
    limit?: number;
  }) =>
    apiClient<ApiResponse<AdmissionListResponseData>>("/api/admin/admissions", {
      method: "GET",
      params,
    }),

  getAdmissionById: (id: string) =>
    apiClient<ApiResponse<BackendAdmission>>(`/api/admin/admissions/${id}`, {
      method: "GET",
    }),

  approveAdmission: (id: string, batchId: string) =>
    apiClient<ApiResponse<ApproveAdmissionResponseData>>(`/api/admin/admissions/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ batchId }),
    }),

  rejectAdmission: (id: string, reason: string) =>
    apiClient<ApiResponse<any>>(`/api/admin/admissions/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  // Students
  getStudents: (params?: {
    search?: string;
    courseId?: string;
    batchId?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) =>
    apiClient<ApiResponse<StudentListResponseData>>("/api/admin/students", {
      method: "GET",
      params,
    }),

  getStudentById: (id: string) =>
    apiClient<ApiResponse<BackendStudent>>(`/api/admin/students/${id}`, {
      method: "GET",
    }),

  updateStudent: (id: string, data: Record<string, any>) =>
    apiClient<ApiResponse<BackendStudent>>(`/api/admin/students/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  transferStudentBatch: (id: string, enrollmentId: string, newBatchId: string) =>
    apiClient<ApiResponse<any>>(`/api/admin/students/${id}/batch`, {
      method: "PATCH",
      body: JSON.stringify({ enrollmentId, newBatchId }),
    }),

  setStudentStatus: (id: string, isActive: boolean) =>
    apiClient<ApiResponse<any>>(`/api/admin/students/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    }),

  resetStudentPassword: (id: string) =>
    apiClient<ApiResponse<{ loginId: string; temporaryPassword: string; mustChangePassword: boolean }>>(
      `/api/admin/students/${id}/reset-password`,
      {
        method: "POST",
        body: JSON.stringify({}),
      }
    ),
};
