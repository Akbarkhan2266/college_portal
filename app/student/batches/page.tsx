"use client";

import * as React from "react";
import {
  CalendarDays,
  User,
  Clock,
  Video,
  ExternalLink,
  Layers,
  GraduationCap,
  Mail,
  AlertCircle,
  RotateCw,
  Loader2,
} from "lucide-react";
import { useStudent } from "@/lib/student-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function StudentBatchesPage() {
  const { batches, queries } = useStudent();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await queries.batches.refetch();
    setRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Enrolled Batches & Timetables
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            View your assigned cohorts, designated instructors, weekly schedules, and classroom links
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing || queries.batches.isLoading}
          className="text-xs h-8 px-2.5 text-zinc-600 border-zinc-200 hover:text-zinc-900 hover:bg-zinc-50 self-start sm:self-auto"
        >
          <RotateCw
            className={`h-3.5 w-3.5 mr-1.5 text-[#785610] ${
              refreshing || queries.batches.isLoading ? "animate-spin" : ""
            }`}
          />
          {refreshing || queries.batches.isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Loading banner */}
      {queries.batches.isLoading && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin text-[#785610]" />
          <span>Retrieving your batches and timetable schedule from server...</span>
        </div>
      )}

      {/* Batches Cards List */}
      <div className="space-y-6">
        {batches.map((batch) => (
          <Card
            key={batch.id}
            className="border-zinc-200 shadow-xs bg-white overflow-hidden"
          >
            <CardHeader className="pb-4 border-b border-zinc-100 bg-zinc-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-semibold text-[#785610] uppercase tracking-wider">
                    {batch.courseName}
                  </div>
                  <CardTitle className="text-lg font-bold text-zinc-900 mt-0.5">
                    {batch.name}
                  </CardTitle>
                </div>
                <div>
                  {batch.isLiveNow ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" /> Live Now
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" /> Scheduled
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-5">
              {/* Teacher Info */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
                <div className="h-10 w-10 rounded-full bg-[#fbf0cc] text-[#785610] border border-[#d4a017]/40 flex items-center justify-center font-bold text-sm">
                  {batch.teacherName ? batch.teacherName.charAt(0) : "T"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-900 leading-tight">
                    {batch.teacherName}
                  </p>
                  <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">
                    Faculty Instructor • {batch.teacherEmail}
                  </p>
                </div>
              </div>

              {/* Weekly Schedule Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-[#785610]" /> Weekly Timetable
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {batch.schedule.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-3 rounded-xl border border-zinc-200 bg-white space-y-1 text-xs"
                    >
                      <span className="font-bold text-zinc-900 block">{slot.day}</span>
                      <p className="text-[11px] text-zinc-600 font-medium">
                        {slot.startTime} - {slot.endTime}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Join Button or Disabled State with Next Class */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-100">
                <div className="text-xs text-zinc-600">
                  {batch.isLiveNow ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      Classroom is active. Click to join Google Meet.
                    </span>
                  ) : (
                    <span className="text-zinc-500 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" />
                      Next Class: {batch.nextClassText || "Check schedule for upcoming timing"}
                    </span>
                  )}
                </div>

                <div>
                  {batch.meetingLink ? (
                    <a
                      href={batch.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block"
                    >
                      <Button
                        variant={batch.isLiveNow ? "gold" : "outline"}
                        className="text-xs h-9 px-5 font-semibold"
                      >
                        <Video className="h-4 w-4" />
                        {batch.isLiveNow ? "Join Class (Live)" : "Join Classroom"}
                      </Button>
                    </a>
                  ) : (
                    <Button
                      variant="outline"
                      disabled
                      className="text-xs h-9 px-5 opacity-60 cursor-not-allowed"
                    >
                      <Video className="h-4 w-4 mr-1 text-zinc-400" /> Link posted before class
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {!queries.batches.isLoading && batches.length === 0 && (
          <div className="p-12 text-center bg-white rounded-xl border border-dashed border-zinc-300">
            <CalendarDays className="h-8 w-8 text-zinc-300 mx-auto" />
            <h3 className="text-sm font-semibold text-zinc-700 mt-2">
              No batches assigned
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              You are not currently assigned to any active batch cohorts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
