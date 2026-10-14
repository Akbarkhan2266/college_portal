"use client";

import * as React from "react";
import {
  Plus,
  Filter,
  Search,
  CalendarDays,
  Edit2,
  Trash2,
  Eye,
  Users,
  Video,
  Clock,
  Trash,
  AlertTriangle,
  X,
  FileQuestion,
  ExternalLink,
  GraduationCap,
  Sparkles,
  RotateCw,
  Loader2,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { AdminBatch, AdminStudent, AdminStudentEnrollment, ScheduleSlot } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const DAYS_OF_WEEK: ScheduleSlot["day"][] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function BatchesPage() {
  const { batches, courses, students, addBatch, updateBatch, deleteBatch, queries } = useAdmin();
  const isBatchesLoading = queries.batches.isLoading || queries.batches.isFetching;

  // Filter state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [courseFilter, setCourseFilter] = React.useState<string>("All");
  const [statusFilter, setStatusFilter] = React.useState<"All" | "Active" | "Inactive">("All");

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingBatch, setEditingBatch] = React.useState<AdminBatch | null>(null);

  // Form Fields
  const [courseId, setCourseId] = React.useState("");
  const [batchName, setBatchName] = React.useState("");
  const [teacherName, setTeacherName] = React.useState("");
  const [meetingLink, setMeetingLink] = React.useState("");
  const [capacity, setCapacity] = React.useState<number>(30);
  const [status, setStatus] = React.useState<"Active" | "Inactive">("Active");
  const [scheduleRows, setScheduleRows] = React.useState<ScheduleSlot[]>([]);
  const [formError, setFormError] = React.useState("");

  // Batch Detail Modal state
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);
  const [selectedBatch, setSelectedBatch] = React.useState<AdminBatch | null>(null);

  // Delete Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [batchToDelete, setBatchToDelete] = React.useState<AdminBatch | null>(null);

  // Helper to match student enrollment with batch
  const doesStudentMatchBatch = (stu: AdminStudent, batchId: string, batchName?: string) => {
    if (!stu.enrollments || stu.enrollments.length === 0) return false;
    return stu.enrollments.some((enr: AdminStudentEnrollment) => {
      if (enr.batchId && String(enr.batchId) === String(batchId)) return true;
      if (
        batchName &&
        enr.batchName &&
        enr.batchName.trim().toLowerCase() === batchName.trim().toLowerCase()
      ) {
        return true;
      }
      return false;
    });
  };

  // Count enrolled students per batch
  const getEnrolledCount = (batchOrId: AdminBatch | string) => {
    const batch = typeof batchOrId === "string" ? batches.find((b) => b.id === batchOrId) : batchOrId;
    const batchId = typeof batchOrId === "string" ? batchOrId : batchOrId.id;
    const batchName = batch?.name;

    const matchedStudentsCount = students.filter((s) => doesStudentMatchBatch(s, batchId, batchName)).length;
    const backendCount = typeof batch?.enrolledCount === "number" ? batch.enrolledCount : 0;

    return Math.max(matchedStudentsCount, backendCount);
  };

  // Get enrolled students list for a batch
  const getEnrolledStudents = (batchOrId: AdminBatch | string) => {
    const batch = typeof batchOrId === "string" ? batches.find((b) => b.id === batchOrId) : batchOrId;
    const batchId = typeof batchOrId === "string" ? batchOrId : batchOrId.id;
    const batchName = batch?.name;

    return students.filter((s) => doesStudentMatchBatch(s, batchId, batchName));
  };

  // Format schedule summary string
  const formatTimingSummary = (slots: ScheduleSlot[]) => {
    if (!slots || slots.length === 0) return "No schedule set";
    const daysShort = slots
      .map((s) => s.day.substring(0, 3))
      .join(", ");
    const sampleTime = `${slots[0].startTime} - ${slots[0].endTime}`;
    return `${daysShort} • ${sampleTime}`;
  };

  // Open Create
  const handleOpenCreate = () => {
    setEditingBatch(null);
    setCourseId(courses.length > 0 ? courses[0].id : "");
    setBatchName("");
    setTeacherName("");
    setMeetingLink("");
    setCapacity(30);
    setStatus("Active");
    setScheduleRows([
      { id: "s-1", day: "Monday", startTime: "09:00 AM", endTime: "12:00 PM" },
      { id: "s-2", day: "Wednesday", startTime: "09:00 AM", endTime: "12:00 PM" },
    ]);
    setFormError("");
    setModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (batch: AdminBatch) => {
    setEditingBatch(batch);
    setCourseId(batch.courseId);
    setBatchName(batch.name);
    setTeacherName(batch.teacherName);
    setMeetingLink(batch.meetingLink);
    setCapacity(batch.capacity);
    setStatus(batch.status);
    setScheduleRows(batch.schedule || []);
    setFormError("");
    setModalOpen(true);
  };

  // Schedule Rows handlers
  const handleAddScheduleRow = () => {
    const newId = `slot-${Date.now()}`;
    setScheduleRows([
      ...scheduleRows,
      { id: newId, day: "Tuesday", startTime: "09:00 AM", endTime: "12:00 PM" },
    ]);
  };

  const handleRemoveScheduleRow = (index: number) => {
    setScheduleRows(scheduleRows.filter((_, idx) => idx !== index));
  };

  const handleUpdateScheduleRow = (
    index: number,
    field: keyof ScheduleSlot,
    val: string
  ) => {
    setScheduleRows(
      scheduleRows.map((row, idx) =>
        idx === index ? { ...row, [field]: val } : row
      )
    );
  };

  // Open Detail
  const handleOpenDetail = (batch: AdminBatch) => {
    setSelectedBatch(batch);
    setDetailModalOpen(true);
  };

  // Open Delete
  const handleOpenDelete = (batch: AdminBatch) => {
    setBatchToDelete(batch);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (batchToDelete) {
      deleteBatch(batchToDelete.id);
      setDeleteDialogOpen(false);
      setBatchToDelete(null);
    }
  };

  // Submit Form
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName.trim()) {
      setFormError("Batch name is required.");
      return;
    }
    if (!teacherName.trim()) {
      setFormError("Instructor/Teacher name is required.");
      return;
    }
    if (!courseId) {
      setFormError("Please select a parent course.");
      return;
    }

    if (editingBatch) {
      updateBatch(editingBatch.id, {
        courseId,
        name: batchName.trim(),
        teacherName: teacherName.trim(),
        meetingLink: meetingLink.trim(),
        capacity: Number(capacity) || 30,
        status,
        schedule: scheduleRows,
      });
    } else {
      addBatch({
        courseId,
        name: batchName.trim(),
        teacherName: teacherName.trim(),
        meetingLink: meetingLink.trim(),
        capacity: Number(capacity) || 30,
        status,
        schedule: scheduleRows,
      });
    }

    setModalOpen(false);
  };

  // Filtered Batches
  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.teacherName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ? true : batch.status === statusFilter;

    const matchesCourse =
      courseFilter === "All" ? true : batch.courseId === courseFilter;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Batches
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage class batches, instructors, schedules, and capacity
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => queries.batches.refetch()}
            disabled={isBatchesLoading}
            className="text-xs text-zinc-600 h-9 shrink-0"
          >
            <RotateCw className={`h-3.5 w-3.5 mr-1 ${isBatchesLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button onClick={handleOpenCreate} variant="gold" className="shrink-0 h-9">
            <Plus className="h-4 w-4" /> Add Batch
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-zinc-200/80 shadow-xs">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search batch, teacher, or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs font-medium text-zinc-500 flex items-center gap-1 shrink-0">
              <GraduationCap className="h-3.5 w-3.5" /> Course:
            </span>
            <Select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full sm:w-44 h-9 text-xs"
            >
              <option value="All">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs font-medium text-zinc-500 flex items-center gap-1 shrink-0">
              <Filter className="h-3.5 w-3.5" /> Status:
            </span>
            <Select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "All" | "Active" | "Inactive")
              }
              className="w-full sm:w-32 h-9 text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Batches Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[880px]">
            <TableHeader>
            <TableRow>
              <TableHead className="w-[260px]">Batch Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Schedule Summary</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBatches.map((batch) => {
              const enrolledCount = getEnrolledCount(batch);
              const capacityTotal = Math.max(batch.capacity || 1, 1);
              const percentage = Math.min(100, Math.round((enrolledCount / capacityTotal) * 100));

              return (
                <TableRow key={batch.id}>
                  <TableCell className="py-3.5">
                    <div>
                      <p className="text-xs font-bold text-zinc-900 leading-snug">
                        {batch.name}
                      </p>
                      {batch.meetingLink && (
                        <a
                          href={batch.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-amber-800 hover:underline mt-0.5"
                        >
                          <Video className="h-3 w-3 text-amber-700" />
                          <span>Virtual Room</span>
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-zinc-800">
                    {batch.courseName}
                  </TableCell>
                  <TableCell className="text-xs text-zinc-600">
                    {batch.teacherName}
                  </TableCell>
                  <TableCell className="text-xs text-zinc-600">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[11px]">
                      <Clock className="h-3 w-3 text-zinc-400" />
                      {formatTimingSummary(batch.schedule)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 w-28">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-800">
                          {enrolledCount} / {batch.capacity}
                        </span>
                        <span className="text-[10px] text-zinc-400">{percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            percentage >= 90
                              ? "bg-red-500"
                              : percentage >= 70
                              ? "bg-amber-500"
                              : percentage > 0
                              ? "bg-emerald-600"
                              : "bg-zinc-200"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {batch.status === "Active" ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDetail(batch)}
                        title="View Roster"
                        className="h-8 text-xs px-2.5"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1 text-zinc-500" /> View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(batch)}
                        title="Edit Batch"
                        className="h-8 w-8 p-0 text-zinc-600 hover:text-zinc-900"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDelete(batch)}
                        title="Delete Batch"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {isBatchesLoading && batches.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-500 space-y-2">
                    <Loader2 className="h-6 w-6 animate-spin text-amber-700" />
                    <p className="text-xs font-medium">Loading batches from server...</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isBatchesLoading && filteredBatches.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-400 space-y-2">
                    <FileQuestion className="h-8 w-8 stroke-1 text-zinc-300" />
                    <p className="text-sm font-medium text-zinc-600">
                      No batches found matching filter criteria
                    </p>
                    <p className="text-xs text-zinc-400">
                      Try selecting All Courses or All Statuses.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      {/* Add / Edit Batch Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent maxWidth="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBatch ? "Edit Academic Batch" : "Add New Academic Batch"}
            </DialogTitle>
            <DialogDescription>
              {editingBatch
                ? "Modify timetable schedules, designated teacher, or meeting room."
                : "Create an active cohort with weekly schedule rows and enrollment quota."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            {formError && (
              <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Parent Academic Course *
                </label>
                <Select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  required
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Batch / Section Name *
                </label>
                <Input
                  placeholder="e.g. Morning Cohort Alpha"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Assigned Teacher / Instructor *
                </label>
                <Input
                  placeholder="e.g. Mufti Salman Mansoorpuri"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Student Capacity Quota *
                </label>
                <Input
                  type="number"
                  min="5"
                  max="200"
                  placeholder="30"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Virtual Meeting / Classroom Link
                </label>
                <Input
                  placeholder="https://meet.google.com/abc-def-xyz"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Batch Status
                </label>
                <Select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "Active" | "Inactive")
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </div>
            </div>

            {/* Weekly Schedule Repeatable Rows */}
            <div className="space-y-2.5 pt-2 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-amber-700" /> Weekly Schedule Timetable
                  </label>
                  <p className="text-[11px] text-zinc-400">
                    Add specific days and lecture timings for this section.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddScheduleRow}
                  className="text-xs h-7 px-2.5"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Day
                </Button>
              </div>

              <div className="space-y-2">
                {scheduleRows.map((row, index) => (
                  <div
                    key={row.id || index}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 sm:p-2 rounded-lg bg-zinc-50 border border-zinc-200"
                  >
                    <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
                      <div className="w-full sm:w-32">
                        <Select
                          value={row.day}
                          onChange={(e) =>
                            handleUpdateScheduleRow(
                              index,
                              "day",
                              e.target.value as ScheduleSlot["day"]
                            )
                          }
                          className="h-8 text-xs bg-white w-full"
                        >
                          {DAYS_OF_WEEK.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveScheduleRow(index)}
                        className="sm:hidden h-8 w-8 p-0 text-red-500 hover:bg-red-50 shrink-0"
                        disabled={scheduleRows.length <= 1}
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 flex-1 w-full">
                      <div className="flex-1">
                        <Input
                          placeholder="Start (09:00 AM)"
                          value={row.startTime}
                          onChange={(e) =>
                            handleUpdateScheduleRow(index, "startTime", e.target.value)
                          }
                          className="h-8 text-xs bg-white"
                        />
                      </div>

                      <span className="text-xs text-zinc-400 shrink-0">to</span>

                      <div className="flex-1">
                        <Input
                          placeholder="End (11:30 AM)"
                          value={row.endTime}
                          onChange={(e) =>
                            handleUpdateScheduleRow(index, "endTime", e.target.value)
                          }
                          className="h-8 text-xs bg-white"
                        />
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveScheduleRow(index)}
                        className="hidden sm:inline-flex h-8 w-8 p-0 text-red-500 hover:bg-red-50 shrink-0"
                        disabled={scheduleRows.length <= 1}
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="gold">
                {editingBatch ? "Update Batch" : "Create Batch"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Batch Detail View (Enrolled Students list) */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent maxWidth="max-w-3xl">
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <div>
                <DialogTitle className="text-lg">
                  Batch Roster & Information
                </DialogTitle>
                <DialogDescription>
                  {selectedBatch?.name} • Instructor: {selectedBatch?.teacherName}
                </DialogDescription>
              </div>
              <div>
                {selectedBatch?.status === "Active" ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>
            </div>
          </DialogHeader>

          {selectedBatch && (
            <div className="space-y-6 pt-2">
              {/* Batch Metadata overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
                <div>
                  <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                    Academic Course
                  </span>
                  <p className="font-bold text-zinc-900 mt-0.5">
                    {selectedBatch.courseName}
                  </p>
                </div>
                <div>
                  <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                    Meeting URL
                  </span>
                  <p className="mt-0.5">
                    {selectedBatch.meetingLink ? (
                      <a
                        href={selectedBatch.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-800 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Video className="h-3 w-3" />
                        Join Live Class
                      </a>
                    ) : (
                      <span className="text-zinc-400">Not set</span>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                    Capacity Status
                  </span>
                  <p className="font-bold text-zinc-900 mt-0.5">
                    {getEnrolledCount(selectedBatch)} / {selectedBatch.capacity} Students ({Math.min(100, Math.round((getEnrolledCount(selectedBatch) / Math.max(selectedBatch.capacity, 1)) * 100))}%)
                  </p>
                </div>
              </div>

              {/* Weekly Timetable cards */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-zinc-500" /> Weekly Class Schedule
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {selectedBatch.schedule?.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-2.5 rounded-lg border border-zinc-200 bg-white text-xs space-y-1"
                    >
                      <span className="font-bold text-amber-800">{slot.day}</span>
                      <p className="text-[11px] text-zinc-600">
                        {slot.startTime} - {slot.endTime}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enrolled Students list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-zinc-500" /> Currently Enrolled Students (
                    {Math.max(getEnrolledStudents(selectedBatch).length, getEnrolledCount(selectedBatch))})
                  </h4>
                </div>

                <div className="rounded-xl border border-zinc-200 overflow-hidden">
                  <Table className="min-w-[480px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Roll ID</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getEnrolledStudents(selectedBatch).map((stu) => (
                        <TableRow key={stu.id}>
                          <TableCell className="py-2.5 text-xs font-bold text-zinc-900">
                            {stu.name}
                          </TableCell>
                          <TableCell className="py-2.5 text-xs font-mono text-zinc-500">
                            {stu.rollNumber}
                          </TableCell>
                          <TableCell className="py-2.5 text-xs text-zinc-600">
                            {stu.phone}
                          </TableCell>
                          <TableCell className="py-2.5">
                            {stu.status === "Active" ? (
                              <Badge variant="success">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}

                      {getEnrolledStudents(selectedBatch).length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-6 text-xs text-zinc-400"
                          >
                            {getEnrolledCount(selectedBatch) > 0 ? (
                              <span>
                                {getEnrolledCount(selectedBatch)} student(s) actively enrolled in this batch.
                              </span>
                            ) : (
                              "No students are currently enrolled in this batch."
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDetailModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent maxWidth="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" /> Delete Academic Batch
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove batch{" "}
              <strong>"{batchToDelete?.name}"</strong>? This will detach any scheduled timetables and live meeting rooms.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Yes, Delete Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
