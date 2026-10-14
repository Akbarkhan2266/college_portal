"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import { useAdminStore } from "../stores/admin-store";
import { AdminNotice } from "../admin-data";
import { BackendNotice } from "./admin-api";
import { Notice } from "../data";
import { adaptBackendNotice } from "./adapters";
import { getStoredAdminNotices } from "./notice-store-sync";

/**
 * Parses date string (e.g. "Oct 20, 2026", "2026-10-20", ISO) into day, month, year.
 */
export function parseNoticeDate(dateStr?: string): { day: string; month: string; year: string } {
  if (!dateStr) {
    const now = new Date();
    return {
      day: String(now.getDate()).padStart(2, "0"),
      month: now.toLocaleString("en-US", { month: "short" }).toUpperCase(),
      year: String(now.getFullYear()),
    };
  }

  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return {
      day: String(d.getDate()).padStart(2, "0"),
      month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
      year: String(d.getFullYear()),
    };
  }

  const parts = dateStr.trim().split(/[\s,]+/);
  if (parts.length >= 3) {
    return {
      day: parts[1].padStart(2, "0"),
      month: parts[0].slice(0, 3).toUpperCase(),
      year: parts[2],
    };
  }

  return {
    day: "01",
    month: "OCT",
    year: "2026",
  };
}

/**
 * Maps an admin notice from backend or admin store into the public Notice format.
 */
export function mapAdminNoticeToPublic(adminNotice: AdminNotice | BackendNotice | any): Notice {
  const id = adminNotice._id || adminNotice.id || `not-${Date.now()}`;
  const title = adminNotice.title || "Academy Announcement";
  const category = adminNotice.category || "General";
  const description = adminNotice.description || "";
  const dateStr = adminNotice.date || adminNotice.publishedAt || adminNotice.createdAt;
  const { day, month, year } = parseNoticeDate(dateStr);
  const showOnTicker = Boolean(adminNotice.showOnTicker);
  const pdfAttachment = adminNotice.pdfAttachment || adminNotice.pdfUrl;

  return {
    id: String(id),
    title,
    category,
    description,
    day,
    month,
    year,
    tags: [
      `#${category.replace(/\s+/g, "")}`,
      ...(showOnTicker ? ["#Ticker"] : []),
      "#OfficialNotice",
    ],
    featured: showOnTicker,
    pdfAttachment,
  };
}

export interface PublicNoticeQueryParams {
  tickerOnly?: boolean;
  category?: string;
  page?: number;
  limit?: number;
}

/**
 * TanStack Query Hook to fetch public notices from backend API.
 * Uses GET /api/public/notices (supports tickerOnly=true).
 * NOTE: Returns ONLY notices created / updated in the admin panel. Never returns fake dummy data.
 */
export function usePublicNoticesQuery(params?: PublicNoticeQueryParams) {
  const storeNotices = useAdminStore((s) => s.notices);

  return useQuery<Notice[]>({
    queryKey: ["public", "notices", params],
    queryFn: async (): Promise<Notice[]> => {
      // 1. Fetch from primary endpoint: GET /api/public/notices
      try {
        let rawList: any[] | null = null;
        try {
          const res = await apiClient<any>("/api/public/notices", {
            params: params as Record<string, any>,
            role: "public",
          });
          rawList =
            res?.data?.notices ||
            res?.notices ||
            (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : null);
        } catch {
          // Fallback to /api/admin/notices if backend variant
          const res = await apiClient<any>("/api/admin/notices", {
            params: params as Record<string, any>,
          });
          rawList =
            res?.data?.notices ||
            res?.notices ||
            (Array.isArray(res?.data) ? res.data : null);
        }

        if (Array.isArray(rawList)) {
          const adapted = rawList.map((raw) =>
            mapAdminNoticeToPublic(adaptBackendNotice(raw))
          );
          return adapted;
        }
      } catch (err) {
        console.warn("Backend API unavailable for public notices:", err);
      }

      // 2. Zustand store
      const currentStoreNotices = useAdminStore.getState().notices;
      if (currentStoreNotices && currentStoreNotices.length > 0) {
        return currentStoreNotices.map(mapAdminNoticeToPublic);
      }

      // 3. LocalStorage
      const cached = getStoredAdminNotices();
      if (cached && cached.length > 0) {
        return cached.map(mapAdminNoticeToPublic);
      }

      // 4. Return clean empty array (no mock notices)
      return [];
    },
    placeholderData: () => {
      if (storeNotices && storeNotices.length > 0) {
        return storeNotices.map(mapAdminNoticeToPublic);
      }
      const cached = getStoredAdminNotices();
      if (cached && cached.length > 0) {
        return cached.map(mapAdminNoticeToPublic);
      }
      return [];
    },
    staleTime: 1000 * 15,
    refetchOnMount: true,
  });
}

/**
 * TanStack Query Hook to fetch single notice detail by ID.
 * Uses GET /api/public/notices/:id
 */
export function usePublicNoticeDetailQuery(id: string) {
  return useQuery<Notice | null>({
    queryKey: ["public", "notice", id],
    queryFn: async (): Promise<Notice | null> => {
      if (!id) return null;
      try {
        const res = await apiClient<any>(`/api/public/notices/${encodeURIComponent(id)}`, {
          role: "public",
        });
        const noticeData = res?.data?.notice || res?.data || res?.notice || res;
        if (noticeData && (noticeData._id || noticeData.id || noticeData.title)) {
          return mapAdminNoticeToPublic(adaptBackendNotice(noticeData));
        }
      } catch (err) {
        console.warn(`Failed to fetch public notice detail for ${id}:`, err);
      }
      return null;
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
}
