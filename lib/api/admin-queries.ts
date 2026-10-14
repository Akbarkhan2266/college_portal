import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, CreateCoursePayload, UpdateCoursePayload, CreateBatchPayload, UpdateBatchPayload, CreateNoticePayload } from "./admin-api";
import {
  adaptBackendCourse,
  adaptBackendBatch,
  adaptBackendNotice,
  adaptBackendAdmission,
  adaptBackendStudent,
  DAY_REVERSE_MAP,
} from "./adapters";
import { AdminCourse, AdminBatch, AdminNotice, AdminStudent, AdminAdmissionRequest } from "../admin-data";
import { useAdminStore } from "../stores/admin-store";
import { useUIStore } from "../stores/ui-store";
import { setAuthToken, clearAuthToken, getAuthToken } from "./client";

export const adminQueryKeys = {
  me: ["admin", "me"] as const,
  courses: (params?: any) => ["admin", "courses", params] as const,
  batches: (params?: any) => ["admin", "batches", params] as const,
  notices: (params?: any) => ["admin", "notices", params] as const,
  admissions: (params?: any) => ["admin", "admissions", params] as const,
  students: (params?: any) => ["admin", "students", params] as const,
};

function hasAdminToken(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(getAuthToken());
}

/**
 * 1. Admin Auth & Profile Hooks
 */
export function useAdminMeQuery() {
  const updateAdminProfile = useAdminStore((s) => s.updateAdminProfile);
  const adminUser = useAdminStore((s) => s.adminUser);

  return useQuery({
    queryKey: adminQueryKeys.me,
    queryFn: async () => {
      try {
        const token = getAuthToken();
        if (!token) return null;

        const res = await adminApi.getMe();
        const user = (res.data as any)?.user || res.data;
        if (user && (user.name || user.email)) {
          updateAdminProfile({
            name: user.name,
            email: user.email,
            role: user.role || "Admin",
          });
          return user;
        }
      } catch (err: any) {
        if (err?.status === 401 || err?.status === 403) {
          clearAuthToken();
          throw err;
        }
        // Network error / server offline: fallback to local admin
      }
      return adminUser;
    },
    enabled: hasAdminToken(),
    placeholderData: () => adminUser,
    refetchOnMount: true,
    retry: false,
  });
}

export function useAdminLoginMutation() {
  const queryClient = useQueryClient();
  const updateAdminProfile = useAdminStore((s) => s.updateAdminProfile);
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string; remember?: boolean }) => {
      const res = await adminApi.login({
        email: credentials.email,
        password: credentials.password,
      });
      if (res.data?.token) {
        setAuthToken(res.data.token, credentials.remember ?? true);
      }
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.user) {
        updateAdminProfile({
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        });
      }
      addToast("Signed in successfully.", "success");
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.me });
    },
    onError: (err: any) => {
      addToast(err?.message || "Failed to sign in. Please verify your credentials.", "error");
    },
  });
}

export function useAdminLogoutMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: async () => {
      try {
        await adminApi.logout();
      } catch (e) {
        // Ignore network errors on logout
      }
      clearAuthToken();
    },
    onSuccess: () => {
      addToast("Logged out successfully.", "info");
      queryClient.clear();
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
    },
  });
}

export function useAdminChangePasswordMutation() {
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: async (payload: { oldPassword: string; newPassword: string }) => {
      return adminApi.updatePassword(payload);
    },
    onSuccess: () => {
      addToast("Password changed successfully.", "success");
    },
    onError: (err: any) => {
      addToast(err?.message || "Failed to update password.", "error");
    },
  });
}

export function useAdminUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const updateAdminProfile = useAdminStore((s) => s.updateAdminProfile);
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: async (payload: { name: string; email: string; phone?: string; designation?: string }) => {
      const res = await adminApi.updateProfile({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      updateAdminProfile({
        name: variables.name,
        email: variables.email,
        phone: variables.phone,
        designation: variables.designation,
      });
      addToast("Profile updated successfully.", "success");
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.me });
    },
    onError: (err: any) => {
      addToast(err?.message || "Failed to update profile.", "error");
    },
  });
}

/**
 * 2. Courses Hooks
 */
