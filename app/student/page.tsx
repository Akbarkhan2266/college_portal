"use client";

import * as React from "react";
import Link from "next/link";
import {
  Video,
  Clock,
  CalendarDays,
  Bell,
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronRight,
  RotateCw,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useStudent } from "@/lib/student-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function StudentDashboardPage() {
  const {
    student,
    courses,
    notices,
    todayClasses,
    queries,
    isLoading,
    refetchAll,
  } = useStudent();

  const [refreshing, setRefreshing] = React.useState(false);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    refetchAll();
    setTimeout(() => setRefreshing(false), 800);
  };

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

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Assalamu Alaikum, {student.name ? student.name.split(" ")[0] : "Student"} 👋
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Roll ID: <span className="font-mono text-zinc-700 font-semibold">{student.rollNumber}</span> • {student.program}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={refreshing || isLoading}
            className="text-xs h-8 px-2.5 text-zinc-600 border-zinc-200 hover:text-zinc-900 hover:bg-zinc-50"
          >
            <RotateCw
              className={`h-3.5 w-3.5 mr-1.5 text-[#785610] ${
                refreshing || isLoading ? "animate-spin" : ""
              }`}
            />
            {refreshing || isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Loading banner */}
      {queries.dashboard.isLoading && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin text-[#785610]" />
          <span>Synchronizing live classes and notices with the academy server...</span>
        </div>
      )}

      {/* 1. Latest Notices (Full Width on Top) */}
      <Card className="border-zinc-200 shadow-xs bg-white w-full">
        <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-5 border-b border-zinc-100">
          <div>
            <CardTitle className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#785610]" /> Latest Notices & Announcements
            </CardTitle>
            <CardDescription className="text-xs">
              Official circulars and academic updates
            </CardDescription>
          </div>
          <Link
            href="/student/notices"
            className="text-xs font-semibold text-[#785610] hover:underline flex items-center gap-1 group"
          >
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </CardHeader>

        <CardContent className="p-3 sm:p-4 space-y-2">
          {latestNotices.length > 0 ? (
            latestNotices.map((notice) => (
              <Link
                key={notice.id}
                href="/student/notices"
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl border border-zinc-100 bg-zinc-50/60 hover:bg-amber-50/40 hover:border-amber-200 transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Badge variant={getNoticeCategoryVariant(notice.category) as any} className="shrink-0">
                    {notice.category}
                  </Badge>
                  <p className="text-xs font-semibold text-zinc-900 group-hover:text-[#785610] transition-colors truncate">
                    {notice.title}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 shrink-0 self-end sm:self-auto">
                  <span>{notice.date}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-[#785610] transition-colors" />
                </div>
              </Link>
            ))
          ) : (
            <p className="text-xs text-zinc-400 text-center py-4">
              No recent announcements published.
            </p>
          )}
        </CardContent>
      </Card>

      {/* 2. Classes & Courses Grid (Below Notices) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Today's Classes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-[#785610]" /> Today's Classes
            </h2>
            <Badge variant="outline" className="text-[10px] font-normal">
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </Badge>
          </div>

          {todayClasses.length > 0 ? (
            todayClasses.map((cls) => (
              <Card
                key={cls.id}
                className="border-zinc-200 shadow-xs bg-white overflow-hidden relative"
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-[#785610] uppercase tracking-wider">
                        {cls.name}
                      </span>
                      <h3 className="text-base font-bold text-zinc-900 leading-snug">
                        {cls.courseName}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Instructor: <span className="font-medium text-zinc-800">{cls.teacherName}</span>
                      </p>
                    </div>

                    {cls.isLiveNow ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" /> Live Now
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200 shrink-0">
                        <Clock className="h-3 w-3 text-zinc-400" /> Scheduled
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-600 pt-1 border-t border-zinc-100">
                    <Clock className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="font-semibold text-zinc-900">
                      {cls.schedule[0] ? `${cls.schedule[0].startTime} - ${cls.schedule[0].endTime}` : cls.nextClassText || "Class Session"}
                    </span>
                  </div>

                  {cls.meetingLink ? (
                    <a
                      href={cls.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <Button
                        variant={cls.isLiveNow ? "gold" : "outline"}
                        className="w-full text-xs h-9 font-semibold"
                      >
                        <Video className="h-4 w-4" />
                        {cls.isLiveNow ? "Join Class (Google Meet)" : "Open Virtual Classroom"}
                      </Button>
                    </a>
                  ) : (
                    <Button variant="outline" disabled className="w-full text-xs h-9">
                      <Video className="h-4 w-4 mr-1 text-zinc-400" />
                      Link posted before class starts
                    </Button>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <Card className="border-dashed border-zinc-300 shadow-none bg-white">
              <CardContent className="p-8 text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-amber-50 text-[#785610] flex items-center justify-center mx-auto border border-amber-200/60">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-zinc-900">
                    No class today
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    You have no scheduled lectures for today. Use this time for reading, revision, or self-study.
                  </p>
                </div>
                <div className="pt-2">
                  <Link href="/student/batches">
                    <Button variant="outline" size="sm" className="text-xs">
                      View Weekly Schedule
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* My Enrolled Courses */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-[#785610]" /> My Courses ({courses.length})
            </h2>
            <Link
              href="/student/courses"
              className="text-xs font-semibold text-[#785610] hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <Card className="border-zinc-200 shadow-xs bg-white">
            <CardContent className="p-4 space-y-3">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div
                    key={course.id}
                    className="p-3.5 rounded-xl border border-zinc-100 bg-zinc-50/60 hover:bg-zinc-50 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-zinc-900 truncate">
                        {course.name}
                      </h4>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                        {course.batchName} • {course.instructor}
                      </p>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400 text-center py-4">
                  No courses registered yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
