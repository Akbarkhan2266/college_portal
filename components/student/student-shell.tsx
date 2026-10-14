"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Bell,
  User,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Lock,
  KeyRound,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { useStudent } from "@/lib/student-context";
import { getStudentAuthToken } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const studentNavItems = [
  {
    name: "Dashboard",
    href: "/student",
    icon: LayoutDashboard,
  },
  {
    name: "My Courses",
    href: "/student/courses",
    icon: BookOpen,
  },
  {
    name: "Batches",
    href: "/student/batches",
    icon: CalendarDays,
  },
  {
    name: "Notices",
    href: "/student/notices",
    icon: Bell,
  },
  {
    name: "Profile",
    href: "/student/profile",
    icon: User,
  },
];

export function StudentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    student,
    mustChangePassword,
    changePassword,
    updatePasswordMutation,
    toasts,
    removeToast,
  } = useStudent();

  const [authChecked, setAuthChecked] = React.useState(false);

  // Forced First-Time Password Change Form State
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  // Route protection
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const token = getStudentAuthToken();
      if (!token && pathname !== "/student/login") {
        const isExpired = sessionStorage.getItem("student_session_expired") === "true";
        if (isExpired) {
          sessionStorage.removeItem("student_session_expired");
          router.push("/student/login?sessionExpired=true");
        } else {
          router.push("/student/login");
        }
      } else {
        setAuthChecked(true);
      }
    }
  }, [pathname, router]);

  const handleForcedPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!oldPassword) {
      setPasswordError("Please enter your current/temporary password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    changePassword(oldPassword, newPassword);
  };

  // If on login page, don't show the dashboard shell navigation
  if (pathname === "/student/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#fcf9f2] flex flex-col text-zinc-900 selection:bg-[#785610] selection:text-white pb-20 md:pb-8">
      {/* Desktop Top Navigation */}
      <header className="hidden md:block sticky top-0 z-40 bg-[#fffdf8]/95 backdrop-blur-md border-b border-[#e5dcc7] shadow-xs">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/student" className="flex items-center group">
            <div className="relative h-14 sm:h-16 w-52 sm:w-60">
              <Image
                alt="Al Jamia Tul Bukhari Academy"
                src="/images/logo.png"
                fill
                sizes="(max-width: 640px) 208px, 240px"
                className="object-contain object-left transition-transform group-hover:scale-[1.02]"
                priority
              />
            </div>
          </Link>

          {/* 5 Navigation Tabs */}
          <nav className="flex items-center gap-1.5">
            {studentNavItems.map((item) => {
              const isActive =
                item.href === "/student"
                  ? pathname === "/student"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#785610] text-white shadow-xs border border-[#b48a3c]"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-[#f5eedb]/70"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Top Brand Bar (visible on mobile only) */}
      <div className="md:hidden sticky top-0 z-40 bg-[#fffdf8]/95 backdrop-blur-md border-b border-[#e5dcc7] px-4 py-2.5 flex items-center justify-between shadow-xs">
        <Link href="/student" className="flex items-center">
          <div className="relative h-11 w-44">
            <Image
              alt="Al Jamia Tul Bukhari Academy"
              src="/images/logo.png"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        {authChecked ? children : null}
      </main>

      {/* Mobile Bottom Tab Bar (Fixed at bottom on mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#fffdf8]/95 backdrop-blur-md border-t border-[#e5dcc7] px-2 py-1.5 flex items-center justify-around shadow-lg">
        {studentNavItems.map((item) => {
          const isActive =
            item.href === "/student"
              ? pathname === "/student"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-all relative ${
                isActive ? "text-[#785610]" : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <div
                className={`p-1 rounded-md transition-colors ${
                  isActive ? "bg-amber-100/80 text-[#785610]" : ""
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="mt-0.5 leading-none">{item.name}</span>
              {isActive && (
                <span className="h-1 w-1 rounded-full bg-[#785610] mt-0.5" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Mandatory First-Time Password Change Dialog */}
      <Dialog open={Boolean(mustChangePassword)} onOpenChange={() => {}}>
        <DialogContent
          maxWidth="max-w-md"
          hideCloseButton={true}
          className="bg-white p-6 rounded-2xl shadow-2xl border-amber-200"
        >
          <DialogHeader className="space-y-2">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-[#785610] border border-amber-200 flex items-center justify-center mx-auto">
              <KeyRound className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-lg font-bold text-zinc-900">
              Update Temporary Password
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-zinc-600">
              Assalamu Alaikum {student.name}. For security reasons, please change your temporary password to unlock access to your classes, timetable, and study portal.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleForcedPasswordSubmit} className="space-y-4 pt-2">
            {passwordError && (
              <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Current / Temporary Password *
              </label>
              <Input
                type="password"
                placeholder="Enter password given by academy"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                New Secure Password *
              </label>
              <Input
                type="password"
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Confirm New Password *
              </label>
              <Input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                variant="gold"
                className="w-full text-xs h-9 font-semibold"
                disabled={updatePasswordMutation.isPending}
              >
                {updatePasswordMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating Password...
                  </>
                ) : (
                  "Set New Password & Continue"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Floating Toast Container */}
      <div className="fixed bottom-20 md:bottom-5 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border text-xs transition-all bg-white ${
              toast.type === "success"
                ? "border-emerald-200 text-emerald-950"
                : toast.type === "error"
                ? "border-red-200 text-red-950"
                : "border-zinc-200 text-zinc-950"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : toast.type === "error" ? (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 font-medium">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