export function useCoursesQuery(params?: { search?: string; isActive?: boolean }) {
  const localCourses = useAdminStore((s) => s.courses);
  const setCourses = useAdminStore((s) => s.setCourses);

  return useQuery<AdminCourse[]>({
    queryKey: adminQueryKeys.courses(params),
    queryFn: async (): Promise<AdminCourse[]> => {
      try {
        const res = await adminApi.getCourses(params);
        const rawList = Array.isArray(res.data)
          ? res.data
          : Array.isArray((res.data as any)?.courses)
          ? (res.data as any).courses
          : Array.isArray((res.data as any)?.data?.courses)
          ? (res.data as any).data.courses
          : null;
        if (rawList !== null) {
          const adapted = rawList.map(adaptBackendCourse);
          setCourses(adapted);
          return adapted;
        }
      } catch (err: any) {
        if (err?.status === 401 || err?.status === 403) {
          return localCourses;
        }
        // Fallback to local store on network error
        console.warn("Backend API unavailable, using local store for courses:", err);
      }
      return localCourses;
    },
    enabled: hasAdminToken(),
    placeholderData: () => localCourses,
    refetchOnMount: true,
  });
}

import { saveCourseMeta } from "./course-meta";

export function useCreateCourseMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const localAdd = useAdminStore((s) => s.addCourse);

  return useMutation({
    mutationFn: async (courseData: Omit<AdminCourse, "id" | "createdAt">) => {
      const imgVal = courseData.imageUrl || courseData.image || courseData.imageSrc || "";
      saveCourseMeta(courseData.name, {
        monthlyFee: courseData.monthlyFee,
        imageSrc: imgVal,
        imageUrl: imgVal,
        image: imgVal,
      });
      try {
        const payload: CreateCoursePayload = {
          name: courseData.name,
          description: courseData.description,
          ageGroup: courseData.ageGroup,
          isActive: courseData.status === "Active",
          isPinned: courseData.isPinned,
          monthlyFee: courseData.monthlyFee,
          imageUrl: imgVal,
          image: imgVal,
          imageSrc: imgVal,
        };
        const res = await adminApi.createCourse(payload);
        return adaptBackendCourse(res.data);
      } catch (err: any) {
        // Fallback to local store
        localAdd(courseData);
        throw err;
      }
    },
    onSuccess: (newCourse, variables) => {
      const fee = variables.monthlyFee || newCourse.monthlyFee;
      const img =
        variables.imageUrl ||
        variables.image ||
        variables.imageSrc ||
        newCourse.imageUrl ||
        newCourse.image ||
        newCourse.imageSrc;
      if (newCourse?.id) {
        saveCourseMeta(newCourse.id, {
          monthlyFee: fee,
          imageSrc: img,
          imageUrl: img,
          image: img,
        });
      }
      if (newCourse?.name) {
        saveCourseMeta(newCourse.name, {
          monthlyFee: fee,
          imageSrc: img,
          imageUrl: img,
          image: img,
        });
        localAdd({
          name: newCourse.name,
          description: newCourse.description,
          ageGroup: newCourse.ageGroup,
          status: newCourse.status,
          isPinned: newCourse.isPinned,
          monthlyFee: fee,
          imageSrc: img,
          imageUrl: img,
          image: img,
        });
      }
      addToast(`Course "${newCourse.name}" created successfully.`, "success");
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
      queryClient.invalidateQueries({ queryKey: ["public", "courses"] });
    },
    onError: (err: any) => {
      addToast(err?.message || "Error creating course.", "error");
    },
  });
}

