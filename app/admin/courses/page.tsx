"use client";

import * as React from "react";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  BookOpen,
  Pin,
  CheckCircle2,
  AlertTriangle,
  X,
  FileQuestion,
  RotateCw,
  Loader2,
  ImageIcon,
  Upload,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { AdminCourse } from "@/lib/admin-data";
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

const PRESET_COURSE_IMAGES = [
  { name: "Library", src: "/images/hero-library.jpg" },
  { name: "Musalla", src: "/images/musalla.jpg" },
  { name: "Classroom", src: "/images/classroom.jpg" },
  { name: "Campus Walk", src: "/images/students-walking.jpg" },
  { name: "Students", src: "/images/students-stairs.jpg" },
];

export default function CoursesPage() {
  const { courses, addCourse, updateCourse, deleteCourse, queries } = useAdmin();
  const isCoursesLoading = queries.courses.isLoading || queries.courses.isFetching;

  // Filter & Search states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"All" | "Active" | "Inactive">("All");

  // Modal states
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingCourse, setEditingCourse] = React.useState<AdminCourse | null>(null);

  // Form states
  const [courseName, setCourseName] = React.useState("");
  const [courseDescription, setCourseDescription] = React.useState("");
  const [ageGroup, setAgeGroup] = React.useState("");
  const [monthlyFee, setMonthlyFee] = React.useState("");
  const [imageSrc, setImageSrc] = React.useState("");
  const [status, setStatus] = React.useState<"Active" | "Inactive">("Active");
  const [isPinned, setIsPinned] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Delete confirmation modal
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [courseToDelete, setCourseToDelete] = React.useState<AdminCourse | null>(null);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingCourse(null);
    setCourseName("");
    setCourseDescription("");
    setAgeGroup("");
    setMonthlyFee("");
    setImageSrc("");
    setStatus("Active");
    setIsPinned(false);
    setFormError("");
    setModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (course: AdminCourse) => {
    setEditingCourse(course);
    setCourseName(course.name);
    setCourseDescription(course.description);
    setAgeGroup(course.ageGroup);
    setMonthlyFee(course.monthlyFee || "");
    setImageSrc(course.imageUrl || course.image || course.imageSrc || "");
    setStatus(course.status);
    setIsPinned(course.isPinned);
    setFormError("");
    setModalOpen(true);
  };

  // Image file upload handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageSrc(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Open delete dialog
  const handleOpenDelete = (course: AdminCourse) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (courseToDelete) {
      deleteCourse(courseToDelete.id);
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  // Submit Add / Edit
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) {
      setFormError("Course name is required.");
      return;
    }
    if (!ageGroup.trim()) {
      setFormError("Age / Class group is required.");
      return;
    }

    const trimmedImg = imageSrc.trim();

    if (editingCourse) {
      updateCourse(editingCourse.id, {
        name: courseName.trim(),
        description: courseDescription.trim(),
        ageGroup: ageGroup.trim(),
        monthlyFee: monthlyFee.trim(),
        imageSrc: trimmedImg,
        imageUrl: trimmedImg,
        image: trimmedImg,
        status,
        isPinned,
      });
    } else {
      addCourse({
        name: courseName.trim(),
        description: courseDescription.trim(),
        ageGroup: ageGroup.trim(),
        monthlyFee: monthlyFee.trim(),
        imageSrc: trimmedImg,
        imageUrl: trimmedImg,
        image: trimmedImg,
        status,
        isPinned,
      });
    }

    setModalOpen(false);
  };

  // Filtered courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.ageGroup.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ? true : course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Courses
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage course list, age groups, and visibility status
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => queries.courses.refetch()}
            disabled={isCoursesLoading}
            className="text-xs text-zinc-600 h-9 shrink-0"
          >
            <RotateCw className={`h-3.5 w-3.5 mr-1 ${isCoursesLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button onClick={handleOpenCreate} variant="gold" className="shrink-0 h-9">
            <Plus className="h-4 w-4" /> Add Course
          </Button>
        </div>
      </div>

      {/* Controls: Search Bar & Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-zinc-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search courses or class group..."
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
            <Filter className="h-3.5 w-3.5" /> Status:
          </span>
          <Select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "All" | "Active" | "Inactive")
            }
            className="w-full sm:w-36 h-9 text-xs"
          >
            <option value="All">All Courses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </Select>
        </div>
      </div>

      {/* Courses Data Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[780px]">
            <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Course Name</TableHead>
              <TableHead>Age Group</TableHead>
              <TableHead>Course Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="py-3.5">
                  <div className="flex items-start gap-3">
                    {course.imageUrl || course.image || course.imageSrc ? (
                      <img
                        src={course.imageUrl || course.image || course.imageSrc}
                        alt={course.name}
                        className="h-9 w-9 rounded-lg object-cover border border-zinc-200 shrink-0 shadow-xs"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200/50">
                        <BookOpen className="h-4 w-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-zinc-900 leading-snug">
                        {course.name}
                      </div>
                      <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                        {course.description || "No description provided."}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-medium text-zinc-700">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800">
                    {course.ageGroup}
                  </span>
                </TableCell>
                <TableCell className="text-xs font-semibold text-[#785610]">
                  {course.monthlyFee ? (
                    <span>{course.monthlyFee}</span>
                  ) : (
                    <span className="text-zinc-400 font-normal">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {course.status === "Active" ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {course.isPinned ? (
                    <Badge variant="gold" className="gap-1">
                      <Pin className="h-3 w-3 fill-amber-700" /> Pinned
                    </Badge>
                  ) : (
                    <span className="text-xs text-zinc-400">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right py-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEdit(course)}
                      title="Edit Course"
                      className="h-8 w-8 p-0 text-zinc-600 hover:text-zinc-900"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDelete(course)}
                      title="Delete Course"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {isCoursesLoading && courses.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-500 space-y-2">
                    <Loader2 className="h-6 w-6 animate-spin text-amber-700" />
                    <p className="text-xs font-medium">Loading courses from server...</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isCoursesLoading && filteredCourses.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-400 space-y-2">
                    <FileQuestion className="h-8 w-8 stroke-1 text-zinc-300" />
                    <p className="text-sm font-medium text-zinc-600">
                      No courses found matching your query
                    </p>
                    <p className="text-xs text-zinc-400">
                      Try clearing filters or search terms.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("All");
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

      {/* Add / Edit Course Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent maxWidth="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? "Edit Course" : "Add New Course"}
            </DialogTitle>
            <DialogDescription>
              {editingCourse
                ? "Update course name, fee, image, age group, or status."
                : "Fill in the details to add a new course."}
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
                Course Name *
              </label>
              <Input
                placeholder="e.g. Dars-e-Nizami (Alimiyyah)"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Age / Class Group *
                </label>
                <Input
                  placeholder="e.g. Ages 16–24 / Class 10+"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1">
                  <span>Course Fee / Tuition</span>
                  <span className="text-zinc-400 font-normal text-[11px]">(Monthly/Term)</span>
                </label>
                <Input
                  placeholder="e.g. ₹250 or ₹3,000/year"
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">
                Description
              </label>
              <Textarea
                placeholder="Brief summary of academic scope and subjects..."
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                rows={2}
              />
            </div>

            {/* Course Cover Image Section */}
            <div className="space-y-2.5 p-3.5 rounded-xl border border-zinc-200/90 bg-zinc-50/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-[#785610]" /> Course Cover Image
                </label>
                {imageSrc && (
                  <button
                    type="button"
                    onClick={() => setImageSrc("")}
                    className="text-[11px] text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove image
                  </button>
                )}
              </div>

              {/* Live Preview if an image is selected */}
              {imageSrc && (
                <div className="relative h-28 w-full rounded-lg overflow-hidden border border-zinc-200 bg-zinc-900/10 shadow-xs">
                  <img
                    src={imageSrc}
                    alt="Course Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    Live Preview
                  </div>
                </div>
              )}

              {/* Upload button & Quick Academy Presets */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs h-8 px-2.5 text-zinc-700 border-zinc-300 hover:bg-white"
                  >
                    <Upload className="h-3.5 w-3.5 mr-1 text-[#785610]" /> Upload Image
                  </Button>
                  <span className="text-[11px] text-zinc-400">or choose academy preset:</span>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_COURSE_IMAGES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setImageSrc(preset.src)}
                      className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                        imageSrc === preset.src
                          ? "bg-amber-100 border-amber-300 text-amber-900 font-semibold shadow-xs"
                          : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>

                {/* Direct Image URL input */}
                <Input
                  type="text"
                  placeholder="Or paste external image URL (e.g. /images/hero-library.jpg or https://...)"
                  value={imageSrc}
                  onChange={(e) => setImageSrc(e.target.value)}
                  className="text-xs h-8 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-100">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">
                  Status
                </label>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 bg-zinc-50/50">
                <div>
                  <div className="text-xs font-semibold text-zinc-800">
                    Pinned / Featured
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Display prominently
                  </div>
                </div>
                <Switch
                  checked={isPinned}
                  onCheckedChange={setIsPinned}
                />
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
                {editingCourse ? "Save Changes" : "Create Course"}
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
              <AlertTriangle className="h-5 w-5 text-red-600" /> Delete Course
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 font-semibold">
                "{courseToDelete?.name}"
              </strong>
              ? This action cannot be undone. Associated batches and historical records may be affected.
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
              Yes, Delete Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
