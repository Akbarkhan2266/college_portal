"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  KeyRound,
  LogOut,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Shield,
  RotateCw,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { useStudent } from "@/lib/student-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export default function StudentProfilePage() {
  const {
    student,
    courses,
    changePassword,
    logout,
    queries,
    updatePasswordMutation,
    logoutMutation,
  } = useStudent();

  // Change password form state
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [passwordStatus, setPasswordStatus] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Logout dialog
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await queries.profile.refetch();
    setRefreshing(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!currentPassword) {
      setPasswordStatus({
        type: "error",
        message: "Current password is required.",
      });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordStatus({
        type: "error",
        message: "New password must be at least 8 characters long.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        type: "error",
        message: "New passwords do not match.",
      });
      return;
    }

    changePassword(currentPassword, newPassword);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Profile & Account
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage your student details, enrolled courses, and security settings
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing || queries.profile.isLoading}
            className="text-xs h-9 px-3 flex-1 sm:flex-none text-zinc-600 border-zinc-200 hover:text-zinc-900 hover:bg-zinc-50"
          >
            <RotateCw
              className={`h-3.5 w-3.5 mr-1.5 text-[#785610] ${
                refreshing || queries.profile.isLoading ? "animate-spin" : ""
              }`}
            />
            {refreshing || queries.profile.isLoading ? "Refreshing..." : "Refresh"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setLogoutDialogOpen(true)}
            className="text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 h-9 px-3.5 flex-1 sm:flex-none font-medium"
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" /> Log Out
          </Button>
        </div>
      </div>

      {/* Loading banner */}
      {queries.profile.isLoading && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin text-[#785610]" />
          <span>Synchronizing profile information with academy records...</span>
        </div>
      )}

      {/* Student Identity Card */}
      <Card className="border-zinc-200 shadow-xs bg-white">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#785610] text-white font-bold text-base sm:text-lg flex items-center justify-center shrink-0 shadow-xs">
                {student.name
                  ? student.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                  : "ST"}
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold text-zinc-900 leading-tight">
                    {student.name}
                  </h2>
                  <Badge variant="success" className="text-[10px]">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
                  <span>
                    Roll / ID:{" "}
                    <span className="font-mono font-semibold text-zinc-800">
                      {student.rollNumber}
                    </span>
                  </span>
                  <span>•</span>
                  <span>{student.program || "Student Portal"}</span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-start sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-100 text-xs">
              <span className="text-zinc-400 text-[11px]">Academic Year</span>
              <span className="font-semibold text-zinc-800">
                {student.academicYear || "2026-2027"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upper Grid: Personal Information (Left) + Academic Course Registrations (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Personal & Contact Details */}
        <Card className="border-zinc-200 shadow-xs bg-white">
          <CardHeader className="py-4 px-5 border-b border-zinc-100">
            <CardTitle className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              <User className="h-4 w-4 text-[#785610]" /> Personal Information
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Verified records on file (Read-only; updates require administration)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-zinc-100 gap-1">
              <span className="text-zinc-500 flex items-center gap-2 shrink-0">
                <User className="h-3.5 w-3.5 text-zinc-400" /> Full Name
              </span>
              <span className="font-semibold text-zinc-900 sm:text-right">
                {student.name}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-zinc-100 gap-1">
              <span className="text-zinc-500 flex items-center gap-2 shrink-0">
                <Shield className="h-3.5 w-3.5 text-zinc-400" /> Student Login ID
              </span>
              <span className="font-mono font-semibold text-zinc-900 sm:text-right">
                {student.rollNumber}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-zinc-100 gap-1">
              <span className="text-zinc-500 flex items-center gap-2 shrink-0">
                <Mail className="h-3.5 w-3.5 text-zinc-400" /> Email Address
              </span>
              <span className="font-medium text-zinc-900 sm:text-right break-all">
                {student.email || "—"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-zinc-100 gap-1">
              <span className="text-zinc-500 flex items-center gap-2 shrink-0">
                <Phone className="h-3.5 w-3.5 text-zinc-400" /> Phone Number
              </span>
              <span className="font-medium text-zinc-900 sm:text-right">
                {student.phone || "—"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-zinc-100 gap-1">
              <span className="text-zinc-500 flex items-center gap-2 shrink-0">
                <User className="h-3.5 w-3.5 text-zinc-400" /> Guardian / Parent
              </span>
              <span className="font-medium text-zinc-900 sm:text-right">
                {student.guardianName || "—"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-zinc-100 gap-1">
              <span className="text-zinc-500 flex items-center gap-2 shrink-0">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" /> Date of Birth
              </span>
              <span className="font-medium text-zinc-900 sm:text-right">
                {student.joinedDate !== "—" ? student.joinedDate : "On file"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between py-1.5 gap-1">
              <span className="text-zinc-500 flex items-center gap-2 shrink-0">
                <MapPin className="h-3.5 w-3.5 text-zinc-400" /> Address
              </span>
              <span className="font-medium text-zinc-900 sm:text-right max-w-full sm:max-w-[260px] leading-relaxed">
                {student.address || "—"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Academic Course Registrations (Placed above Change Password) */}
        <Card className="border-zinc-200 shadow-xs bg-white flex flex-col h-full">
          <CardHeader className="py-4 px-5 border-b border-zinc-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-[#785610]" /> Academic Course Registrations
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Verified active enrollments for this session
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-semibold shrink-0">
              {courses.length} Enrolled
            </Badge>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col justify-between">
            <div className="divide-y divide-zinc-100">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs hover:bg-zinc-50/50 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <span className="font-bold text-zinc-900 text-sm block truncate">
                      {course.name}
                    </span>
                    <p className="text-zinc-500 text-xs">
                      Assigned Cohort:{" "}
                      <span className="font-semibold text-zinc-800">
                        {course.batchName}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    <span className="text-zinc-500 text-[11px]">
                      Level: {course.academicYear}
                    </span>
                    <Badge variant="success" className="text-[10px]">
                      Active
                    </Badge>
                  </div>
                </div>
              ))}

              {courses.length === 0 && (
                <div className="text-center py-8 px-4 space-y-1">
                  <BookOpen className="h-6 w-6 text-zinc-300 mx-auto" />
                  <p className="text-xs font-medium text-zinc-500">
                    No active courses currently assigned.
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Contact administration if you believe this is an error.
                  </p>
                </div>
              )}
            </div>

            <div className="p-3.5 sm:px-5 border-t border-zinc-100 bg-zinc-50/40 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">
                Need course details or syllabus?
              </span>
              <Link
                href="/student/courses"
                className="text-xs font-semibold text-[#785610] hover:underline inline-flex items-center gap-1"
              >
                View Courses <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Change Password (Positioned at the Bottom) */}
      <Card className="border-zinc-200 shadow-xs bg-white">
        <CardHeader className="py-4 px-5 sm:px-6 border-b border-zinc-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-[#785610]" /> Change Password
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 mt-0.5">
                Update your account security password (minimum 8 characters)
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="self-start sm:self-auto text-[11px] font-normal text-zinc-500 border-zinc-200"
            >
              Security Settings
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordStatus && (
              <div
                className={`p-3 text-xs rounded-lg flex items-center gap-2 ${
                  passwordStatus.type === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {passwordStatus.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                )}
                <span>{passwordStatus.message}</span>
              </div>
            )}

            {/* Responsive 3-Column Password Fields on Desktop / 1-Column on Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  Current Password *
                </label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="pr-9 text-xs sm:text-sm h-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  New Password *
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="pr-9 text-xs sm:text-sm h-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pr-9 text-xs sm:text-sm h-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-100">
              <p className="text-[11px] text-zinc-500">
                Password must be at least 8 characters long. Keep your credentials secure.
              </p>
              <Button
                type="submit"
                variant="gold"
                disabled={updatePasswordMutation.isPending}
                className="w-full sm:w-auto text-xs h-9 px-6 font-semibold"
              >
                {updatePasswordMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating Password...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent maxWidth="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <LogOut className="h-4 w-4" /> Sign Out
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to end your student session? You will need your Roll ID and password to sign back in.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={logoutMutation.isPending}
              onClick={() => {
                setLogoutDialogOpen(false);
                logout();
              }}
            >
              {logoutMutation.isPending ? "Signing out..." : "Yes, Sign Out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
