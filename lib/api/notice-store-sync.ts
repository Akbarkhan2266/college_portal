import { AdminNotice } from "../admin-data";

/**
 * Client-side persistence for admin notices to ensure
 * notices created or updated in the Admin Panel reliably survive page reloads
 * and synchronize instantly with the public notice page.
 */

const NOTICES_STORAGE_KEY = "college_portal_notices_v1";

export function getStoredAdminNotices(): AdminNotice[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOTICES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredAdminNotices(notices: AdminNotice[]) {
  if (typeof window === "undefined" || !Array.isArray(notices)) return;
  try {
    localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(notices));
  } catch {}
}
