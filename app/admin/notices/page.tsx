"use client";

import * as React from "react";
import {
  Plus,
  Filter,
  Search,
  Edit2,
  Trash2,
  FileText,
  Upload,
  Radio,
  AlertTriangle,
  X,
  FileQuestion,
  Paperclip,
  RotateCw,
  Loader2,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { AdminNotice } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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

export default function NoticesPage() {
  const { notices, addNotice, updateNotice, deleteNotice, queries } = useAdmin();
  const isNoticesLoading = queries.notices.isLoading || queries.notices.isFetching;

  // Filter & Search states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("All");

  // Modal states
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingNotice, setEditingNotice] = React.useState<AdminNotice | null>(null);

  // Form states
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState<AdminNotice["category"]>("Urgent");
  const [description, setDescription] = React.useState("");
  const [pdfAttachment, setPdfAttachment] = React.useState<string>("");
  const [pdfFile, setPdfFile] = React.useState<File | null>(null);
  const [showOnTicker, setShowOnTicker] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Delete confirmation modal
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [noticeToDelete, setNoticeToDelete] = React.useState<AdminNotice | null>(null);

  // Category badge styles
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "Urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      case "Holiday":
        return <Badge variant="warning">Holiday</Badge>;
      case "Exam":
        return <Badge variant="purple">Exam</Badge>;
      case "New Batch":
        return <Badge variant="success">New Batch</Badge>;
      default:
        return <Badge variant="secondary">{cat}</Badge>;
    }
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingNotice(null);
    setTitle("");
    setCategory("Urgent");
    setDescription("");
    setPdfAttachment("");
    setPdfFile(null);
    setShowOnTicker(true);
    setFormError("");
    setModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (notice: AdminNotice) => {
    setEditingNotice(notice);
    setTitle(notice.title);
    setCategory(notice.category);
    setDescription(notice.description);
    setPdfAttachment(notice.pdfUrl || notice.pdfAttachment || "");
    setPdfFile(null);
    setShowOnTicker(notice.showOnTicker);
    setFormError("");
    setModalOpen(true);
  };

  // Open delete dialog
  const handleOpenDelete = (notice: AdminNotice) => {
    setNoticeToDelete(notice);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (noticeToDelete) {
      deleteNotice(noticeToDelete.id);
      setDeleteDialogOpen(false);
      setNoticeToDelete(null);
    }
  };

  // Submit Add / Edit
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("Notice title is required.");
      return;
    }
    if (!description.trim()) {
      setFormError("Notice description is required.");
      return;
    }

    const cleanPdfAttachment = pdfAttachment ? pdfAttachment.trim() : undefined;

    if (editingNotice) {
      updateNotice(editingNotice.id, {
        title: title.trim(),
        category,
        description: description.trim(),
        pdfAttachment: cleanPdfAttachment,
        pdfUrl: cleanPdfAttachment,
        pdfFile,
        showOnTicker,
      });
    } else {
      addNotice({
        title: title.trim(),
        category,
        description: description.trim(),
        pdfAttachment: cleanPdfAttachment,
        pdfUrl: cleanPdfAttachment,
        pdfFile,
        showOnTicker,
      });
    }

    setModalOpen(false);
  };

  // Filtered notices
  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" ? true : notice.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Notices
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Publish notices, exam schedules, and announcements
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => queries.notices.refetch()}
            disabled={isNoticesLoading}
            className="text-xs text-zinc-600 h-9 shrink-0"
          >
            <RotateCw className={`h-3.5 w-3.5 mr-1 ${isNoticesLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button onClick={handleOpenCreate} variant="gold" className="shrink-0 h-9">
            <Plus className="h-4 w-4" /> Add Notice
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-zinc-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search notice titles..."
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

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <span className="text-xs font-medium text-zinc-500 flex items-center gap-1 shrink-0">
            <Filter className="h-3.5 w-3.5" /> Category:
          </span>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-40 h-9 text-xs"
          >
            <option value="All">All Categories</option>
            <option value="Urgent">Urgent</option>
            <option value="Holiday">Holiday</option>
            <option value="Exam">Exam</option>
            <option value="New Batch">New Batch</option>
          </Select>
        </div>
      </div>

      {/* Notices Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[780px]">
            <TableHeader>
            <TableRow>
              <TableHead className="w-[380px]">Notice Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead>Attachment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotices.map((notice) => (
              <TableRow key={notice.id}>
                <TableCell className="py-3.5">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 leading-snug">
                      {notice.title}
                    </p>
                    <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                      {notice.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{getCategoryBadge(notice.category)}</TableCell>
                <TableCell className="text-xs text-zinc-600">{notice.date}</TableCell>
                <TableCell>
                  {notice.showOnTicker ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      <Radio className="h-3 w-3 text-amber-700 animate-pulse" /> Live Ticker
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-400">Off</span>
                  )}
                </TableCell>
                <TableCell>
                  {notice.pdfAttachment ? (
                    <span className="inline-flex items-center gap-1 text-xs text-zinc-600 font-medium">
                      <Paperclip className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="truncate max-w-[120px]">{notice.pdfAttachment}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-400">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right py-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEdit(notice)}
                      title="Edit Notice"
                      className="h-8 w-8 p-0 text-zinc-600 hover:text-zinc-900"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDelete(notice)}
                      title="Delete Notice"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {isNoticesLoading && notices.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-500 space-y-2">
                    <Loader2 className="h-6 w-6 animate-spin text-amber-700" />
                    <p className="text-xs font-medium">Loading notices from server...</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isNoticesLoading && filteredNotices.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-400 space-y-2">
                    <FileQuestion className="h-8 w-8 stroke-1 text-zinc-300" />
                    <p className="text-sm font-medium text-zinc-600">
                      No notices found
                    </p>
                    <p className="text-xs text-zinc-400">
                      Change category or search keyword.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setCategoryFilter("All");
                      }}
                      className="mt-2 text-xs"
                    >
                      Reset filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      {/* Add / Edit Notice Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent maxWidth="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingNotice ? "Edit Notice" : "Add Announcement Notice"}
            </DialogTitle>
            <DialogDescription>
              {editingNotice
                ? "Update notice text, attachment, or ticker placement."
                : "Create an official administrative announcement visible across the portal."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            {formError && (
              <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Notice Title *
              </label>
              <Input
                placeholder="e.g. Annual Ramadan Recess and Library Schedule"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Category *
              </label>
              <Select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as AdminNotice["category"])
                }
              >
                <option value="Urgent">Urgent</option>
                <option value="Holiday">Holiday</option>
                <option value="Exam">Exam</option>
                <option value="New Batch">New Batch</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Notice Content / Description *
              </label>
              <Textarea
                placeholder="Provide full details of circular or instruction..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* PDF Attachment Upload (Dropzone simulator) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 flex items-center justify-between">
                <span>PDF Attachment (Optional)</span>
                {pdfAttachment && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPdfFile(null);
                      setPdfAttachment("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-[11px] text-red-600 hover:underline"
                  >
                    Remove file
                  </button>
                )}
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border border-dashed border-zinc-300 rounded-xl p-4 bg-zinc-50/50 hover:bg-zinc-100/70 transition-colors text-center cursor-pointer select-none"
              >
                {pdfAttachment ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-medium text-zinc-800">
                    <FileText className="h-4 w-4 text-amber-700" />
                    <span className="truncate max-w-[260px]">{pdfAttachment}</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="h-5 w-5 text-zinc-400 mx-auto" />
                    <p className="text-xs text-zinc-600 font-medium">
                      Click to attach PDF document
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      Supports PDF up to 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPdfFile(file);
                      setPdfAttachment(file.name);
                    }
                  }}
                />
              </div>
            </div>

            {/* Ticker Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-zinc-50/70">
              <div>
                <div className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5 text-amber-700" /> Show on Header Ticker
                </div>
                <div className="text-[11px] text-zinc-500">
                  Feature in scrolling ticker on the student portal and website
                </div>
              </div>
              <Switch
                checked={showOnTicker}
                onCheckedChange={setShowOnTicker}
              />
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
                {editingNotice ? "Update Notice" : "Publish Notice"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent maxWidth="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" /> Delete Notice
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete notice{" "}
              <strong className="text-zinc-900 font-semibold">
                "{noticeToDelete?.title}"
              </strong>
              ? It will be removed immediately from public announcements.
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
              Yes, Delete Notice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
