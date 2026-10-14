export interface ScheduleSlot {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  startTime: string;
  endTime: string;
}

export interface AdminCourse {
  id: string;
  name: string;
  description: string;
  ageGroup: string;
  status: "Active" | "Inactive";
  isPinned: boolean;
  createdAt: string;
  monthlyFee?: string;
  imageSrc?: string;
  imageUrl?: string;
  image?: string;
}

export interface AdminBatch {
  id: string;
  name: string;
  courseId: string;
  courseName: string;
  teacherName: string;
  meetingLink: string;
  capacity: number;
  schedule: ScheduleSlot[];
  status: "Active" | "Inactive";
  createdAt: string;
  enrolledCount?: number;
}

export interface AdminNotice {
  id: string;
  title: string;
  category: "Urgent" | "Holiday" | "Exam" | "New Batch";
  description: string;
  pdfAttachment?: string;
  pdfUrl?: string;
  pdfFile?: File | null;
  showOnTicker: boolean;
  date: string;
}

export interface AdminStudentEnrollment {
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  enrolledDate: string;
}

export interface AdminStudent {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  phone: string;
  guardianName: string;
  address: string;
  status: "Active" | "Inactive";
  enrollments: AdminStudentEnrollment[];
  joinedDate: string;
}

export interface AdminAdmissionRequest {
  id: string;
  applicantName: string;
  age: string;
  classGroup: string;
  guardianName: string;
  phone: string;
  email: string;
  address: string;
  courseId: string;
  courseName: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
  assignedBatchId?: string;
  notes?: string;
}

// Official 13 courses catalogue
export const initialCourses: AdminCourse[] = [
  {
    id: "course-1",
    name: "Dars-e-Nizami Course",
    description: "Comprehensive Alimiyyah degree covering Quran, Hadith, Fiqh, Usool-e-Fiqh, Arabic Grammar (Sarf & Nahw), and classical Islamic scholarship.",
    ageGroup: "15+ Years",
    status: "Active",
    isPinned: true,
    createdAt: "2026-01-10",
    monthlyFee: "₹500",
    imageSrc: "/images/course-jurisprudence.jpg",
  },
  {
    id: "course-2",
    name: "Takhassus (Muftiya) Course",
    description: "Advanced post-Alimiyyah specialization in Ifta (Fatwa issuing), contemporary Shar'i research, and comparative jurisprudence.",
    ageGroup: "Post-Alimiyyah",
    status: "Active",
    isPinned: true,
    createdAt: "2026-01-10",
    monthlyFee: "₹500",
    imageSrc: "/images/hero-library.jpg",
  },
  {
    id: "course-3",
    name: "Bahaar-e-Shariat Course",
    description: "Comprehensive study of daily Islamic jurisprudence, Aqeedah, acts of worship (Namaz, Roza, Zakaat, Hajj), and practical Shariah rulings.",
    ageGroup: "12+ Years",
    status: "Active",
    isPinned: true,
    createdAt: "2026-01-10",
    monthlyFee: "₹500",
    imageSrc: "/images/course-quran.jpg",
  },
  {
    id: "course-4",
    name: "Tafseer Course",
    description: "In-depth commentary and thematic study of the Holy Quran, understanding revelation contexts, linguistic nuances, and spiritual guidance.",
    ageGroup: "14+ Years",
    status: "Active",
    isPinned: false,
    createdAt: "2026-01-10",
    monthlyFee: "₹500",
    imageSrc: "/images/course-quran.jpg",
  },
  {
    id: "course-5",
    name: "Muballighah Course",
    description: "Islamic leadership, Da'wah training, speech, and public engagement program for female Islamic scholars and educators.",
    ageGroup: "Female Students (14+ Years)",
    status: "Active",
    isPinned: false,
    createdAt: "2026-01-10",
    monthlyFee: "₹500",
    imageSrc: "/images/hero-library.jpg",
  },
  {
    id: "course-6",
    name: "Farz Uloom Course",
    description: "Fundamental mandatory Islamic knowledge covering essential beliefs (Aqaa'id), basic worship regulations, and day-to-day Shar'i obligations.",
    ageGroup: "All Ages",
    status: "Active",
    isPinned: false,
    createdAt: "2026-01-10",
    monthlyFee: "₹500",
    imageSrc: "/images/course-jurisprudence.jpg",
  },
  {
    id: "course-7",
    name: "Tajweed Course",
    description: "Correct pronunciation of Arabic letters from their proper articulation points (Makharij), rules of Noon & Meem Sakin, and beautiful Quran recitation.",
    ageGroup: "All Ages",
    status: "Active",
    isPinned: false,
    createdAt: "2026-01-10",
    monthlyFee: "₹500",
    imageSrc: "/images/course-quran.jpg",
  },
  {
    id: "course-8",
    name: "Nazra Quran Course",
    description: "Foundational Quran reading course from Noorani Qaida to fluent recitation of the Holy Quran with correct phonetics.",
    ageGroup: "Children & Beginners (5+ Years)",
    status: "Active",
    isPinned: false,
    createdAt: "2026-01-10",
    monthlyFee: "₹500",
    imageSrc: "/images/course-quran.jpg",
  },
  {
    id: "course-9",
    name: "Urdu Course",
    description: "Comprehensive Urdu language literacy covering reading, writing, classical literature comprehension, and Islamic terminology.",
    ageGroup: "All Ages",
    status: "Active",
    isPinned: false,
    createdAt: "2026-01-10",
    monthlyFee: "₹500",
    imageSrc: "/images/hero-library.jpg",
  },
  {
    id: "course-10",
    name: "Namaz Course",
    description: "Step-by-step practical guide to performing 5 daily Salah according to Sunnah, including Wudu, Ghusl, Azan, Sajdah Sahw, and essential duas.",
    ageGroup: "All Ages",
    status: "Active",
    isPinned: false,
    createdAt: "2026-01-10",
    monthlyFee: "Free",
    imageSrc: "/images/musalla.jpg",
  },
  {
    id: "course-11",
    name: "Zakaat Course",
    description: "Clear guidance on calculation of Zakaat on gold, silver, cash, business merchandise, agriculture, and eligible recipients (Masarif-e-Zakaat).",
    ageGroup: "Adults & Professionals",
    status: "Active",
    isPinned: false,
    createdAt: "2026-01-10",
    monthlyFee: "Free",
    imageSrc: "/images/course-jurisprudence.jpg",
  },
  {
    id: "course-12",
    name: "Arabic Calligraphy Course",
    description: "Traditional Islamic script art teaching Thuluth, Naskh, and Ruq'ah calligraphy styles under master penmanship techniques.",
    ageGroup: "10+ Years",
    status: "Active",
    isPinned: false,
    createdAt: "2026-01-10",
    monthlyFee: "Free",
    imageSrc: "/images/course-quran.jpg",
  },
  {
    id: "course-13",
    name: "Roza Course",
    description: "Detailed rulings of Fasting in Ramadan, conditions of Roza, invalidating factors, Kaffarah, Qada, and spiritual dimensions of Sawm.",
    ageGroup: "All Ages",
    status: "Active",
    isPinned: false,
    createdAt: "2026-01-10",
    monthlyFee: "Free",
    imageSrc: "/images/musalla.jpg",
  },
];
export const initialBatches: AdminBatch[] = [];
export const initialNotices: AdminNotice[] = [];
export const initialStudents: AdminStudent[] = [];
export const initialAdmissionRequests: AdminAdmissionRequest[] = [];
