export interface Course {
  id: string;
  title: string;
  subtitle: string;
  categoryTag: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  subjectsCount: string;
  monthlyFee: string;
  tags: string[];
  isPinned?: boolean;
}

// Official 13 courses catalogue
export const coursesData: Course[] = [
  {
    id: "course-1",
    title: "Dars-e-Nizami Course",
    subtitle: "Classical Alimiyyah & Traditional Islamic Scholarship",
    categoryTag: "ISLAMIC SCHOLARSHIP • ALIMIYYAH",
    description:
      "Comprehensive Alimiyyah degree covering Quran, Hadith, Fiqh, Usool-e-Fiqh, Arabic Grammar (Sarf & Nahw), and classical Islamic scholarship.",
    imageSrc: "/images/course-jurisprudence.jpg",
    imageAlt: "Dars-e-Nizami Course Banner",
    subjectsCount: "Comprehensive Curricula",
    monthlyFee: "₹500",
    tags: ["★ PINNED", "PAID", "ALIMIYYAH"],
    isPinned: true,
  },
  {
    id: "course-2",
    title: "Takhassus (Muftiya) Course",
    subtitle: "Specialization in Ifta & Islamic Jurisprudence",
    categoryTag: "POST-ALIMIYYAH SPECIALIZATION • IFTA",
    description:
      "Advanced post-Alimiyyah specialization in Ifta (Fatwa issuing), contemporary Shar'i research, and comparative jurisprudence.",
    imageSrc: "/images/hero-library.jpg",
    imageAlt: "Takhassus (Muftiya) Course Banner",
    subjectsCount: "Advanced Specialization",
    monthlyFee: "₹500",
    tags: ["★ PINNED", "PAID", "IFTA"],
    isPinned: true,
  },
  {
    id: "course-3",
    title: "Bahaar-e-Shariat Course",
    subtitle: "Essential Islamic Jurisprudence & Practical Shariah",
    categoryTag: "ISLAMIC LAW & FIQH • PRACTICAL GUIDE",
    description:
      "Comprehensive study of daily Islamic jurisprudence, Aqeedah, acts of worship (Namaz, Roza, Zakaat, Hajj), and practical Shariah rulings.",
    imageSrc: "/images/course-quran.jpg",
    imageAlt: "Bahaar-e-Shariat Course Banner",
    subjectsCount: "Practical Shariah",
    monthlyFee: "₹500",
    tags: ["★ PINNED", "PAID", "FIQH"],
    isPinned: true,
  },
  {
    id: "course-4",
    title: "Tafseer Course",
    subtitle: "Quranic Commentary & Exegesis",
    categoryTag: "QURANIC SCIENCES • TAFSEER",
    description:
      "In-depth commentary and thematic study of the Holy Quran, understanding revelation contexts, linguistic nuances, and spiritual guidance.",
    imageSrc: "/images/course-quran.jpg",
    imageAlt: "Tafseer Course Banner",
    subjectsCount: "Quranic Exegesis",
    monthlyFee: "₹500",
    tags: ["PAID", "QURAN"],
    isPinned: false,
  },
  {
    id: "course-5",
    title: "Muballighah Course",
    subtitle: "Female Islamic Leadership & Da'wah",
    categoryTag: "WOMEN ISLAMIC LEADERSHIP • DAWAH",
    description:
      "Islamic leadership, Da'wah training, speech, and public engagement program for female Islamic scholars and educators.",
    imageSrc: "/images/hero-library.jpg",
    imageAlt: "Muballighah Course Banner",
    subjectsCount: "Da'wah & Public Speech",
    monthlyFee: "₹500",
    tags: ["PAID", "WOMEN"],
    isPinned: false,
  },
  {
    id: "course-6",
    title: "Farz Uloom Course",
    subtitle: "Mandatory Knowledge for Every Muslim",
    categoryTag: "MANDATORY KNOWLEDGE • FARZ AYN",
    description:
      "Fundamental mandatory Islamic knowledge covering essential beliefs (Aqaa'id), basic worship regulations, and day-to-day Shar'i obligations.",
    imageSrc: "/images/course-jurisprudence.jpg",
    imageAlt: "Farz Uloom Course Banner",
    subjectsCount: "Essential Fiqh & Aqeedah",
    monthlyFee: "₹500",
    tags: ["PAID", "ESSENTIALS"],
    isPinned: false,
  },
  {
    id: "course-7",
    title: "Tajweed Course",
    subtitle: "Rules of Correct Quranic Recitation",
    categoryTag: "QURAN RECITATION • TAJWEED RULES",
    description:
      "Correct pronunciation of Arabic letters from their proper articulation points (Makharij), rules of Noon & Meem Sakin, and beautiful Quran recitation.",
    imageSrc: "/images/course-quran.jpg",
    imageAlt: "Tajweed Course Banner",
    subjectsCount: "Phonetics & Makharij",
    monthlyFee: "₹500",
    tags: ["PAID", "TAJWEED"],
    isPinned: false,
  },
  {
    id: "course-8",
    title: "Nazra Quran Course",
    subtitle: "Fluent Reading of the Holy Quran",
    categoryTag: "QURAN FOUNDATION • BEGINNERS",
    description:
      "Foundational Quran reading course from Noorani Qaida to fluent recitation of the Holy Quran with correct phonetics.",
    imageSrc: "/images/course-quran.jpg",
    imageAlt: "Nazra Quran Course Banner",
    subjectsCount: "Qaida to Holy Quran",
    monthlyFee: "₹500",
    tags: ["PAID", "NAZRA"],
    isPinned: false,
  },
  {
    id: "course-9",
    title: "Urdu Course",
    subtitle: "Language, Reading & Classical Literature",
    categoryTag: "LANGUAGE & LITERATURE • URDU",
    description:
      "Comprehensive Urdu language literacy covering reading, writing, classical literature comprehension, and Islamic terminology.",
    imageSrc: "/images/hero-library.jpg",
    imageAlt: "Urdu Course Banner",
    subjectsCount: "Reading, Writing & Grammar",
    monthlyFee: "₹500",
    tags: ["PAID", "URDU"],
    isPinned: false,
  },
  {
    id: "course-10",
    title: "Namaz Course",
    subtitle: "Complete Guide to 5 Daily Prayers",
    categoryTag: "PRACTICAL WORSHIP • FREE COURSE",
    description:
      "Step-by-step practical guide to performing 5 daily Salah according to Sunnah, including Wudu, Ghusl, Azan, Sajdah Sahw, and essential duas.",
    imageSrc: "/images/musalla.jpg",
    imageAlt: "Namaz Course Banner",
    subjectsCount: "Salah & Wudu Practice",
    monthlyFee: "Free",
    tags: ["UNPAID", "FREE", "SALAH"],
    isPinned: false,
  },
  {
    id: "course-11",
    title: "Zakaat Course",
    subtitle: "Rules & Calculation of Islamic Charity",
    categoryTag: "CHARITY & OBLIGATION • FREE COURSE",
    description:
      "Clear guidance on calculation of Zakaat on gold, silver, cash, business merchandise, agriculture, and eligible recipients (Masarif-e-Zakaat).",
    imageSrc: "/images/course-jurisprudence.jpg",
    imageAlt: "Zakaat Course Banner",
    subjectsCount: "Calculations & Shar'i Rulings",
    monthlyFee: "Free",
    tags: ["UNPAID", "FREE", "ZAKAAT"],
    isPinned: false,
  },
  {
    id: "course-12",
    title: "Arabic Calligraphy Course",
    subtitle: "Traditional Islamic Penmanship & Scripts",
    categoryTag: "ISLAMIC ART • FREE COURSE",
    description:
      "Traditional Islamic script art teaching Thuluth, Naskh, and Ruq'ah calligraphy styles under master penmanship techniques.",
    imageSrc: "/images/course-quran.jpg",
    imageAlt: "Arabic Calligraphy Course Banner",
    subjectsCount: "Thuluth, Naskh & Ruq'ah",
    monthlyFee: "Free",
    tags: ["UNPAID", "FREE", "CALLIGRAPHY"],
    isPinned: false,
  },
  {
    id: "course-13",
    title: "Roza Course",
    subtitle: "Rulings & Spiritual Dimensions of Fasting",
    categoryTag: "RAMADAN & FASTING • FREE COURSE",
    description:
      "Detailed rulings of Fasting in Ramadan, conditions of Roza, invalidating factors, Kaffarah, Qada, and spiritual dimensions of Sawm.",
    imageSrc: "/images/musalla.jpg",
    imageAlt: "Roza Course Banner",
    subjectsCount: "Sawm Ahkaam & Masail",
    monthlyFee: "Free",
    tags: ["UNPAID", "FREE", "ROZA"],
    isPinned: false,
  },
];

export interface Notice {
  id: string;
  day: string;
  month: string;
  year: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  featured?: boolean;
  pdfAttachment?: string;
}

export const noticesData: Notice[] = [];