export function useUpdateCourseMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const localUpdate = useAdminStore((s) => s.updateCourse);

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AdminCourse> }) => {
      const imgVal =
        updates.imageUrl !== undefined
          ? updates.imageUrl
          : updates.image !== undefined
          ? updates.image
          : updates.imageSrc;

      if (imgVal !== undefined) {
        saveCourseMeta(id, {
          monthlyFee: updates.monthlyFee,
          imageSrc: imgVal,
          imageUrl: imgVal,
          image: imgVal,
        });
        if (updates.name) {
          saveCourseMeta(updates.name, {
            monthlyFee: updates.monthlyFee,
            imageSrc: imgVal,
            imageUrl: imgVal,
            image: imgVal,
          });
        }
      }
      try {
        const payload: UpdateCoursePayload = {
          ...(updates.name && { name: updates.name }),
          ...(updates.description && { description: updates.description }),
          ...(updates.ageGroup && { ageGroup: updates.ageGroup }),
          ...(updates.status !== undefined && { isActive: updates.status === "Active" }),
          ...(updates.isPinned !== undefined && { isPinned: updates.isPinned }),
          ...(updates.monthlyFee !== undefined && { monthlyFee: updates.monthlyFee }),
          ...(imgVal !== undefined && {
            imageUrl: imgVal,
            image: imgVal,
            imageSrc: imgVal,
          }),
        };
        const res = await adminApi.updateCourse(id, payload);
        return adaptBackendCourse(res.data);
      } catch (err: any) {
        localUpdate(id, updates);
        throw err;
      }
    },
    onSuccess: (_, { id, updates }) => {
      const imgVal =
        updates.imageUrl !== undefined
          ? updates.imageUrl
          : updates.image !== undefined
          ? updates.image
          : updates.imageSrc;
      saveCourseMeta(id, {
        monthlyFee: updates.monthlyFee,
        imageSrc: imgVal,
        imageUrl: imgVal,
        image: imgVal,
      });
      if (updates.name) {
        saveCourseMeta(updates.name, {
          monthlyFee: updates.monthlyFee,
          imageSrc: imgVal,
          imageUrl: imgVal,
          image: imgVal,
        });
      }
      localUpdate(id, updates);
      addToast("Course updated successfully.", "success");
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
      queryClient.invalidateQueries({ queryKey: ["public", "courses"] });
    },
    onError: (err: any) => {
      addToast(err?.message || "Failed to update course.", "error");
    },
  });
}

export function useDeleteCourseMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const localDelete = useAdminStore((s) => s.deleteCourse);

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await adminApi.deleteCourse(id);
      } catch (err: any) {
        localDelete(id);
        throw err;
      }
    },
    onSuccess: (_, id) => {
      localDelete(id);
      addToast("Course deleted successfully.", "info");
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
      queryClient.invalidateQueries({ queryKey: ["public", "courses"] });
    },
    onError: (err: any) => {
      addToast(err?.message || "Cannot delete course (active batches or students exist).", "error");
    },
  });
}

/**
 * 3. Batches Hooks
 */
export function useBatchesQuery(params?: { courseId?: string; status?: "active" | "inactive" }) {
  const localBatches = useAdminStore((s) => s.batches);
  const setBatches = useAdminStore((s) => s.setBatches);

  return useQuery<AdminBatch[]>({
    queryKey: adminQueryKeys.batches(params),
    queryFn: async (): Promise<AdminBatch[]> => {
      try {
        const res = await adminApi.getBatches(params);
        const rawList = Array.isArray(res.data)
          ? res.data
          : Array.isArray((res.data as any)?.batches)
          ? (res.data as any).batches
          : Array.isArray((res.data as any)?.data)
          ? (res.data as any).data
          : null;
        if (rawList !== null) {
          const adapted = rawList.map(adaptBackendBatch);
          setBatches(adapted);
          return adapted;
        }
      } catch (err: any) {
        if (err?.status === 401 || err?.status === 403) {
          return localBatches;
        }
        console.warn("Backend API unavailable, using local store for batches:", err);
      }
      return localBatches;
    },
    enabled: hasAdminToken(),
    placeholderData: () => localBatches,
    refetchOnMount: true,
  });
}

export function useCreateBatchMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const localAdd = useAdminStore((s) => s.addBatch);

  return useMutation({
    mutationFn: async (batchData: Omit<AdminBatch, "id" | "createdAt" | "courseName">) => {
      try {
        const payload: CreateBatchPayload = {
          courseId: batchData.courseId,
          name: batchData.name,
          teacherName: batchData.teacherName,
          meetingLink: batchData.meetingLink,
          capacity: batchData.capacity,
          status: batchData.status === "Active" ? "active" : "inactive",
          schedule: (batchData.schedule || []).map((s) => ({
            dayOfWeek: DAY_REVERSE_MAP[s.day] ?? 1,
            startTime: s.startTime,
            endTime: s.endTime,
          })),
        };
        const res = await adminApi.createBatch(payload);
        return adaptBackendBatch(res.data);
      } catch (err: any) {
        localAdd(batchData);
        throw err;
      }
    },
    onSuccess: (newBatch) => {
      addToast(`Batch "${newBatch.name}" created successfully.`, "success");
      queryClient.invalidateQueries({ queryKey: ["admin", "batches"] });
    },
    onError: (err: any) => {
      addToast(err?.message || "Failed to create batch.", "error");
    },
  });
}

