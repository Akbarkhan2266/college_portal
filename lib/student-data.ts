export interface StudentScheduleSlot {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  startTime: string;
  endTime: string;
}

export interface StudentBatch {
  id: string;
  name: string;
  courseId: string;
  courseName: string;
  teacherName: string;
  teacherEmail: string;
  meetingLink: string;
  schedule: StudentScheduleSlot[];
  status: "Active" | "Completed";
  isLiveNow?: boolean;
  nextClassText?: string;
}

export interface StudentCourse {
  id: string;
  name: string;
  description: string;
  batchId: string;
  batchName: string;
  status: "Active" | "In Progress" | "Completed";
  instructor: string;
  academicYear: string;
}

export interface StudentNotice {
  id: string;
  title: string;
  category: "Urgent" | "Holiday" | "Exam" | "New Batch";
  description: string;
  pdfAttachment?: string;
  date: string;
}

export interface StudentProfileData {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  academicYear: string;
  program: string;
  joinedDate: string;
}

// Clean initial empty student profile
export const defaultStudentProfile: StudentProfileData = {
  id: "",
  rollNumber: "—",
  name: "Student",
  email: "—",
  phone: "—",
  guardianName: "—",
  guardianPhone: "—",
  address: "—",
  academicYear: "2026-2027",
  program: "Enrolled Program",
  joinedDate: "—",
};

// Clean initial empty arrays without fake data
export const defaultStudentBatches: StudentBatch[] = [];
export const defaultStudentCourses: StudentCourse[] = [];
export const defaultStudentNotices: StudentNotice[] = [];
