"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AdminProvider } from "@/lib/admin-context";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AdminProvider>
      {isLoginPage ? (
        children
      ) : (
        <AdminAuthGuard>
          <AdminShell>{children}</AdminShell>
        </AdminAuthGuard>
      )}
    </AdminProvider>
  );
}
