"use client";

import * as React from "react";
import {
  Search,
  Filter,
  Eye,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  GraduationCap,
  ShieldAlert,
  ArrowRightLeft,
  Power,
  X,
  FileQuestion,
  CheckCircle2,
  RotateCw,
  Loader2,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { AdminStudent, AdminStudentEnrollment } from "@/lib/admin-data";
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

export default function StudentsPage() {
  const { students, courses, batches, toggleStudentStatus, changeStudentBatch, queries } = useAdmin();
  const isStudentsLoading = queries.students.isLoading || queries.students.isFetching;

  // Search & Filter state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [courseFilter, setCourseFilter] = React.useState<string>("All");
  const [statusFilter, setStatusFilter] = React.useState<"All" | "Active" | "Inactive">("All");

  // Detail Modal state
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState<AdminStudent | null>(null);

  // Change Batch Dialog state
  const [changeBatchDialogOpen, setChangeBatchDialogOpen] = React.useState(false);
  const [targetEnrollment, setTargetEnrollment] = React.useState<AdminStudentEnrollment | null>(null);
  const [selectedNewBatchId, setSelectedNewBatchId] = React.useState<string>("");

  // Activate / Deactivate Dialog state
  const [statusToggleDialogOpen, setStatusToggleDialogOpen] = React.useState(false);

  // Open Detail
  const handleOpenDetail = (student: AdminStudent) => {
    setSelectedStudent(student);
    setDetailModalOpen(true);
  };

  // Open Change Batch
  const handleOpenChangeBatch = (enrollment: AdminStudentEnrollment) => {
    setTargetEnrollment(enrollment);
    const available = batches.filter(
      (b) => b.courseId === enrollment.courseId && b.id !== enrollment.batchId
    );
    setSelectedNewBatchId(available.length > 0 ? available[0].id : "");
    setChangeBatchDialogOpen(true);
  };

  const handleConfirmChangeBatch = () => {
    if (selectedStudent && targetEnrollment && selectedNewBatchId) {
      changeStudentBatch(selectedStudent.id, targetEnrollment.courseId, selectedNewBatchId);
      // Update local selectedStudent reference
      const updatedBatch = batches.find((b) => b.id === selectedNewBatchId);
      if (updatedBatch) {
        setSelectedStudent((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            enrollments: prev.enrollments.map((enr) =>
              enr.courseId === targetEnrollment.courseId
                ? { ...enr, batchId: selectedNewBatchId, batchName: updatedBatch.name }
                : enr
            ),
          };
        });
      }
      setChangeBatchDialogOpen(false);
    }
  };

  // Confirm Status Toggle
  const handleConfirmStatusToggle = () => {
    if (selectedStudent) {
      toggleStudentStatus(selectedStudent.id);
      setSelectedStudent((prev) =>
        prev
          ? { ...prev, status: prev.status === "Active" ? "Inactive" : "Active" }
          : null
      );
      setStatusToggleDialogOpen(false);
    }
  };

  // Filter students
  const filteredStudents = students.filter((stu) => {
    const matchesSearch =
      stu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === "All" ? true : stu.status === statusFilter;

    const matchesCourse =
      courseFilter === "All"
        ? true
        : stu.enrollments.some((enr) => enr.courseId === courseFilter);

    return matchesSearch && matchesStatus && matchesCourse;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Students
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            View student enrollments, batch assignments, and active status
          </p>
        </div>
        <div className="shrink-0 w-full sm:w-auto flex justify-start sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => queries.students.refetch()}
            disabled={isStudentsLoading}
            className="text-xs text-zinc-600 h-9"
          >
            <RotateCw className={`h-3.5 w-3.5 mr-1 ${isStudentsLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-zinc-200/80 shadow-xs">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search by name, roll ID, phone..."
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

        {/* Course & Status Filters */}
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

      {/* Students Data Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[800px]">
            <TableHeader>
            <TableRow>
              <TableHead className="w-[280px]">Student Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Course(s)</TableHead>
              <TableHead>Assigned Batch(es)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900 leading-snug">
                        {student.name}
                      </p>
                      <span className="inline-block font-mono text-[11px] text-zinc-500">
                        {student.rollNumber}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-zinc-600">
                  {student.phone}
                </TableCell>
                <TableCell className="text-xs font-medium text-zinc-800">
                  {student.enrollments.map((enr) => (
                    <div key={enr.courseId}>{enr.courseName}</div>
                  ))}
                </TableCell>
                <TableCell className="text-xs text-zinc-600">
                  {student.enrollments.map((enr) => (
                    <div key={enr.batchId} className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                      <span>{enr.batchName}</span>
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {student.status === "Active" ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right py-3.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDetail(student)}
                    className="h-8 text-xs px-3"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1 text-zinc-500" /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {isStudentsLoading && students.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-500 space-y-2">
                    <Loader2 className="h-6 w-6 animate-spin text-amber-700" />
                    <p className="text-xs font-medium">Loading students from server...</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isStudentsLoading && filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-400 space-y-2">
                    <FileQuestion className="h-8 w-8 stroke-1 text-zinc-300" />
                    <p className="text-sm font-medium text-zinc-600">
                      No student records found
                    </p>
                    <p className="text-xs text-zinc-400">
                      Try adjusting the search query or course filters.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      {/* Student Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent maxWidth="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <div>
                <DialogTitle className="text-lg">
                  Student Details
                </DialogTitle>
                <DialogDescription>
                  Roll ID #{selectedStudent?.rollNumber} • Enrolled since {selectedStudent?.joinedDate}
                </DialogDescription>
              </div>
              <div>
                {selectedStudent?.status === "Active" ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>
            </div>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6 pt-2">
              {/* Profile Card Header */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <div className="h-14 w-14 rounded-full bg-amber-700 text-white flex items-center justify-center text-xl font-bold shadow-sm">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-zinc-900">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">
                    {selectedStudent.rollNumber} • {selectedStudent.email}
                  </p>
                  <p className="text-xs text-zinc-600">
                    Phone: <span className="font-semibold">{selectedStudent.phone}</span>
                  </p>
                </div>
              </div>

              {/* Guardian & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-white space-y-1.5">
                  <span className="text-zinc-500 font-semibold flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-zinc-400" /> Guardian / Parent
                  </span>
                  <p className="font-bold text-zinc-900 pl-5">
                    {selectedStudent.guardianName}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-white space-y-1.5">
                  <span className="text-zinc-500 font-semibold flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-zinc-400" /> Residential Address
                  </span>
                  <p className="font-medium text-zinc-800 pl-5">
                    {selectedStudent.address}
                  </p>
                </div>
              </div>

              {/* Academic Enrollments List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-amber-700" /> Enrolled Academic Programs & Batches
                </h4>
                <div className="space-y-2">
                  {selectedStudent.enrollments.map((enr) => (
                    <div
                      key={enr.courseId}
                      className="p-4 rounded-xl border border-zinc-200 bg-white hover:border-amber-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-xs font-bold text-zinc-900">
                          {enr.courseName}
                        </div>
                        <div className="text-xs text-zinc-600 flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold text-[11px] border border-amber-200/70">
                            <Layers className="h-3 w-3" /> {enr.batchName}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            Enrolled {enr.enrolledDate}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenChangeBatch(enr)}
                        className="text-xs shrink-0 h-8"
                      >
                        <ArrowRightLeft className="h-3.5 w-3.5 mr-1 text-zinc-500" /> Change Batch
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Action Banner */}
              <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-zinc-900">
                    Account Status: {selectedStudent.status}
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    {selectedStudent.status === "Active"
                      ? "Student has full access to campus facilities and portal."
                      : "Student access is currently suspended."}
                  </div>
                </div>
                <Button
                  variant={selectedStudent.status === "Active" ? "destructive" : "gold"}
                  size="sm"
                  onClick={() => setStatusToggleDialogOpen(true)}
                  className="text-xs"
                >
                  <Power className="h-3.5 w-3.5 mr-1" />
                  {selectedStudent.status === "Active" ? "Deactivate Student" : "Activate Student"}
                </Button>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDetailModalOpen(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Batch Dialog */}
      <Dialog open={changeBatchDialogOpen} onOpenChange={setChangeBatchDialogOpen}>
        <DialogContent maxWidth="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-amber-700" /> Change Academic Batch
            </DialogTitle>
            <DialogDescription>
              Reassign <strong>{selectedStudent?.name}</strong> to a different cohort for course{" "}
              <strong>{targetEnrollment?.courseName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs">
              <span className="text-zinc-500">Current Cohort: </span>
              <span className="font-bold text-zinc-900">{targetEnrollment?.batchName}</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                New Target Batch *
              </label>
              <Select
                value={selectedNewBatchId}
                onChange={(e) => setSelectedNewBatchId(e.target.value)}
              >
                {batches
                  .filter((b) => b.courseId === targetEnrollment?.courseId)
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} (Teacher: {b.teacherName} • Cap: {b.capacity})
                    </option>
                  ))}
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setChangeBatchDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="gold"
              onClick={handleConfirmChangeBatch}
            >
              Transfer Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activate / Deactivate Confirmation Dialog */}
      <Dialog open={statusToggleDialogOpen} onOpenChange={setStatusToggleDialogOpen}>
        <DialogContent maxWidth="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
              {selectedStudent?.status === "Active"
                ? "Confirm Student Deactivation"
                : "Confirm Student Reactivation"}
            </DialogTitle>
            <DialogDescription>
              {selectedStudent?.status === "Active"
                ? `Are you sure you want to suspend institutional access for ${selectedStudent?.name}? The student won't be able to log in or join classes.`
                : `Are you sure you want to restore full institutional access for ${selectedStudent?.name}?`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusToggleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={selectedStudent?.status === "Active" ? "destructive" : "gold"}
              onClick={handleConfirmStatusToggle}
            >
              {selectedStudent?.status === "Active" ? "Yes, Deactivate" : "Yes, Reactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
