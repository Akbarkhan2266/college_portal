/**
 * Client-side persistence for course metadata (fees, images)
 * to ensure custom fees and uploaded banners survive backend schema limitations.
 */

export interface CourseMeta {
  monthlyFee?: string;
  imageSrc?: string;
  imageUrl?: string;
  image?: string;
}

const STORAGE_KEY = "college_portal_courses_meta_v1";

export function getStoredCourseMetaMap(): Record<string, CourseMeta> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCourseMeta(idOrName: string, meta: CourseMeta) {
  if (typeof window === "undefined" || !idOrName) return;
  try {
    const map = getStoredCourseMetaMap();
    const key = idOrName.toLowerCase().trim();
    const img = meta.imageUrl || meta.image || meta.imageSrc;
    map[key] = {
      ...(map[key] || {}),
      ...(meta.monthlyFee !== undefined ? { monthlyFee: meta.monthlyFee } : {}),
      ...(img !== undefined ? { imageSrc: img, imageUrl: img, image: img } : {}),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

export function getCourseMeta(id?: string, name?: string): CourseMeta | null {
  if (typeof window === "undefined") return null;
  try {
    const map = getStoredCourseMetaMap();
    if (id && map[id.toLowerCase().trim()]) {
      const match = map[id.toLowerCase().trim()];
      if (match.monthlyFee || match.imageSrc || match.imageUrl || match.image) return match;
    }
    if (name && map[name.toLowerCase().trim()]) {
      const match = map[name.toLowerCase().trim()];
      if (match.monthlyFee || match.imageSrc || match.imageUrl || match.image) return match;
    }
    return null;
  } catch {
    return null;
  }
}
