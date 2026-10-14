"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Bell,
  UserCheck,
  Users,
  CalendarDays,
  Menu,
  X,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronRight,
  User,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    badgeKey: null,
  },
  {
    name: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
    badgeKey: "coursesCount",
  },
  {
    name: "Notices",
    href: "/admin/notices",
    icon: Bell,
    badgeKey: "noticesCount",
  },
  {
    name: "Admission Requests",
    href: "/admin/admissions",
    icon: UserCheck,
    badgeKey: "pendingAdmissionsCount",
  },
  {
    name: "Students",
    href: "/admin/students",
    icon: Users,
    badgeKey: "studentsCount",
  },
  {
    name: "Batches",
    href: "/admin/batches",
    icon: CalendarDays,
    badgeKey: "batchesCount",
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    adminUser,
    courses,
    batches,
    notices,
    students,
    admissions,
    toasts,
    removeToast,
  } = useAdmin();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const sidebarRef = React.useRef<HTMLElement | null>(null);

  // Close mobile sidebar when clicking outside or pressing Escape
  React.useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const toggleBtn = document.getElementById("mobile-admin-menu-toggle");
      if (toggleBtn && toggleBtn.contains(event.target as Node)) {
        return;
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const pendingAdmissions = admissions.filter((a) => a.status === "Pending").length;

  const getBadgeValue = (key: string | null): number | null => {
    let count = 0;
    switch (key) {
      case "coursesCount":
        count = courses.length;
        break;
      case "noticesCount":
        count = notices.length;
        break;
      case "pendingAdmissionsCount":
        count = pendingAdmissions;
        break;
      case "studentsCount":
        count = students.length;
        break;
      case "batchesCount":
        count = batches.length;
        break;
      default:
        return null;
    }
    return count >= 1 ? count : null;
  };

  const isProfileActive = pathname === "/admin/profile";

  return (
    <div className="min-h-screen bg-[#fcf9f2] flex flex-col md:flex-row antialiased selection:bg-[#785610] selection:text-white">
      {/* Mobile Top Header (only visible on mobile to toggle sidebar) */}
      <div className="md:hidden flex items-center justify-between border-b border-[#e5dcc7] bg-[#fffdf8]/95 backdrop-blur-md px-4 py-2.5 sticky top-0 z-30">
        <Link href="/admin" className="flex items-center">
          <div className="relative h-11 w-44">
            <Image
              alt="Jamia Bukhari Admin Portal"
              src="/images/logo.png"
              fill
              sizes="176px"
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>
        <button
          id="mobile-admin-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 transition-colors z-50 relative"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/45 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200 cursor-pointer"
          aria-label="Close navigation"
          role="button"
          tabIndex={0}
        />
      )}

      {/* Left Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed md:sticky top-0 bottom-0 left-0 z-50 md:z-30 w-64 border-r border-[#e5dcc7] bg-[#fffdf8] flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } h-screen shadow-xl md:shadow-none`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#e5dcc7]/70 flex items-center">
          <Link href="/admin" className="block group">
            <div className="relative h-14 w-52">
              <Image
                alt="Jamia Bukhari Academy"
                src="/images/logo.png"
                fill
                sizes="208px"
                className="object-contain object-left transition-transform group-hover:scale-[1.02]"
                priority
              />
            </div>
          </Link>
        </div>

        {/* 6 Tabs Navigation */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Management
          </div>
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            const badgeVal = getBadgeValue(item.badgeKey);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-[#785610] text-white shadow-sm font-semibold border border-[#b48a3c]"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-600"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {badgeVal !== null && badgeVal >= 1 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-colors ${
                      isActive
                        ? "bg-[#5a3f07] text-[#ffdcc3]"
                        : item.badgeKey === "pendingAdmissionsCount"
                        ? "bg-amber-100 text-amber-900"
                        : "bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200"
                    }`}
                  >
                    {badgeVal}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Bottom: Admin Profile Link & Details */}
        <div className="p-3 border-t border-[#e5dcc7] bg-[#fcf9f2]">
          <Link
            href="/admin/profile"
            onClick={() => setMobileMenuOpen(false)}
            title="View Admin Profile"
            className={`flex items-center gap-3 p-2.5 rounded-xl transition-all group cursor-pointer ${
              isProfileActive
                ? "bg-[#785610] text-white shadow-sm font-semibold border border-[#b48a3c]"
                : "hover:bg-[#f5eedb]/80 border border-[#e5dcc7]/80 bg-white"
            }`}
          >
            <div
              className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                isProfileActive
                  ? "bg-white text-[#785610] shadow-xs"
                  : "bg-amber-100 text-amber-900 border border-amber-300"
              }`}
            >
              {adminUser.name
                ? adminUser.name
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                : "AD"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p
                  className={`text-xs font-bold truncate leading-tight ${
                    isProfileActive ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {adminUser.name}
                </p>
              </div>
              <p
                className={`text-[11px] truncate leading-tight mt-0.5 ${
                  isProfileActive ? "text-amber-100" : "text-zinc-500"
                }`}
              >
                {adminUser.role}
              </p>
            </div>
            <ChevronRight
              className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                isProfileActive ? "text-white" : "text-zinc-400"
              }`}
            />
          </Link>
        </div>
      </aside>

      {/* Main Content Layout (without redundant top bar) */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm transition-all animate-in slide-in-from-bottom-5 duration-200 bg-white ${
              toast.type === "success"
                ? "border-emerald-200 text-emerald-950"
                : toast.type === "error"
                ? "border-red-200 text-red-950"
                : "border-zinc-200 text-zinc-950"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : toast.type === "error" ? (
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 font-medium text-xs leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-zinc-600 p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
