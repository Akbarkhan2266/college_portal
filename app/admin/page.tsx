"use client";

import * as React from "react";
import Link from "next/link";
import {
  UserCheck,
  Users,
  BookOpen,
  CalendarDays,
  Plus,
  ArrowRight,
  Clock,
  Megaphone,
  RotateCw,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminDashboardPage() {
  const { courses, batches, notices, students, admissions, isLoading, refetchAll } = useAdmin();

  // Metrics
  const pendingAdmissionsCount = admissions.filter((a) => a.status === "Pending").length;
  const totalStudentsCount = students.length;
  const totalCoursesCount = courses.length;
  const activeBatchesCount = batches.filter((b) => b.status === "Active").length;

  // Latest 5 Admission Requests
  const latestAdmissions = admissions.slice(0, 5);

  // Latest 3 Notices
  const latestNotices = notices.slice(0, 3);

  const getNoticeCategoryVariant = (category: string) => {
    switch (category) {
      case "Urgent":
        return "destructive";
      case "Holiday":
        return "warning";
      case "Exam":
        return "purple";
      case "New Batch":
        return "success";
      default:
        return "secondary";
    }
  };

  const getAdmissionStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge variant="success">Approved</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Overview of admissions, courses, batches, and student enrollments
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchAll()}
            disabled={isLoading}
            className="text-xs text-zinc-600 h-9 shrink-0"
          >
            <RotateCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Link href="/admin/admissions" className="flex-1 sm:flex-initial">
            <Button variant="gold" size="sm" className="h-9 w-full sm:w-auto">
              <UserCheck className="h-4 w-4" /> Review Admissions ({pendingAdmissionsCount})
            </Button>
          </Link>
          <Link href="/admin/courses" className="shrink-0">
            <Button variant="outline" size="sm" className="h-9">
              <Plus className="h-4 w-4" /> Add Course
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Admissions */}
        <Card className="border-zinc-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Pending Admissions
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <UserCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">
              {pendingAdmissionsCount}
            </div>
            <p className="text-xs text-amber-800 font-medium flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" /> Awaiting review
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Total Students */}
        <Card className="border-zinc-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Total Students
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">
              {totalStudentsCount}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Registered students
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Total Courses */}
        <Card className="border-zinc-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Total Courses
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <BookOpen className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">
              {totalCoursesCount}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {courses.filter((c) => c.status === "Active").length} active courses
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Active Batches */}
        <Card className="border-zinc-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Active Batches
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <CalendarDays className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">
              {activeBatchesCount}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Currently running
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Latest Admission Requests & Latest Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Latest Admission Requests */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-zinc-200 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-sm font-semibold text-zinc-900">
                  Latest Admission Requests
                </CardTitle>
                <CardDescription className="text-xs">
                  5 most recent applications
                </CardDescription>
              </div>
              <Link
                href="/admin/admissions"
                className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 group"
              >
                <span>View all</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto w-full">
                <Table className="min-w-[620px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {latestAdmissions.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium text-zinc-900 py-3">
                        <div>
                          <p className="text-xs font-semibold text-zinc-900">
                            {req.applicantName}
                          </p>
                          <p className="text-[11px] text-zinc-400">{req.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-zinc-600">
                        {req.courseName}
                      </TableCell>
                      <TableCell className="text-xs text-zinc-500">
                        {req.date}
                      </TableCell>
                      <TableCell>{getAdmissionStatusBadge(req.status)}</TableCell>
                      <TableCell className="text-right py-2">
                        <Link href="/admin/admissions">
                          <Button variant="outline" size="sm" className="h-7 text-xs px-2.5">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {latestAdmissions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-zinc-400 text-xs">
                        No admission requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          </Card>
        </div>

        {/* Right Column (1 span): Latest Notices */}
        <div className="space-y-4">
          <Card className="border-zinc-200 shadow-xs h-full flex flex-col justify-between">
            <div>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div>
                  <CardTitle className="text-sm font-semibold text-zinc-900 flex items-center gap-1.5">
                    <Megaphone className="h-4 w-4 text-amber-700" /> Latest Notices
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Recent announcements
                  </CardDescription>
                </div>
                <Link
                  href="/admin/notices"
                  className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 group"
                >
                  <span>View all</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {latestNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-3 rounded-lg border border-zinc-100 bg-zinc-50/60 hover:bg-zinc-50 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={getNoticeCategoryVariant(notice.category) as any}>
                        {notice.category}
                      </Badge>
                      <span className="text-[11px] text-zinc-400">{notice.date}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-900 line-clamp-2 leading-snug">
                      {notice.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                      {notice.description}
                    </p>
                    {notice.showOnTicker && (
                      <div className="pt-1 flex items-center gap-1 text-[10px] text-amber-800 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                        Ticker Active
                      </div>
                    )}
                  </div>
                ))}
                {latestNotices.length === 0 && (
                  <div className="text-center py-6 text-zinc-400 text-xs">
                    No notices published.
                  </div>
                )}
              </CardContent>
            </div>

            <div className="p-4 border-t border-zinc-100">
              <Link href="/admin/notices">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Notice
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
