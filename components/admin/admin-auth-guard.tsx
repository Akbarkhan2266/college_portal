"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuthToken, clearAuthToken } from "@/lib/api/client";
import { useAdminMeQuery } from "@/lib/api/admin-queries";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = React.useState(true);
  const token = getAuthToken();

  // Validate session with backend /api/admin/me
  const { data: adminUser, isLoading, isError } = useAdminMeQuery();

  React.useEffect(() => {
    // 1. If no token found in storage, check if expired or not logged in
    if (!token) {
      const isExpired = typeof window !== "undefined" && sessionStorage.getItem("admin_session_expired") === "true";
      if (isExpired) {
        sessionStorage.removeItem("admin_session_expired");
        router.replace(`/admin/login?sessionExpired=true&redirect=${encodeURIComponent(pathname)}`);
      } else {
        router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      }
      return;
    }

    // 2. If token exists and query finishes
    if (!isLoading) {
      if (isError) {
        // Token is invalid/expired according to backend
        clearAuthToken();
        router.replace(`/admin/login?sessionExpired=true&redirect=${encodeURIComponent(pathname)}`);
      } else {
        setChecking(false);
      }
    }
  }, [token, isLoading, isError, router, pathname]);

  // Loading splash while checking credentials
  if (checking || !token || isLoading) {
    return (
      <div className="min-h-screen bg-[#fcf9f2] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[#785610] border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-zinc-600 tracking-wide uppercase">
            Verifying Admin Session...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
