import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminStore } from "../stores/admin-store";
import { useStudentStore } from "../stores/student-store";
import { AdminCourse, AdminNotice, AdminBatch, AdminStudent } from "../admin-data";

/**
 * Query Keys
 */
export const queryKeys = {
  admin: {
    courses: ["admin", "courses"] as const,
    batches: ["admin", "batches"] as const,
    notices: ["admin", "notices"] as const,
    students: ["admin", "students"] as const,
    admissions: ["admin", "admissions"] as const,
    profile: ["admin", "profile"] as const,
  },
  student: {
    profile: ["student", "profile"] as const,
    courses: ["student", "courses"] as const,
    batches: ["student", "batches"] as const,
    notices: ["student", "notices"] as const,
    todayClasses: ["student", "todayClasses"] as const,
  },
};

/**
 * Admin React Query Hooks
 */
export function useAdminCoursesQuery() {
  const courses = useAdminStore((s) => s.courses);
  return useQuery({
    queryKey: queryKeys.admin.courses,
    queryFn: async () => courses,
    initialData: courses,
  });
}

export function useAdminBatchesQuery() {
  const batches = useAdminStore((s) => s.batches);
  return useQuery({
    queryKey: queryKeys.admin.batches,
    queryFn: async () => batches,
    initialData: batches,
  });
}

export function useAdminNoticesQuery() {
  const notices = useAdminStore((s) => s.notices);
  return useQuery({
    queryKey: queryKeys.admin.notices,
    queryFn: async () => notices,
    initialData: notices,
  });
}

export function useAdminStudentsQuery() {
  const students = useAdminStore((s) => s.students);
  return useQuery({
    queryKey: queryKeys.admin.students,
    queryFn: async () => students,
    initialData: students,
  });
}

export function useAdminAdmissionsQuery() {
  const admissions = useAdminStore((s) => s.admissions);
  return useQuery({
    queryKey: queryKeys.admin.admissions,
    queryFn: async () => admissions,
    initialData: admissions,
  });
}

export function useAdminAddCourseMutation() {
  const queryClient = useQueryClient();
  const addCourse = useAdminStore((s) => s.addCourse);

  return useMutation({
    mutationFn: async (newCourse: Omit<AdminCourse, "id" | "createdAt">) => {
      addCourse(newCourse);
      return newCourse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.courses });
    },
  });
}

export function useAdminAddNoticeMutation() {
  const queryClient = useQueryClient();
  const addNotice = useAdminStore((s) => s.addNotice);

  return useMutation({
    mutationFn: async (newNotice: Omit<AdminNotice, "id" | "date">) => {
      addNotice(newNotice);
      return newNotice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.notices });
    },
  });
}

/**
 * Student React Query Hooks
 */
export function useStudentProfileQuery() {
  const student = useStudentStore((s) => s.student);
  return useQuery({
    queryKey: queryKeys.student.profile,
    queryFn: async () => student,
    initialData: student,
  });
}

export function useStudentCoursesQuery() {
  const courses = useStudentStore((s) => s.courses);
  return useQuery({
    queryKey: queryKeys.student.courses,
    queryFn: async () => courses,
    initialData: courses,
  });
}

export function useStudentBatchesQuery() {
  const batches = useStudentStore((s) => s.batches);
  return useQuery({
    queryKey: queryKeys.student.batches,
    queryFn: async () => batches,
    initialData: batches,
  });
}

export function useStudentNoticesQuery() {
  const notices = useStudentStore((s) => s.notices);
  return useQuery({
    queryKey: queryKeys.student.notices,
    queryFn: async () => notices,
    initialData: notices,
  });
}