export function useUpdateBatchMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const localUpdate = useAdminStore((s) => s.updateBatch);

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AdminBatch> }) => {
      try {
        const payload: UpdateBatchPayload = {
          ...(updates.name && { name: updates.name }),
          ...(updates.teacherName && { teacherName: updates.teacherName }),
          ...(updates.meetingLink && { meetingLink: updates.meetingLink }),
          ...(updates.capacity && { capacity: updates.capacity }),
          ...(updates.status && { status: updates.status === "Active" ? "active" : "inactive" }),
          ...(updates.schedule && {
            schedule: updates.schedule.map((s) => ({
              dayOfWeek: DAY_REVERSE_MAP[s.day] ?? 1,
              startTime: s.startTime,
              endTime: s.endTime,
            })),
          }),
        };
        const res = await adminApi.updateBatch(id, payload);
        return adaptBackendBatch(res.data);
      } catch (err: any) {
        localUpdate(id, updates);
        throw err;
      }
    },
    onSuccess: () => {
      addToast("Batch updated successfully.", "success");
      queryClient.invalidateQueries({ queryKey: ["admin", "batches"] });
    },
    onError: (err: any) => {
      addToast(err?.message || "Failed to update batch.", "error");
    },
  });
}

export function useDeleteBatchMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const localDelete = useAdminStore((s) => s.deleteBatch);

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await adminApi.deleteBatch(id);
      } catch (err: any) {
        localDelete(id);
        throw err;
      }
    },
    onSuccess: (_, id) => {
      localDelete(id);
      addToast("Batch deleted successfully.", "info");
      queryClient.invalidateQueries({ queryKey: ["admin", "batches"] });
    },
    onError: (err: any) => {
      addToast(err?.message || "Cannot delete batch with enrolled students.", "error");
    },
  });
}

/**
 * 4. Notices Hooks
 */
export function useNoticesQuery(params?: { category?: string; showOnTicker?: boolean }) {
  const localNotices = useAdminStore((s) => s.notices);
  const setNotices = useAdminStore((s) => s.setNotices);

  return useQuery<AdminNotice[]>({
    queryKey: adminQueryKeys.notices(params),
    queryFn: async (): Promise<AdminNotice[]> => {
      try {
        const res = await adminApi.getNotices(params);
        const rawList = Array.isArray(res.data)
          ? res.data
          : Array.isArray((res.data as any)?.notices)
          ? (res.data as any).notices
          : Array.isArray((res.data as any)?.data?.notices)
          ? (res.data as any).data.notices
          : null;
        if (rawList !== null) {
          const adapted = rawList.map(adaptBackendNotice);
          setNotices(adapted);
          return adapted;
        }
      } catch (err: any) {
        if (err?.status === 401 || err?.status === 403) {
          return localNotices;
        }
        console.warn("Backend API unavailable, using local store for notices:", err);
      }
      return localNotices;
    },
    enabled: hasAdminToken(),
    placeholderData: () => localNotices,
    refetchOnMount: true,
  });
}

export function useCreateNoticeMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const localAdd = useAdminStore((s) => s.addNotice);

  return useMutation({
    mutationFn: async (noticeData: Omit<AdminNotice, "id" | "date"> & { pdfFile?: File | null }) => {
      try {
        const categoryReverseMap: Record<string, CreateNoticePayload["category"]> = {
          Urgent: "urgent",
          Holiday: "holiday",
          Exam: "exam",
          "New Batch": "new_batch",
        };

        const existingPdfUrl = noticeData.pdfUrl || noticeData.pdfAttachment || "";
        let body: any;
        if (noticeData.pdfFile) {
          const fd = new FormData();
          fd.append("title", noticeData.title);
          fd.append("category", categoryReverseMap[noticeData.category] || "urgent");
          fd.append("description", noticeData.description);
          fd.append("showOnTicker", String(noticeData.showOnTicker));
          fd.append("isActive", "true");
          if (existingPdfUrl) {
            fd.append("pdfUrl", existingPdfUrl);
          }
          // Backend expects upload.single('file')
          fd.append("file", noticeData.pdfFile);
          body = fd;
        } else {
          body = {
            title: noticeData.title,
            category: categoryReverseMap[noticeData.category] || "urgent",
            description: noticeData.description,
            showOnTicker: noticeData.showOnTicker,
            isActive: true,
            pdfUrl: existingPdfUrl,
          };
        }

        const res = await adminApi.createNotice(body);
        return adaptBackendNotice(res.data);
      } catch (err: any) {
        localAdd(noticeData);
        throw err;
      }
    },
    onSuccess: (newNotice) => {
      addToast(`Notice "${newNotice.title}" published.`, "success");
      queryClient.invalidateQueries({ queryKey: ["admin", "notices"] });
      queryClient.invalidateQueries({ queryKey: ["public", "notices"] });
    },
    onError: (err: any) => {
      addToast(err?.message || "Failed to publish notice.", "error");
    },
  });
}

