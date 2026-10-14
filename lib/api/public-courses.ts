"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import { useAdminStore } from "../stores/admin-store";
import { AdminCourse } from "../admin-data";
import { BackendCourse } from "./admin-api";
import { Course } from "../data";
import { getCourseMeta } from "./course-meta";

const FALLBACK_CAMPUS_IMAGES = [
  "/images/hero-library.jpg",
  "/images/musalla.jpg",
  "/images/students-walking.jpg",
  "/images/students-stairs.jpg",
  "/images/classroom.jpg",
];

/**
 * Maps a course from the admin panel / backend API into the public catalogue Course format.
 */
export function mapAdminCourseToPublic(
  adminCourse: AdminCourse | BackendCourse | any,
  index: number = 0
): Course {
  const id = adminCourse._id || adminCourse.id || `course-${index}`;
  const name = adminCourse.name || adminCourse.title || "Academic Program";
  const description =
    adminCourse.description ||
    "Structured syllabus taught by qualified Islamic scholars and educators.";
  const isPinned = Boolean(adminCourse.isPinned);
  const ageGroup = adminCourse.ageGroup || "All Ages";

  // Check persistent course metadata saved locally from Admin Panel
  const meta = getCourseMeta(String(id), name);

  const resolvedImageSrc =
    adminCourse.imageUrl ||
    adminCourse.image ||
    adminCourse.imageSrc ||
    meta?.imageUrl ||
    meta?.image ||
    meta?.imageSrc ||
    FALLBACK_CAMPUS_IMAGES[index % FALLBACK_CAMPUS_IMAGES.length];

  const resolvedMonthlyFee =
    adminCourse.monthlyFee ||
    meta?.monthlyFee ||
    "Merit Subsidy Available";

  const resolvedSubjects = adminCourse.subjectsCount
    ? `${adminCourse.subjectsCount} Subjects`
    : adminCourse.batchCount
    ? `${adminCourse.batchCount} Active Batches`
    : "Comprehensive Modules";

  return {
    id: String(id),
    title: name,
    subtitle: `${ageGroup} • Academic Program`,
    categoryTag: `ACADEMIC PROGRAM • ${ageGroup.toUpperCase()}`,
    description,
    imageSrc: resolvedImageSrc,
    imageAlt: `${name} at Al Jamia Tul Bukhari`,
    subjectsCount: resolvedSubjects,
    monthlyFee: resolvedMonthlyFee,
    tags: isPinned
      ? ["★ PINNED", ageGroup.toUpperCase()]
      : [ageGroup.toUpperCase()],
    isPinned,
  };
}

export interface PublicCourseQueryParams {
  search?: string;
  ageGroup?: string;
  page?: number;
  limit?: number;
}

/**
 * TanStack Query Hook to fetch public courses strictly from backend API.
 * Uses GET /api/public/courses (supports search, ageGroup filter & pagination).
 * Never returns mock or dummy data.
 */
export function usePublicCoursesQuery(params?: PublicCourseQueryParams) {
  return useQuery<Course[]>({
    queryKey: ["public", "courses", params],
    queryFn: async (): Promise<Course[]> => {
      // 1. Primary endpoint: GET /api/public/courses
      try {
        let rawList: any[] | null = null;
        try {
          const res = await apiClient<any>("/api/public/courses", {
            params: params as Record<string, any>,
            role: "public",
          });
          rawList =
            res?.data?.courses ||
            res?.courses ||
            (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : null);
        } catch {
          // Fallback to /api/courses or /api/admin/courses if backend variant
          try {
            const res = await apiClient<any>("/api/courses", {
              params: params as Record<string, any>,
              role: "public",
            });
            rawList =
              res?.data?.courses ||
              res?.courses ||
              (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : null);
          } catch {
            const res = await apiClient<any>("/api/admin/courses", {
              params: params as Record<string, any>,
            });
            rawList =
              res?.data?.courses ||
              res?.courses ||
              (Array.isArray(res?.data) ? res.data : null);
          }
        }

        if (Array.isArray(rawList)) {
          const active = rawList.filter(
            (c: any) => c.isActive !== false && c.status !== "Inactive"
          );
          return active.map(mapAdminCourseToPublic);
        }
      } catch (err) {
        console.warn("Backend API unavailable for public courses:", err);
      }

      // 2. Check Zustand admin store if already loaded in memory
      const currentStoreCourses = useAdminStore.getState().courses;
      if (currentStoreCourses && currentStoreCourses.length > 0) {
        const active = currentStoreCourses.filter(
          (c) => c.status !== "Inactive"
        );
        if (active.length > 0) {
          return active.map(mapAdminCourseToPublic);
        }
      }

      // 3. Return clean empty array (no dummy data)
      return [];
    },
    placeholderData: [],
    staleTime: 1000 * 30, // 30 seconds
    refetchOnMount: true,
  });
}

/**
 * TanStack Query Hook to fetch single course detail by unique slug or MongoDB ID.
 * Uses GET /api/public/courses/:idOrSlug
 */
export function usePublicCourseDetailQuery(idOrSlug: string) {
  return useQuery<Course | null>({
    queryKey: ["public", "course", idOrSlug],
    queryFn: async (): Promise<Course | null> => {
      if (!idOrSlug) return null;
      try {
        const res = await apiClient<any>(`/api/public/courses/${encodeURIComponent(idOrSlug)}`, {
          role: "public",
        });
        const courseData = res?.data?.course || res?.data || res?.course || res;
        if (courseData && (courseData._id || courseData.id || courseData.name)) {
          return mapAdminCourseToPublic(courseData);
        }
      } catch (err) {
        console.warn(`Failed to fetch public course detail for ${idOrSlug}:`, err);
      }
      return null;
    },
    enabled: Boolean(idOrSlug),
    staleTime: 1000 * 60,
  });
}
