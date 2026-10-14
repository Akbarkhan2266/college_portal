"use client";

import * as React from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  Building,
  Calendar,
  KeyRound,
  LogOut,
  RotateCw,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Lock,
  Edit3,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

// Helper to compute initials from name
function getInitials(name?: string) {
  if (!name) return "AD";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function AdminProfilePage() {
  const {
    adminUser,
    updateAdminProfile,
    changePassword,
    logout,
    queries,
    mutations,
  } = useAdmin();

  // Change password form state
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSubmittingPass, setIsSubmittingPass] = React.useState(false);
  const [passwordStatus, setPasswordStatus] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Edit profile dialog
  const [editProfileOpen, setEditProfileOpen] = React.useState(false);
  const [editName, setEditName] = React.useState(adminUser.name || "");
  const [editEmail, setEditEmail] = React.useState(adminUser.email || "");
  const [editPhone, setEditPhone] = React.useState(adminUser.phone || "");
  const [editDesignation, setEditDesignation] = React.useState(
    adminUser.designation || "System Administrator"
  );
  const [editError, setEditError] = React.useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);

  // Logout dialog
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  // Sync state with adminUser
  React.useEffect(() => {
    setEditName(adminUser.name || "");
    setEditEmail(adminUser.email || "");
    setEditPhone(adminUser.phone || "");
    setEditDesignation(adminUser.designation || "System Administrator");
  }, [adminUser]);

  // Refresh profile via GET /api/admin/me
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await queries.me.refetch();
    } finally {
      setRefreshing(false);
    }
  };

  // Change password via PATCH /api/admin/password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!currentPassword) {
      setPasswordStatus({
        type: "error",
        message: "Current password is required.",
      });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus({
        type: "error",
        message: "New password must be at least 6 characters long.",
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

    try {
      setIsSubmittingPass(true);
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setPasswordStatus({
        type: "success",
        message: "Account password has been successfully updated on the server.",
      });
    } catch (err: any) {
      setPasswordStatus({
        type: "error",
        message:
          err?.message ||
          "Failed to update password. Please ensure your current password is correct.",
      });
    } finally {
      setIsSubmittingPass(false);
    }
  };

  // Update profile via PATCH /api/admin/profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    if (!editName.trim()) {
      setEditError("Full name is required.");
      return;
    }
    if (!editEmail.trim()) {
      setEditError("Email address is required.");
      return;
    }

    try {
      setIsSavingProfile(true);
      await updateAdminProfile({
        name: editName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
        designation: editDesignation.trim(),
      });
      setEditProfileOpen(false);
    } catch (err: any) {
      setEditError(err?.message || "Failed to update profile on the server.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      {/* Page Header (Matching Student Profile Header) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Profile & Account
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage your administrative credentials, account details, and security settings
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing || queries.me.isLoading}
            className="text-xs h-9 px-3 flex-1 sm:flex-none text-zinc-600 border-zinc-200 hover:text-zinc-900 hover:bg-zinc-50"
          >
            <RotateCw
              className={`h-3.5 w-3.5 mr-1.5 text-[#785610] ${
                refreshing || queries.me.isLoading ? "animate-spin" : ""
              }`}
            />
            {refreshing || queries.me.isLoading ? "Refreshing..." : "Refresh"}
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

      {/* Synchronizing Banner if fetching from server */}
      {queries.me.isLoading && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin text-[#785610]" />
          <span>Synchronizing administrative profile with academy records...</span>
        </div>
      )}

      {/* Admin Identity Card (Matching Student Identity Card) */}
      <Card className="border-zinc-200 shadow-xs bg-white">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#785610] text-white font-bold text-base sm:text-lg flex items-center justify-center shrink-0 shadow-xs">
                {getInitials(adminUser.name)}
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold text-zinc-900 leading-tight">
                    {adminUser.name || "Administrator"}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
                  <span>
                    Role:{" "}
                    <span className="font-mono font-semibold text-zinc-800">
                      {adminUser.role || "Administrator"}
                    </span>
                  </span>
                  <span>•</span>
                  <span>{adminUser.designation || "System Administrator"}</span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-start sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-100 text-xs gap-1">
              <span className="text-zinc-400 text-[11px]">Academic Institution</span>
              <span className="font-semibold text-zinc-800">
                Jamia Bukhari Academy
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Administrative Information Card (Full Width with Clean Grid) */}
      <Card className="border-zinc-200 shadow-xs bg-white">
        <CardHeader className="py-4 px-5 border-b border-zinc-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              <User className="h-4 w-4 text-[#785610]" /> Administrative Information
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Verified staff credentials and access records
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditProfileOpen(true)}
            className="text-xs h-8 px-2.5 text-[#785610] border-[#e5dcc7] hover:bg-amber-50"
          >
            <Edit3 className="h-3 w-3 mr-1" /> Edit
          </Button>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-zinc-100 gap-1">
              <span className="text-zinc-500 flex items-center gap-2 shrink-0">
                <User className="h-3.5 w-3.5 text-zinc-400" /> Full Name
              </span>
              <span className="font-semibold text-zinc-900 sm:text-right">
                {adminUser.name || "Administrator"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-zinc-100 gap-1">
              <span className="text-zinc-500 flex items-center gap-2 shrink-0">
                <Shield className="h-3.5 w-3.5 text-zinc-400" /> System Role
              </span>
              <span className="font-mono font-semibold text-zinc-900 sm:text-right">
                {adminUser.role || "Administrator"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-zinc-100 gap-1">
              <span className="text-zinc-500 flex items-center gap-2 shrink-0">
                <Mail className="h-3.5 w-3.5 text-zinc-400" /> Official Email
              </span>
              <span className="font-medium text-zinc-900 sm:text-right break-all">
                {adminUser.email || "admin@college.com"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-zinc-100 gap-1">
              <span className="text-zinc-500 flex items-center gap-2 shrink-0">
                <Phone className="h-3.5 w-3.5 text-zinc-400" /> Contact Phone
              </span>
              <span className="font-medium text-zinc-900 sm:text-right">
                {adminUser.phone || "On file"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-zinc-100 gap-1">
              <span className="text-zinc-500 flex items-center gap-2 shrink-0">
                <Building className="h-3.5 w-3.5 text-zinc-400" /> Administrative Designation
              </span>
              <span className="font-medium text-zinc-900 sm:text-right">
                {adminUser.designation || "System Administrator"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-zinc-100 gap-1">
              <span className="text-zinc-500 flex items-center gap-2 shrink-0">
                <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" /> Account Status
              </span>
              <span className="font-medium text-zinc-900 sm:text-right">
                Verified & Authorized
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-zinc-100 gap-1">
              <span className="text-zinc-500 flex items-center gap-2 shrink-0">
                <Lock className="h-3.5 w-3.5 text-zinc-400" /> Security Clearance
              </span>
              <span className="font-medium text-zinc-900 sm:text-right">
                Level 1 Master Control
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-zinc-100 gap-1">
              <span className="text-zinc-500 flex items-center gap-2 shrink-0">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" /> Active Session
              </span>
              <span className="font-medium text-zinc-900 sm:text-right">
                Current Terminal (TLS 256-bit)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Card (Matching Student Change Password Layout) */}
      <Card className="border-zinc-200 shadow-xs bg-white">
        <CardHeader className="py-4 px-5 sm:px-6 border-b border-zinc-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-[#785610]" /> Change Password
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 mt-0.5">
                Update your account security password (minimum 6 characters)
              </CardDescription>
            </div>
            <span className="self-start sm:self-auto text-[11px] font-normal text-zinc-500 border border-zinc-200 px-2 py-0.5 rounded">
              Security Settings
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordStatus && (
              <div
                className={`p-3 text-xs rounded-lg flex items-center gap-2 ${
                  passwordStatus.type === "success"
                    ? "bg-amber-50 border border-amber-200 text-amber-900"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {passwordStatus.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#785610]" />
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
                    disabled={isSubmittingPass}
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
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isSubmittingPass}
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
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isSubmittingPass}
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

            <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-3">
              <span className="text-[11px] text-zinc-500 self-start sm:self-auto">
                Make sure your password is secure and not shared with anyone.
              </span>
              <Button
                type="submit"
                variant="gold"
                disabled={isSubmittingPass}
                className="text-xs h-9 px-4 w-full sm:w-auto"
              >
                {isSubmittingPass ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent maxWidth="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-zinc-900 font-serif">
              <Edit3 className="h-5 w-5 text-[#785610]" />
              Edit Administrator Details
            </DialogTitle>
            <DialogDescription>
              Update your display name, official email, contact phone, or designation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4 py-2">
            {editError && (
              <div className="p-3 text-xs rounded-lg flex items-center gap-2 bg-red-50 border border-red-200 text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{editError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Full Name *</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g. Administrator"
                className="h-10 text-xs sm:text-sm"
                required
                disabled={isSavingProfile}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Official Email *</label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="admin@college.com"
                className="h-10 text-xs sm:text-sm"
                required
                disabled={isSavingProfile}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Contact Phone</label>
              <Input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="h-10 text-xs sm:text-sm"
                disabled={isSavingProfile}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Designation</label>
              <Input
                value={editDesignation}
                onChange={(e) => setEditDesignation(e.target.value)}
                placeholder="e.g. System Administrator"
                className="h-10 text-xs sm:text-sm"
                disabled={isSavingProfile}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSavingProfile}
                onClick={() => setEditProfileOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="gold" disabled={isSavingProfile}>
                {isSavingProfile ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent maxWidth="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700 font-serif">
              <LogOut className="h-5 w-5 text-red-600" />
              Sign Out Confirmation
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to end your administrative session? You will be returned to the staff sign-in screen.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              disabled={mutations.logout.isPending}
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={mutations.logout.isPending}
              onClick={() => {
                setLogoutDialogOpen(false);
                logout();
              }}
            >
              {mutations.logout.isPending ? "Signing Out..." : "Sign Out Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