export function useUpdateNoticeMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const localUpdate = useAdminStore((s) => s.updateNotice);

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<AdminNotice> & { pdfFile?: File | null };
    }) => {
      localUpdate(id, updates);
      try {
        const categoryReverseMap: Record<string, CreateNoticePayload["category"]> = {
          Urgent: "urgent",
          Holiday: "holiday",
          Exam: "exam",
          "New Batch": "new_batch",
          Admissions: "general",
          Event: "general",
        };

        const cat = updates.category ? categoryReverseMap[updates.category] || "urgent" : undefined;
        const existingPdfUrl = updates.pdfUrl || updates.pdfAttachment || "";

        let body: any;
        if (updates.pdfFile) {
          const fd = new FormData();
          if (updates.title) fd.append("title", updates.title);
          if (cat) fd.append("category", cat);
          if (updates.description) fd.append("description", updates.description);
          if (updates.showOnTicker !== undefined) fd.append("showOnTicker", String(updates.showOnTicker));
          if (existingPdfUrl) fd.append("pdfUrl", existingPdfUrl);
          // Backend expects upload.single('file')
          fd.append("file", updates.pdfFile);
          body = fd;
        } else {
          body = {
            ...(updates.title && { title: updates.title }),
            ...(cat && { category: cat }),
            ...(updates.description && { description: updates.description }),
            ...(updates.showOnTicker !== undefined && { showOnTicker: updates.showOnTicker }),
            ...(updates.pdfUrl !== undefined || updates.pdfAttachment !== undefined
              ? { pdfUrl: existingPdfUrl }
              : {}),
          };
        }

        const res = await adminApi.updateNotice(id, body);
        return adaptBackendNotice(res.data);
      } catch (err: any) {
        return { ...updates, id } as AdminNotice;
      }
    },
    onSuccess: (updated) => {
      addToast("Notice updated successfully.", "success");
      queryClient.invalidateQueries({ queryKey: ["admin", "notices"] });
      queryClient.invalidateQueries({ queryKey: ["public", "notices"] });
    },
    onError: (err: any) => {
      addToast(err?.message || "Failed to update notice.", "error");
    },
  });
}

export function useDeleteNoticeMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const localDelete = useAdminStore((s) => s.deleteNotice);

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await adminApi.deleteNotice(id);
      } catch (err: any) {
        localDelete(id);
        throw err;
      }
    },
    onSuccess: (_, id) => {
      localDelete(id);
      addToast("Notice deleted.", "info");
      queryClient.invalidateQueries({ queryKey: ["admin", "notices"] });
      queryClient.invalidateQueries({ queryKey: ["public", "notices"] });
    },
    onError: (err: any) => {
      addToast(err?.message || "Failed to delete notice.", "error");
    },
  });
}

/**
 * 5. Admissions Hooks
 */
export function useAdmissionsQuery(params?: { status?: "pending" | "approved" | "rejected"; search?: string }) {
  const localAdmissions = useAdminStore((s) => s.admissions);
  const setAdmissions = useAdminStore((s) => s.setAdmissions);

  return useQuery<AdminAdmissionRequest[]>({
    queryKey: adminQueryKeys.admissions(params),
    queryFn: async (): Promise<AdminAdmissionRequest[]> => {
      try {
        const res = await adminApi.getAdmissions(params);
        const rawList = Array.isArray(res.data)
          ? res.data
          : Array.isArray((res.data as any)?.admissions)
          ? (res.data as any).admissions
          : Array.isArray((res.data as any)?.data?.admissions)
          ? (res.data as any).data.admissions
          : null;
        if (rawList !== null) {
          const adapted = rawList.map(adaptBackendAdmission);
          setAdmissions(adapted);
          return adapted;
        }
      } catch (err: any) {
        if (err?.status === 401 || err?.status === 403) {
          return localAdmissions;
        }
        console.warn("Backend API unavailable, using local store for admissions:", err);
      }
      return localAdmissions;
    },
    enabled: hasAdminToken(),
    placeholderData: () => localAdmissions,
    refetchOnMount: true,
  });
}

