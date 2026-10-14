/**
 * College Portal API Client with credentials, JWT token support, and unified error handling.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const TOKEN_EXPIRY_DAYS = 7;
export const TOKEN_EXPIRY_MS = TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 7 days in milliseconds (604,800,000 ms)

/**
 * Safely parse the JWT exp claim if the token is a standard 3-part JWT.
 */
function parseJwtExp(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(jsonPayload);
      if (typeof payload?.exp === "number") {
        return payload.exp * 1000; // Convert seconds to milliseconds
      }
    }
  } catch {
    // If not a standard JWT or parsing fails, return null
  }
  return null;
}

/**
 * Validates if a token has exceeded its 7-day validity window or its JWT exp timestamp.
 */
export function isTokenExpired(expiryStr: string | null, token?: string | null): boolean {
  if (!token) return true;

  const now = Date.now();

  // 1. Check client-side stored 7-day expiry timestamp
  if (expiryStr) {
    const expiryTime = Number(expiryStr);
    if (!isNaN(expiryTime) && now >= expiryTime) {
      return true;
    }
  }

  // 2. Check JWT exp claim if present in token payload
  const jwtExp = parseJwtExp(token);
  if (jwtExp !== null && now >= jwtExp) {
    return true;
  }

  return false;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  // Check localStorage first
  const localToken = localStorage.getItem("admin_token");
  const localExpiry = localStorage.getItem("admin_token_expiry");
  if (localToken) {
    if (isTokenExpired(localExpiry, localToken)) {
      clearAuthToken();
      sessionStorage.setItem("admin_session_expired", "true");
      return null;
    }
    // If existing session had no expiry stamped, set 7-day expiry from now
    if (!localExpiry) {
      localStorage.setItem("admin_token_expiry", (Date.now() + TOKEN_EXPIRY_MS).toString());
    }
    return localToken;
  }

  // Check sessionStorage
  const sessionToken = sessionStorage.getItem("admin_token");
  const sessionExpiry = sessionStorage.getItem("admin_token_expiry");
  if (sessionToken) {
    if (isTokenExpired(sessionExpiry, sessionToken)) {
      clearAuthToken();
      sessionStorage.setItem("admin_session_expired", "true");
      return null;
    }
    if (!sessionExpiry) {
      sessionStorage.setItem("admin_token_expiry", (Date.now() + TOKEN_EXPIRY_MS).toString());
    }
    return sessionToken;
  }

  return null;
}

export function setAuthToken(token: string, remember: boolean = true) {
  if (typeof window === "undefined") return;
  const expiry = (Date.now() + TOKEN_EXPIRY_MS).toString();

  if (remember) {
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_token_expiry", expiry);
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_token_expiry");
  } else {
    sessionStorage.setItem("admin_token", token);
    sessionStorage.setItem("admin_token_expiry", expiry);
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_token_expiry");
  }
  sessionStorage.removeItem("admin_session_expired");
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_token_expiry");
  sessionStorage.removeItem("admin_token");
  sessionStorage.removeItem("admin_token_expiry");
}

export function getStudentAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  // Check sessionStorage first
  const sessionToken = sessionStorage.getItem("student_token");
  const sessionExpiry = sessionStorage.getItem("student_token_expiry");
  if (sessionToken) {
    if (isTokenExpired(sessionExpiry, sessionToken)) {
      clearStudentAuthToken();
      sessionStorage.setItem("student_session_expired", "true");
      return null;
    }
    if (!sessionExpiry) {
      sessionStorage.setItem("student_token_expiry", (Date.now() + TOKEN_EXPIRY_MS).toString());
    }
    return sessionToken;
  }

  // Check localStorage
  const localToken = localStorage.getItem("student_token");
  const localExpiry = localStorage.getItem("student_token_expiry");
  if (localToken) {
    if (isTokenExpired(localExpiry, localToken)) {
      clearStudentAuthToken();
      sessionStorage.setItem("student_session_expired", "true");
      return null;
    }
    if (!localExpiry) {
      localStorage.setItem("student_token_expiry", (Date.now() + TOKEN_EXPIRY_MS).toString());
    }
    return localToken;
  }

  return null;
}

export function setStudentAuthToken(token: string, remember: boolean = false) {
  if (typeof window === "undefined") return;
  const expiry = (Date.now() + TOKEN_EXPIRY_MS).toString();

  if (remember) {
    localStorage.setItem("student_token", token);
    localStorage.setItem("student_token_expiry", expiry);
    sessionStorage.setItem("student_token", token);
    sessionStorage.setItem("student_token_expiry", expiry);
  } else {
    sessionStorage.setItem("student_token", token);
    sessionStorage.setItem("student_token_expiry", expiry);
    localStorage.removeItem("student_token");
    localStorage.removeItem("student_token_expiry");
  }
  sessionStorage.removeItem("student_session_expired");
}

export function clearStudentAuthToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("student_token");
  localStorage.removeItem("student_token_expiry");
  sessionStorage.removeItem("student_token");
  sessionStorage.removeItem("student_token_expiry");
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  isFormData?: boolean;
  role?: "admin" | "student" | "public";
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, isFormData, headers = {}, role, ...customConfig } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.append(key, String(val));
      }
    });
    const qs = searchParams.toString();
    if (qs) {
      url += (url.includes("?") ? "&" : "?") + qs;
    }
  }

  const isPublicRequest = endpoint.startsWith("/api/public") || role === "public";
  const isStudentRequest = !isPublicRequest && (role === "student" || endpoint.startsWith("/api/student"));
  const token = isPublicRequest ? null : (isStudentRequest ? getStudentAuthToken() : getAuthToken());
  const requestHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  if (!isFormData) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...customConfig,
      headers: requestHeaders,
      credentials: "include", // Supports httpOnly cookies
    });

    // Handle 204 No Content
    if (res.status === 204) {
      return {} as T;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage =
        data?.message ||
        data?.error ||
        `Request failed with status ${res.status}`;

      // Handle 401 Unauthorized or 403 Forbidden (insufficient permissions / invalid session)
      if (!isPublicRequest && (res.status === 401 || res.status === 403) && typeof window !== "undefined") {
        if (isStudentRequest) {
          clearStudentAuthToken();
          if (
            window.location.pathname.startsWith("/student") &&
            window.location.pathname !== "/student/login"
          ) {
            window.location.href = "/student/login?sessionExpired=true";
          }
        } else {
          clearAuthToken();
          if (
            window.location.pathname.startsWith("/admin") &&
            window.location.pathname !== "/admin/login"
          ) {
            window.location.href = "/admin/login?sessionExpired=true";
          }
        }
      }

      throw new ApiError(errorMessage, res.status, data);
    }

    return data as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network errors or offline
    throw new ApiError(
      error?.message || "Unable to connect to the server. Please check your connection.",
      0
    );
  }
}
