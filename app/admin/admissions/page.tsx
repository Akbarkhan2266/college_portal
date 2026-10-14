"use client";

import * as React from "react";
import {
  Search,
  UserCheck,
  UserX,
  Eye,
  CheckCircle2,
  XCircle,
  Calendar,
  Phone,
  Mail,
  MapPin,
  User,
  GraduationCap,
  Layers,
  AlertCircle,
  X,
  FileQuestion,
  Sparkles,
  RotateCw,
  Loader2,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { AdminAdmissionRequest } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

export default function AdmissionsPage() {
  const { admissions, batches, approveAdmission, rejectAdmission, queries } = useAdmin();
  const isAdmissionsLoading = queries.admissions.isLoading || queries.admissions.isFetching;

  const [activeTab, setActiveTab] = React.useState<"Pending" | "Approved" | "Rejected">("Pending");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Detail Modal state
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState<AdminAdmissionRequest | null>(null);

  // Approve Dialog state
  const [approveDialogOpen, setApproveDialogOpen] = React.useState(false);
  const [selectedBatchId, setSelectedBatchId] = React.useState<string>("");
  const [approveError, setApproveError] = React.useState("");

  // Reject Dialog state
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState("");

  // Counts for tabs
  const pendingCount = admissions.filter((a) => a.status === "Pending").length;
  const approvedCount = admissions.filter((a) => a.status === "Approved").length;
  const rejectedCount = admissions.filter((a) => a.status === "Rejected").length;

  // Open Detail
  const handleOpenDetail = (req: AdminAdmissionRequest) => {
    setSelectedRequest(req);
    setDetailModalOpen(true);
  };

  // Open Approve Dialog
  const handleOpenApprove = (req: AdminAdmissionRequest) => {
    setSelectedRequest(req);
    // Find available batches for this course
    const courseBatches = batches.filter(
      (b) => b.courseId === req.courseId && b.status === "Active"
    );
    setSelectedBatchId(courseBatches.length > 0 ? courseBatches[0].id : "");
    setApproveError("");
    setApproveDialogOpen(true);
  };

  const handleConfirmApprove = () => {
    if (!selectedRequest) return;
    if (!selectedBatchId) {
      setApproveError("Please select a batch to enroll the student.");
      return;
    }
    approveAdmission(selectedRequest.id, selectedBatchId);
    setApproveDialogOpen(false);
    setDetailModalOpen(false);
  };

  // Open Reject Dialog
  const handleOpenReject = (req: AdminAdmissionRequest) => {
    setSelectedRequest(req);
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedRequest) return;
    rejectAdmission(selectedRequest.id, rejectReason || "Qualifications do not match batch prerequisites.");
    setRejectDialogOpen(false);
    setDetailModalOpen(false);
  };

  // Filter requests
  const filteredRequests = admissions.filter((req) => {
    const matchesTab = req.status === activeTab;
    const matchesSearch =
      req.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.phone.includes(searchQuery) ||
      req.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Batches matching current request's course
  const availableBatchesForCourse = selectedRequest
    ? batches.filter((b) => b.courseId === selectedRequest.courseId)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Admission Requests
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Review applicant requests, assign batches, and manage approvals
          </p>
        </div>
        <div className="shrink-0 w-full sm:w-auto flex justify-start sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => queries.admissions.refetch()}
            disabled={isAdmissionsLoading}
            className="text-xs text-zinc-600 h-9"
          >
            <RotateCw className={`h-3.5 w-3.5 mr-1 ${isAdmissionsLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 bg-white p-3.5 rounded-xl border border-zinc-200/80 shadow-xs">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-100 rounded-lg w-full md:w-auto">
          <button
            onClick={() => setActiveTab("Pending")}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "Pending"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <span>Pending</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "Pending"
                  ? "bg-amber-100 text-amber-900 font-bold"
                  : "bg-zinc-200 text-zinc-700"
              }`}
            >
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("Approved")}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "Approved"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <span>Approved</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "Approved"
                  ? "bg-emerald-100 text-emerald-900 font-bold"
                  : "bg-zinc-200 text-zinc-700"
              }`}
            >
              {approvedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("Rejected")}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "Rejected"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <span>Rejected</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "Rejected"
                  ? "bg-red-100 text-red-900 font-bold"
                  : "bg-zinc-200 text-zinc-700"
              }`}
            >
              {rejectedCount}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search by applicant, course, phone..."
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
      </div>

      {/* Requests Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[840px]">
            <TableHeader>
            <TableRow>
              <TableHead className="w-[240px]">Applicant Name</TableHead>
              <TableHead>Program Applied</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="py-3.5">
                  <div>
                    <p className="text-xs font-bold text-zinc-900">
                      {req.applicantName}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      {req.classGroup || `Age ${req.age}`}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-medium text-zinc-800">
                  {req.courseName}
                </TableCell>
                <TableCell className="text-xs text-zinc-600">
                  <div>
                    <span>{req.phone}</span>
                    <span className="block text-[11px] text-zinc-400">{req.email}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-zinc-500">
                  {req.date}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {req.status === "Approved" ? (
                    <Badge variant="success">Approved</Badge>
                  ) : req.status === "Rejected" ? (
                    <Badge variant="destructive">Rejected</Badge>
                  ) : (
                    <Badge variant="warning">Pending</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetail(req)}
                      className="h-8 text-xs px-3"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1 text-zinc-500" /> View
                    </Button>
                    {req.status === "Pending" && (
                      <Button
                        variant="gold"
                        size="sm"
                        onClick={() => handleOpenApprove(req)}
                        className="h-8 text-xs px-3"
                      >
                        <UserCheck className="h-3.5 w-3.5 mr-1" /> Approve
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {isAdmissionsLoading && admissions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-500 space-y-2">
                    <Loader2 className="h-6 w-6 animate-spin text-amber-700" />
                    <p className="text-xs font-medium">Loading admissions from server...</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isAdmissionsLoading && filteredRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-400 space-y-2">
                    <FileQuestion className="h-8 w-8 stroke-1 text-zinc-300" />
                    <p className="text-sm font-medium text-zinc-600">
                      No {activeTab.toLowerCase()} admission records found
                    </p>
                    <p className="text-xs text-zinc-400">
                      Try searching with different terms or check another status tab.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      {/* Request Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent maxWidth="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <div>
                <DialogTitle className="text-lg">
                  Applicant Admission Profile
                </DialogTitle>
                <DialogDescription>
                  Application Ref #{selectedRequest?.id} • Submitted on {selectedRequest?.date}
                </DialogDescription>
              </div>
              <div>
                {selectedRequest?.status === "Approved" ? (
                  <Badge variant="success">Approved</Badge>
                ) : selectedRequest?.status === "Rejected" ? (
                  <Badge variant="destructive">Rejected</Badge>
                ) : (
                  <Badge variant="warning">Pending</Badge>
                )}
              </div>
            </div>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6 pt-2">
              {/* Selected Program Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                    Requested Program
                  </div>
                  <div className="text-sm font-bold text-amber-950 mt-0.5">
                    {selectedRequest.courseName}
                  </div>
                </div>
                <GraduationCap className="h-8 w-8 text-amber-700/60" />
              </div>

              {/* Grid: Student details & Guardian details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-zinc-200/80 bg-zinc-50/50 space-y-2.5">
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-zinc-500" /> Student Information
                  </h4>
                  <div className="text-xs space-y-1.5">
                    <p className="flex justify-between">
                      <span className="text-zinc-500">Full Name:</span>
                      <span className="font-semibold text-zinc-900">
                        {selectedRequest.applicantName}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-zinc-500">Age:</span>
                      <span className="text-zinc-800 font-medium">
                        {selectedRequest.age} years
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-zinc-500">Prior Class / Level:</span>
                      <span className="text-zinc-800 font-medium">
                        {selectedRequest.classGroup}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-zinc-200/80 bg-zinc-50/50 space-y-2.5">
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-zinc-500" /> Guardian & Contact
                  </h4>
                  <div className="text-xs space-y-1.5">
                    <p className="flex justify-between">
                      <span className="text-zinc-500">Guardian Name:</span>
                      <span className="font-semibold text-zinc-900">
                        {selectedRequest.guardianName}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-zinc-500">Phone Number:</span>
                      <span className="text-zinc-800 font-medium">
                        {selectedRequest.phone}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-zinc-500">Email Address:</span>
                      <span className="text-zinc-800 font-medium">
                        {selectedRequest.email}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Address & Notes */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-white space-y-1 text-xs">
                  <span className="text-zinc-500 font-semibold flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-zinc-400" /> Residential Address:
                  </span>
                  <p className="text-zinc-800 font-medium pl-5">
                    {selectedRequest.address}
                  </p>
                </div>

                {selectedRequest.notes && (
                  <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-white space-y-1 text-xs">
                    <span className="text-zinc-500 font-semibold">
                      Academic Notes & Previous Qualifications:
                    </span>
                    <p className="text-zinc-700 italic">
                      "{selectedRequest.notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Actions Footer in Detail view */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDetailModalOpen(false)}
                >
                  Close
                </Button>

                {selectedRequest.status === "Pending" && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleOpenReject(selectedRequest)}
                    >
                      <UserX className="h-3.5 w-3.5 mr-1" /> Reject Request
                    </Button>
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={() => handleOpenApprove(selectedRequest)}
                    >
                      <UserCheck className="h-3.5 w-3.5 mr-1" /> Approve & Assign Batch
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Dialog (Assign Batch) */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent maxWidth="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Approve Admission
            </DialogTitle>
            <DialogDescription>
              Assign <strong>{selectedRequest?.applicantName}</strong> to an active batch. This will generate their student roll number and formalize enrollment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {approveError && (
              <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{approveError}</span>
              </div>
            )}

            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs space-y-1">
              <div className="text-zinc-500">Selected Program:</div>
              <div className="font-bold text-zinc-900">{selectedRequest?.courseName}</div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-zinc-400" />
                Select Academic Batch *
              </label>
              {availableBatchesForCourse.length > 0 ? (
                <Select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                >
                  {availableBatchesForCourse.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name} (Teacher: {batch.teacherName} • Cap: {batch.capacity})
                    </option>
                  ))}
                </Select>
              ) : (
                <div className="p-3 text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg">
                  No batches configured yet for this course. Please create a batch under the Batches tab first.
                </div>
              )}
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Confirming will generate a student roll number and add the record to active students.
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="gold"
              onClick={handleConfirmApprove}
              disabled={availableBatchesForCourse.length === 0}
            >
              Confirm Enrollment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent maxWidth="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5 text-red-600" /> Reject Admission Request
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to reject the application for{" "}
              <strong>{selectedRequest?.applicantName}</strong>?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <label className="text-xs font-semibold text-zinc-700">
              Reason for Rejection (Optional)
            </label>
            <Input
              placeholder="e.g. Incomplete transcripts / Age requirements not met"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
