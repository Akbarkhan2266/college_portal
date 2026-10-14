"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useAdminLoginMutation } from "@/lib/api/admin-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get("redirect") || "/admin";
  const sessionExpired = searchParams?.get("sessionExpired") === "true";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const loginMutation = useAdminLoginMutation();
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (sessionExpired) {
      setError("Your session has expired. Please log in again.");
    }
  }, [sessionExpired]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await loginMutation.mutateAsync({
        email: email.trim(),
        password: password.trim(),
        remember: rememberMe,
      });
      router.push(redirectTarget);
    } catch (err: any) {
      setError(
        err?.message || "Invalid credentials. Please verify your email and password."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f2] flex flex-col justify-center items-center p-4 selection:bg-[#785610] selection:text-white">
      {/* Background Subtle Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
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
              Admin Portal
            </span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-zinc-200/90 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg font-bold text-zinc-900">
              Sign in to Admin Portal
            </CardTitle>
            <CardDescription className="text-xs">
              Enter your verified staff credentials to access administrative modules.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-zinc-400" />
                  Staff Email Address
                </label>
                <Input
                  type="email"
                  placeholder="admin@jamia.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-zinc-400" />
                    Master Password
                  </label>
                  <span className="text-[11px] text-amber-800 font-medium cursor-pointer hover:underline">
                    Forgot?
                  </span>
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

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-zinc-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-zinc-300 text-amber-700 focus:ring-amber-500/20"
                  />
                  <span>Remember this terminal</span>
                </label>
                <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 256-bit Encrypted
                </span>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                variant="gold"
                disabled={loginMutation.isPending}
                className="w-full text-sm font-semibold h-10"
              >
                {loginMutation.isPending ? "Authenticating..." : "Sign In to Admin Portal"}
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
            ← Return to Public College Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#fcf9f2] flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-[#785610] border-t-transparent animate-spin" />
        </div>
      }
    >
      <AdminLoginForm />
    </React.Suspense>
  );
}