export function useApproveAdmissionMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const localApprove = useAdminStore((s) => s.approveAdmission);

  return useMutation({
    mutationFn: async ({ admissionId, batchId }: { admissionId: string; batchId: string }) => {
      try {
        const res = await adminApi.approveAdmission(admissionId, batchId);
        return res.data;
      } catch (err: any) {
        localApprove(admissionId, batchId);
        throw err;
      }
    },
    onSuccess: (data) => {
      addToast(`Admission approved. Student Login ID: ${data?.loginId || "Created"}`, "success");
      queryClient.invalidateQueries({ queryKey: ["admin", "admissions"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "batches"] });
    },
    onError: (err: any) => {
      addToast(err?.message || "Error approving admission.", "error");
    },
  });
}

export function useRejectAdmissionMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const localReject = useAdminStore((s) => s.rejectAdmission);

  return useMutation({
    mutationFn: async ({ admissionId, reason }: { admissionId: string; reason: string }) => {
      try {
        const res = await adminApi.rejectAdmission(admissionId, reason);
        return res.data;
      } catch (err: any) {
        localReject(admissionId, reason);
        throw err;
      }
    },
    onSuccess: () => {
      addToast("Admission application marked as Rejected.", "info");
      queryClient.invalidateQueries({ queryKey: ["admin", "admissions"] });
    },
    onError: (err: any) => {
      addToast(err?.message || "Error rejecting admission.", "error");
    },
  });
}

/**
 * 6. Students Hooks
 */
export function useStudentsQuery(params?: { search?: string; courseId?: string; batchId?: string; isActive?: boolean }) {
  const localStudents = useAdminStore((s) => s.students);
  const setStudents = useAdminStore((s) => s.setStudents);

  return useQuery<AdminStudent[]>({
    queryKey: adminQueryKeys.students(params),
    queryFn: async (): Promise<AdminStudent[]> => {
      try {
        const res = await adminApi.getStudents(params);
        const rawList = Array.isArray(res.data)
          ? res.data
          : Array.isArray((res.data as any)?.students)
          ? (res.data as any).students
          : Array.isArray((res.data as any)?.data?.students)
          ? (res.data as any).data.students
          : null;
        if (rawList !== null) {
          const adapted = rawList.map(adaptBackendStudent);
          setStudents(adapted);
          return adapted;
        }
      } catch (err: any) {
        if (err?.status === 401 || err?.status === 403) {
          return localStudents;
        }
        console.warn("Backend API unavailable, using local store for students:", err);
      }
      return localStudents;
    },
    enabled: hasAdminToken(),
    placeholderData: () => localStudents,
    refetchOnMount: true,
  });
}

export function useTransferStudentBatchMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const localTransfer = useAdminStore((s) => s.changeStudentBatch);

  return useMutation({
    mutationFn: async ({ studentId, enrollmentId, newBatchId, courseId }: {
      studentId: string;
      enrollmentId: string;
      newBatchId: string;
      courseId: string;
    }) => {
      try {
        const res = await adminApi.transferStudentBatch(studentId, enrollmentId, newBatchId);
        return res.data;
      } catch (err: any) {
        localTransfer(studentId, courseId, newBatchId);
        throw err;
      }
    },
    onSuccess: () => {
      addToast("Student batch transferred successfully.", "success");
      queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "batches"] });
    },
    onError: (err: any) => {
      addToast(err?.message || "Failed to transfer student batch.", "error");
    },
  });
}

export function useSetStudentStatusMutation() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  const localToggle = useAdminStore((s) => s.toggleStudentStatus);

  return useMutation({
    mutationFn: async ({ studentId, isActive }: { studentId: string; isActive: boolean }) => {
      try {
        const res = await adminApi.setStudentStatus(studentId, isActive);
        return res.data;
      } catch (err: any) {
        localToggle(studentId);
        throw err;
      }
    },
    onSuccess: (_, variables) => {
      addToast(`Student marked as ${variables.isActive ? "Active" : "Inactive"}.`, "success");
      queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
    },
    onError: (err: any) => {
      addToast(err?.message || "Failed to update student status.", "error");
    },
  });
}

export function useResetStudentPasswordMutation() {
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: async (studentId: string) => {
      const res = await adminApi.resetStudentPassword(studentId);
      return res.data;
    },
    onSuccess: (data) => {
      addToast(`Password reset. Temporary password: ${data?.temporaryPassword || "Assigned"}`, "success");
    },
    onError: (err: any) => {
      addToast(err?.message || "Failed to reset student password.", "error");
    },
  });
}
