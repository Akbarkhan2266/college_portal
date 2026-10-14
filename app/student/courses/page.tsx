"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Layers, User, CalendarDays, ArrowRight, RotateCw, Loader2 } from "lucide-react";
import { useStudent } from "@/lib/student-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function StudentCoursesPage() {
  const { courses, queries } = useStudent();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await queries.courses.refetch();
    setRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            My Enrolled Courses
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Academic programs you are currently registered for in this session
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing || queries.courses.isLoading}
          className="text-xs h-8 px-2.5 text-zinc-600 border-zinc-200 hover:text-zinc-900 hover:bg-zinc-50 self-start sm:self-auto"
        >
          <RotateCw
            className={`h-3.5 w-3.5 mr-1.5 text-[#785610] ${
              refreshing || queries.courses.isLoading ? "animate-spin" : ""
            }`}
          />
          {refreshing || queries.courses.isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Loading banner */}
      {queries.courses.isLoading && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin text-[#785610]" />
          <span>Loading your enrolled courses from server...</span>
        </div>
      )}

      {/* Course Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="border-zinc-200 shadow-xs bg-white flex flex-col justify-between hover:border-amber-300 transition-colors"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-[#785610] text-[11px] font-semibold border border-amber-200/60">
                    <Layers className="h-3 w-3" /> {course.batchName}
                  </div>
                  <CardTitle className="text-base font-bold text-zinc-900 leading-snug">
                    {course.name}
                  </CardTitle>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <CardDescription className="text-xs text-zinc-500 mt-2 leading-relaxed">
                {course.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="py-2">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-zinc-400" /> Instructor:
                  </span>
                  <span className="font-semibold text-zinc-900">{course.instructor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-zinc-400" /> Level:
                  </span>
                  <span className="font-medium text-zinc-800">{course.academicYear}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-3 border-t border-zinc-100 flex items-center justify-end">
              <Link href="/student/batches">
                <Button variant="outline" size="sm" className="text-xs">
                  <CalendarDays className="h-3.5 w-3.5 mr-1 text-[#785610]" /> View Batch Schedule
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}

        {!queries.courses.isLoading && courses.length === 0 && (
          <div className="col-span-2 p-12 text-center bg-white rounded-xl border border-dashed border-zinc-300">
            <BookOpen className="h-8 w-8 text-zinc-300 mx-auto" />
            <h3 className="text-sm font-semibold text-zinc-700 mt-2">
              No courses registered
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              You are not currently enrolled in any academic courses. Please contact the administration office.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
