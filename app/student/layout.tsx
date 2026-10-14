"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { StudentProvider } from "@/lib/student-context";
import { StudentShell } from "@/components/student/student-shell";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/student/login";

  return (
    <StudentProvider>
      {isLoginPage ? children : <StudentShell>{children}</StudentShell>}
    </StudentProvider>
  );
}
