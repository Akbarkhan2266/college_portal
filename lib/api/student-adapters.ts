import {
  StudentBatch,
  StudentCourse,
  StudentNotice,
  StudentProfileData,
  StudentScheduleSlot,
} from "../student-data";
import {
  BackendStudentBatch,
  BackendStudentCourseEnrollment,
  BackendStudentNotice,
  BackendStudentNoticeSummary,
  BackendStudentProfile,
  BackendTodayClass,
} from "./student-api";

export const STUDENT_DAY_MAP: Record<number, StudentScheduleSlot["day"]> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export const STUDENT_NOTICE_CATEGORY_MAP: Record<string, StudentNotice["category"]> = {
  urgent: "Urgent",
  holiday: "Holiday",
  exam: "Exam",
  new_batch: "New Batch",
  general: "Urgent",
};

/**
 * Format next class text from nextClass slot
 */
export function formatNextClassSlot(slot?: { dayOfWeek: number; startTime: string; endTime: string } | null): string | undefined {
  if (!slot) return undefined;
  const dayName = STUDENT_DAY_MAP[slot.dayOfWeek] || "Upcoming";
  return `${dayName} at ${slot.startTime}`;
}

/**
 * Adapt backend course enrollment
 */
export function adaptBackendStudentCourse(enr: BackendStudentCourseEnrollment, idx: number = 0): StudentCourse {
  const course = enr.course || ({} as any);
  return {
    id: course.id || course._id || enr.enrollmentId || `course-${idx}`,
    name: course.name || "Assigned Course",
    description: course.description || "Course curriculum and studies at Jamia Bukhari.",
    batchId: enr.batchName || `batch-${idx}`,
    batchName: enr.batchName || "Standard Cohort",
    status: (enr.status === "active" ? "Active" : "In Progress") as StudentCourse["status"],
    instructor: "Faculty Instructor",
    academicYear: course.ageGroup || "2026-2027",
  };
}

/**
 * Adapt backend batch
 */
export function adaptBackendStudentBatch(b: BackendStudentBatch, idx: number = 0): StudentBatch {
  const schedule: StudentScheduleSlot[] = (b.schedule || []).map((s, slotIdx) => ({
    id: `slot-${slotIdx}`,
    day: STUDENT_DAY_MAP[s.dayOfWeek] || "Monday",
    startTime: s.startTime,
    endTime: s.endTime,
  }));

  const nextClassText = b.nextClass
    ? formatNextClassSlot(b.nextClass)
    : schedule.length > 0
    ? `${schedule[0].day} at ${schedule[0].startTime}`
    : "TBA";

  return {
    id: b.batchId || b._id || b.enrollmentId || `batch-${idx}`,
    name: b.name || "Main Batch",
    courseId: b.courseSlug || "course",
    courseName: b.courseName || "Academic Program",
    teacherName: b.teacherName || "Assigned Faculty",
    teacherEmail: "faculty@jamia.edu",
    meetingLink: b.meetingLink || "",
    schedule: schedule.length > 0 ? schedule : [
      { id: "slot-0", day: "Monday", startTime: "09:00", endTime: "10:30" },
    ],
    status: "Active",
    isLiveNow: Boolean(b.canJoin),
    nextClassText,
  };
}

/**
 * Adapt dashboard today class into StudentBatch view item
 */
export function adaptBackendTodayClass(tc: BackendTodayClass, idx: number = 0): StudentBatch {
  return {
    id: `today-${idx}`,
    name: tc.batchName || "Today's Class",
    courseId: "course",
    courseName: tc.courseName || "Course Lecture",
    teacherName: tc.teacherName || tc.teacher || "Faculty Instructor",
    teacherEmail: "faculty@jamia.edu",
    meetingLink: tc.meetingLink || "",
    schedule: [
      {
        id: `slot-today-${idx}`,
        day: "Monday",
        startTime: tc.startTime || "09:00",
        endTime: tc.endTime || "10:30",
      },
    ],
    status: "Active",
    isLiveNow: Boolean(tc.canJoin),
    nextClassText: `${tc.startTime} - ${tc.endTime}`,
  };
}

/**
 * Adapt backend student notice
 */
export function adaptBackendStudentNotice(
  raw: BackendStudentNotice | BackendStudentNoticeSummary,
  idx: number = 0
): StudentNotice {
  const formattedDate = raw.publishedAt
    ? new Date(raw.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

  const category = (raw.category && STUDENT_NOTICE_CATEGORY_MAP[raw.category]) || "Urgent";

  return {
    id: raw._id || `not-${idx}`,
    title: raw.title || "Academic Notice",
    category,
    description: raw.description || "Official circular published for students.",
    pdfAttachment: raw.pdfUrl || undefined,
    date: formattedDate,
  };
}

/**
 * Adapt backend student profile
 */
export function adaptBackendStudentProfile(raw: BackendStudentProfile): StudentProfileData {
  const p = raw || {};
  return {
    id: String(p.id || p._id || ""),
    rollNumber: p.studentId || p.loginId || "—",
    name: p.name || "Student",
    email: p.email || "—",
    phone: p.phone || "—",
    guardianName: p.guardianName || "—",
    guardianPhone: "—",
    address: p.address || "—",
    academicYear: p.academicYear || "2026-2027",
    program: p.program || "Enrolled Course",
    joinedDate: p.dob
      ? new Date(p.dob).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
      : "—",
  };
}
