import {
  AdminCourse,
  AdminBatch,
  AdminNotice,
  AdminStudent,
  AdminAdmissionRequest,
  ScheduleSlot,
} from "../admin-data";
import {
  BackendCourse,
  BackendBatch,
  BackendNotice,
  BackendAdmission,
  BackendStudent,
} from "./admin-api";

const DAY_MAP: Record<number, ScheduleSlot["day"]> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export const DAY_REVERSE_MAP: Record<ScheduleSlot["day"], number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

import { getCourseMeta } from "./course-meta";

export function adaptBackendCourse(raw: any): AdminCourse {
  const c = raw?.course || raw?.data || raw || {};
  const id = c._id || c.id || `course-${Date.now()}`;
  const name = c.name || "Untitled Course";
  const meta = getCourseMeta(id, name);

  return {
    id,
    name,
    description: c.description || "",
    ageGroup: c.ageGroup || "All Ages",
    status: c.isActive === true || c.status === "Active" ? "Active" : "Inactive",
    isPinned: Boolean(c.isPinned),
    monthlyFee: c.monthlyFee || meta?.monthlyFee || "",
    imageSrc: c.imageUrl || c.image || c.imageSrc || meta?.imageSrc || "",
    imageUrl: c.imageUrl || c.image || c.imageSrc || meta?.imageSrc || "",
    image: c.image || c.imageUrl || c.imageSrc || meta?.imageSrc || "",
    createdAt: c.createdAt
      ? new Date(c.createdAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  };
}

export function adaptBackendBatch(raw: any): AdminBatch {
  const b = raw?.batch || raw?.data || raw || {};
  const courseId = typeof b.courseId === "object" && b.courseId ? b.courseId._id : (b.courseId as string) || "";
  const courseName = typeof b.courseId === "object" && b.courseId?.name ? b.courseId.name : (b.courseName || "Assigned Course");

  const schedule: ScheduleSlot[] = (b.schedule || []).map((s: any, idx: number) => ({
    id: `slot-${idx}`,
    day: DAY_MAP[s.dayOfWeek] || "Monday",
    startTime: s.startTime || "09:00",
    endTime: s.endTime || "10:30",
  }));

  const enrolledCount =
    typeof b.enrolledCount === "number"
      ? b.enrolledCount
      : typeof b.studentCount === "number"
      ? b.studentCount
      : typeof b.enrolledStudentsCount === "number"
      ? b.enrolledStudentsCount
      : typeof b.totalStudents === "number"
      ? b.totalStudents
      : Array.isArray(b.students)
      ? b.students.length
      : Array.isArray(b.enrolledStudents)
      ? b.enrolledStudents.length
      : b._count?.students ?? b._count?.enrollments ?? undefined;

  return {
    id: b._id || b.id || `batch-${Date.now()}`,
    name: b.name || "Untitled Batch",
    courseId,
    courseName,
    teacherName: b.teacherName || "",
    meetingLink: b.meetingLink || "",
    capacity: b.capacity || 30,
    status: b.status === "active" || b.status === "Active" ? "Active" : "Inactive",
    schedule: schedule.length > 0 ? schedule : [
      { id: "s-1", day: "Monday", startTime: "09:00", endTime: "10:30" }
    ],
    enrolledCount: typeof enrolledCount === "number" ? enrolledCount : undefined,
    createdAt: b.createdAt
      ? new Date(b.createdAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  };
}

const CATEGORY_MAP: Record<string, AdminNotice["category"]> = {
  urgent: "Urgent",
  holiday: "Holiday",
  exam: "Exam",
  new_batch: "New Batch",
  general: "Urgent",
};

export function adaptBackendNotice(raw: any): AdminNotice {
  const n = raw?.notice || raw?.data || raw || {};
  const formattedDate = n.publishedAt || n.createdAt
    ? new Date(n.publishedAt || n.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

  return {
    id: n._id || n.id || `notice-${Date.now()}`,
    title: n.title || "Untitled Notice",
    category: CATEGORY_MAP[n.category] || (n.category as AdminNotice["category"]) || "Urgent",
    description: n.description || "",
    pdfAttachment: n.pdfUrl || n.pdfAttachment || "",
    pdfUrl: n.pdfUrl || n.pdfAttachment || "",
    showOnTicker: Boolean(n.showOnTicker),
    date: formattedDate,
  };
}

export function adaptBackendAdmission(raw: any): AdminAdmissionRequest {
  const a = raw?.admission || raw?.data || raw || {};
  const courseId = typeof a.courseId === "object" && a.courseId ? a.courseId._id : (a.courseId as string) || "";
  const courseName = typeof a.courseId === "object" && a.courseId?.name ? a.courseId.name : (a.courseName || "Selected Course");

  const statusMap: Record<string, AdminAdmissionRequest["status"]> = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  };

  const formattedDate = a.createdAt
    ? new Date(a.createdAt).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  return {
    id: a._id || a.id || `adm-${Date.now()}`,
    applicantName: a.name || a.applicantName || "Applicant",
    age: a.age ? String(a.age) : "—",
    classGroup: a.classGroup || "Class 10+",
    guardianName: a.guardianName || "—",
    phone: a.phone || "—",
    email: a.email || "—",
    address: a.address || "—",
    courseId,
    courseName,
    date: formattedDate,
    status: statusMap[a.status] || (a.status as AdminAdmissionRequest["status"]) || "Pending",
    notes: a.rejectReason || a.notes,
  };
}

export function adaptBackendStudent(raw: any): AdminStudent {
  const s = raw?.student || raw?.data || raw || {};
  const enrollments = (s.enrollments || []).map((enr: any, idx: number) => {
    const rawCourseId =
      enr.courseId?._id ||
      enr.courseId?.id ||
      (typeof enr.courseId === "string" ? enr.courseId : "") ||
      enr.course?._id ||
      (typeof enr.course === "string" ? enr.course : "") ||
      `course-${idx}`;
    const rawBatchId =
      enr.batchId?._id ||
      enr.batchId?.id ||
      (typeof enr.batchId === "string" ? enr.batchId : "") ||
      enr.batch?._id ||
      (typeof enr.batch === "string" ? enr.batch : "") ||
      `batch-${idx}`;
    const rawCourseName =
      enr.courseId?.name || enr.courseName || enr.course?.name || "General Course";
    const rawBatchName =
      enr.batchId?.name || enr.batchName || enr.batch?.name || "Standard Batch";
    const rawEnrolledDate =
      enr.enrolledDate ||
      (enr.startDate ? new Date(enr.startDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);

    return {
      courseId: String(rawCourseId),
      courseName: rawCourseName,
      batchId: String(rawBatchId),
      batchName: rawBatchName,
      enrolledDate: rawEnrolledDate,
    };
  });

  return {
    id: String(s._id || s.id || `student-${Date.now()}`),
    name: s.name || "Student",
    rollNumber: s.studentId || s.loginId || s.rollNumber || "—",
    email: s.email || "—",
    phone: s.phone || "—",
    guardianName: s.profile?.guardianName || s.guardianName || "—",
    address: s.profile?.address || s.address || "—",
    status: s.isActive === true || s.status === "Active" ? "Active" : "Inactive",
    enrollments,
    joinedDate: s.createdAt
      ? new Date(s.createdAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  };
}
