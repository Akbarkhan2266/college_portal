"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { useStudentLoginMutation } from "@/lib/api/student-queries";

export default function StudentLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [clientError, setClientError] = React.useState("");
  const [sessionExpiredNotice, setSessionExpiredNotice] = React.useState(false);

  const loginMutation = useStudentLoginMutation();

  // Forgot password dialog
  const [forgotDialogOpen, setForgotDialogOpen] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState("");
  const [resetSent, setResetSent] = React.useState(false);

  // Check for expired session or remembered student ID on client mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("sessionExpired") === "true") {
        setSessionExpiredNotice(true);
      }
      const savedId = localStorage.getItem("student_remembered_id");
      if (savedId) {
        setIdentifier(savedId);
        setRememberMe(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setClientError("");

    if (!identifier.trim()) {
      setClientError("Please enter your Student ID or Roll Number.");
      return;
    }
    if (!password) {
      setClientError("Please enter your password.");
      return;
    }

    if (rememberMe) {
      if (typeof window !== "undefined") {
        localStorage.setItem("student_remembered_id", identifier.trim());
      }
    } else {
      if (typeof window !== "undefined") {
        localStorage.removeItem("student_remembered_id");
      }
    }

    loginMutation.mutate({
      studentId: identifier.trim(),
      password,
      remember: rememberMe,
    });
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-[#fcf9f2] flex flex-col justify-center items-center p-4 selection:bg-[#785610] selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Icon & Heading */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="relative h-16 w-56 flex items-center justify-center">
            <Image
              alt="Al Jamia Tul Bukhari Academy"
              src="/images/logo.png"
              fill
              sizes="224px"
              className="object-contain"
              priority
            />
          </Link>
          <div className="inline-flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#785610] bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Student Portal
            </span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-zinc-200 shadow-sm bg-white">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-base font-bold text-zinc-900">
              Sign in to Student Portal
            </CardTitle>
            <CardDescription className="text-xs">
              Enter your Roll Number or registered email to access your classes and timetable.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {sessionExpiredNotice && (
                <div className="p-3 text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>Your session ended. Please log in again to continue.</span>
                </div>
              )}

              {(clientError || loginMutation.isError) && (
                <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>
                    {clientError ||
                      (loginMutation.error as any)?.data?.message ||
                      (loginMutation.error as any)?.message ||
                      "Failed to sign in. Please verify your student ID and password."}
                  </span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-zinc-400" />
                  Student ID or Roll Number
                </label>
                <Input
                  placeholder="e.g. 001 or 1"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-zinc-400" />
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(identifier || "");
                      setResetSent(false);
                      setForgotDialogOpen(true);
                    }}
                    className="text-[11px] text-[#785610] font-medium hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="pt-1 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-zinc-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-300 text-[#785610] accent-[#785610] focus:ring-[#785610]/20 cursor-pointer"
                    />
                    <span className="font-medium text-xs text-zinc-700">Remember me on this device</span>
                  </label>
                </div>
                <p className="text-[11px] text-zinc-400 pl-6 leading-tight">
                  Leave unchecked on public devices so you will be prompted to log in each time.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                variant="gold"
                disabled={loginMutation.isPending}
                className="w-full text-sm font-semibold h-10"
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In to Portal"}
                {!loginMutation.isPending && <ArrowRight className="h-4 w-4 ml-1" />}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Back to Home Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors inline-flex items-center gap-1"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotDialogOpen} onOpenChange={setForgotDialogOpen}>
        <DialogContent maxWidth="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-[#785610]" /> Reset Student Password
            </DialogTitle>
            <DialogDescription>
              Enter your registered student email address. We will send an official password reset link.
            </DialogDescription>
          </DialogHeader>

          {resetSent ? (
            <div className="py-4 space-y-3 text-center">
              <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-xs text-zinc-700 font-medium">
                Reset instructions dispatched to <strong>{resetEmail}</strong>. Please check your inbox.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setForgotDialogOpen(false)}
                className="mt-2 text-xs"
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Registered Email Address *
                </label>
                <Input
                  type="email"
                  placeholder="student@jamia.edu"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForgotDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="gold">
                  Send Reset Link
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
