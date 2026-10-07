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

export const coursesData: Course[] = [
  {
    id: "dars-e-nizami",
    title: "Dars-e-Nizami",
    subtitle: "Comprehensive Classical Islamic Scholarship",
    categoryTag: "ISLAMIC SCHOLARSHIP • 8 YEARS",
    description:
      "Total traditional systematic Islamic curriculum covering Quranic exegesis, Hadith sciences, Usul al-Fiqh, and classical Arabic literature.",
    imageSrc: "/images/hero-library.jpg",
    imageAlt: "Dars-e-Nizami Students in Library",
    subjectsCount: "14 Subjects",
    monthlyFee: "₹180",
    tags: ["SCHOLARLY TITLE", "★ PINNED"],
    isPinned: true,
  },
  {
    id: "jamat-e-edadiya",
    title: "Jamat-e-Edadiya",
    subtitle: "Foundational Preparatory Level",
    categoryTag: "PREPARATORY LEVEL • 1 YEAR",
    description:
      "Foundational preparatory year introducing fundamental Arabic grammar, Nahw & Sarf, Quranic recitation, and elementary Islamic studies.",
    imageSrc: "/images/musalla.jpg",
    imageAlt: "Jamat-e-Edadiya Students",
    subjectsCount: "6 Subjects",
    monthlyFee: "₹300",
    tags: ["FOUNDATION"],
  },
  {
    id: "jamat-e-ula",
    title: "Jamat-e-Ula",
    subtitle: "First Year Darse Nizami Studies",
    categoryTag: "DARSE NIZAMI YEAR 1 • 1 YEAR",
    description:
      "First year of classical curriculum emphasizing Arabic lexicography, syntax, foundational Fiqh, Fiqh principles, and standardized Hadith texts.",
    imageSrc: "/images/course-jurisprudence.jpg",
    imageAlt: "Jamat-e-Ula Study Hall",
    subjectsCount: "7 Subjects",
    monthlyFee: "₹300",
    tags: ["YEAR 1"],
  },
  {
    id: "jamat-e-saniya",
    title: "Jamat-e-Saniya",
    subtitle: "Second Year Darse Nizami Studies",
    categoryTag: "DARSE NIZAMI YEAR 2 • 1 YEAR",
    description:
      "Second year strengthening intermediate Arabic rhetoric (Balaghat), Usul al-Fiqh jurisprudence, Fiqh theory, and expansion into Hadith studies.",
    imageSrc: "/images/course-jurisprudence.jpg",
    imageAlt: "Jamat-e-Saniya Class",
    subjectsCount: "8 Subjects",
    monthlyFee: "₹280",
    tags: ["YEAR 2"],
  },
  {
    id: "jamat-e-salisa",
    title: "Jamat-e-Salisa",
    subtitle: "Third Year Darse Nizami Studies",
    categoryTag: "DARSE NIZAMI YEAR 3 • 1 YEAR",
    description:
      "Third academic year dedicated to classical Fiqh, Tafseer literature, manuscript analysis, Shariah jurisprudence, and comparative legal systems.",
    imageSrc: "/images/hero-library.jpg",
    imageAlt: "Jamat-e-Salisa Research",
    subjectsCount: "8 Subjects",
    monthlyFee: "₹290",
    tags: ["YEAR 3"],
  },
  {
    id: "jamat-e-rabiya",
    title: "Jamat-e-Rabiya",
    subtitle: "Fourth Year Darse Nizami Studies",
    categoryTag: "DARSE NIZAMI YEAR 4 • 1 YEAR",
    description:
      "Fourth year exploring advanced Shariah sciences, in-depth principles of Usul, etymology, Mantiq, and advanced argumentation methodology.",
    imageSrc: "/images/student-societies.jpg",
    imageAlt: "Jamat-e-Rabiya Discourse",
    subjectsCount: "9 Subjects",
    monthlyFee: "₹250",
    tags: ["YEAR 4"],
  },
  {
    id: "jamat-e-khamisa",
    title: "Jamat-e-Khamisa",
    subtitle: "Fifth Year Darse Nizami Studies",
    categoryTag: "DARSE NIZAMI YEAR 5 • 1 YEAR",
    description:
      "Fifth year advancing scholarly research in Fiqh rulings, inheritance law (Ilm al-Fara'id), and extensive Arabic classical texts.",
    imageSrc: "/images/halal-dining.jpg",
    imageAlt: "Jamat-e-Khamisa Commons",
    subjectsCount: "9 Subjects",
    monthlyFee: "₹180",
    tags: ["YEAR 5"],
  },
  {
    id: "jamat-e-fazilat",
    title: "Jamat-e-Fazilat (Alimah)",
    subtitle: "Complete Daura-e-Hadith Degree",
    categoryTag: "DARSE NIZAMI DEGREE • 6 YEARS",
    description:
      "Comprehensive 6-year Daura-e-Hadith degree for female scholars covering Sahih Al-Bukhari, Sahih Muslim, Sunan books, and mastering the Isnad of Ahadith.",
    imageSrc: "/images/course-ai.jpg",
    imageAlt: "Jamat-e-Fazilat Female Scholars",
    subjectsCount: "12 Subjects",
    monthlyFee: "₹100",
    tags: ["FULL DEGREE"],
  },
  {
    id: "muballighah-course",
    title: "Muballighah Course",
    subtitle: "Islamic Specialization & Da'wah Training",
    categoryTag: "ISLAMIC SPECIALIZATION • 12 MONTHS",
    description:
      "Specialized female orator and Dawah course focused on public speaking, Islamic outreach, sermonizing, counseling, and Shariah ethics.",
    imageSrc: "/images/student-societies.jpg",
    imageAlt: "Muballighah Leadership Class",
    subjectsCount: "8 Subjects",
    monthlyFee: "₹100",
    tags: ["DA'WAH SPECIAL"],
  },
  {
    id: "quran-tajweed",
    title: "Qur'an / Tajweed",
    subtitle: "Precision Recitation & Phonetics",
    categoryTag: "QURANIC SCIENCES • 12 MONTHS",
    description:
      "Systematic Quranic recitation course focusing on Tajweed rules, Makharij, Sifat, precise vocal articulation, and melodious Tilawat.",
    imageSrc: "/images/course-quran.jpg",
    imageAlt: "Qur'an Tajweed Course",
    subjectsCount: "4 Subjects",
    monthlyFee: "₹200",
    tags: ["SUMMER FAST-TRACK", "★ PINNED"],
    isPinned: true,
  },
  {
    id: "qiraat-course",
    title: "Qiraat Course",
    subtitle: "Advanced Seven Quranic Recitations",
    categoryTag: "QURANIC SCIENCES • 6 MONTHS",
    description:
      "Advanced recitation modes and phonetics covering Qira'at Sab'ah (the Seven Recitations) and teacher guidance.",
    imageSrc: "/images/musalla.jpg",
    imageAlt: "Qiraat Recitation Circle",
    subjectsCount: "5 Subjects",
    monthlyFee: "₹250",
    tags: ["ADVANCED RECITATION"],
  },
  {
    id: "hifz-ul-quran",
    title: "Hifz-ul-Qur'an",
    subtitle: "Complete Quran Memorization Program",
    categoryTag: "MEMORIZATION • 3 YEARS",
    description:
      "Structured full Quran memorization program with daily revision, Tajweed rule retention, Muraja'ah, error-monitoring, and Hifz evaluation.",
    imageSrc: "/images/course-quran.jpg",
    imageAlt: "Hifz Class",
    subjectsCount: "All Quran",
    monthlyFee: "₹500",
    tags: ["FULL-TIME"],
  },
  {
    id: "nazra-quran",
    title: "Nazra Qur'an",
    subtitle: "Fluent Reading & Basic Masnoon Duas",
    categoryTag: "FOUNDATIONAL RECITATION • 6 MONTHS",
    description:
      "Fluent reading of the Holy Quran with correct phonetics, recitation speed improvement, and essential daily Masnoon Duas.",
    imageSrc: "/images/course-quran.jpg",
    imageAlt: "Nazra Quran Reading",
    subjectsCount: "2 Modules",
    monthlyFee: "₹150",
    tags: ["BASIC"],
  },
  {
    id: "fiqh-e-masail",
    title: "Fiqh-e-Masail",
    subtitle: "Practical Everyday Shariah Rulings",
    categoryTag: "ISLAMIC JURISPRUDENCE • 6 MONTHS",
    description:
      "Practical training in Islamic jurisprudence regarding Taharah, Salah, Saum, Zakat, family jurisprudence, and contemporary Halal/Haram rulings.",
    imageSrc: "/images/course-jurisprudence.jpg",
    imageAlt: "Fiqh-e-Masail Seminar",
    subjectsCount: "4 Modules",
    monthlyFee: "₹200",
    tags: ["PRACTICAL SHARIAH"],
  },
  {
    id: "urdu-course",
    title: "Urdu Course",
    subtitle: "Literary Urdu Reading, Writing & Poetry",
    categoryTag: "LANGUAGE & LITERARY • 6 MONTHS",
    description:
      "Comprehensive Urdu language learning covering reading, writing, classical poetry analysis, and proficient speaking fluency.",
    imageSrc: "/images/hero-library.jpg",
    imageAlt: "Urdu Literary Class",
    subjectsCount: "6 Modules",
    monthlyFee: "₹100",
    tags: ["LANGUAGE"],
  },
  {
    id: "naat-course",
    title: "Naat Course",
    subtitle: "Reverent Vocal Arts & Poetic Praise",
    categoryTag: "ARTS & VOCAL PRAISE • 3 MONTHS",
    description:
      "Art of melodious Naat recitation, vocal modulation, poetic metre understanding, and reverent eulogies honoring Prophet Muhammad (PBUH).",
    imageSrc: "/images/student-societies.jpg",
    imageAlt: "Naat Recitation Workshop",
    subjectsCount: "4 Modules",
    monthlyFee: "₹250",
    tags: ["VOCAL ARTS"],
  },
  {
    id: "taqreer-course",
    title: "Taqreer Course",
    subtitle: "Public Speaking & Oratory Skills",
    categoryTag: "PUBLIC SPEAKING • 3 MONTHS",
    description:
      "Public address, speech drafting, oratory articulation, voice modulation, and effective presentation skills for Islamic assemblies.",
    imageSrc: "/images/student-societies.jpg",
    imageAlt: "Taqreer Oratory Forum",
    subjectsCount: "4 Modules",
    monthlyFee: "₹300",
    tags: ["PUBLIC SPEAKING"],
  },
  {
    id: "nizamat-course",
    title: "Nizamat Course",
    subtitle: "Stage Anchoring & Event Moderation",
    categoryTag: "EVENT HOSTING • 3 MONTHS",
    description:
      "Stage anchoring, event moderation, ceremonial hosting, announcement etiquette, and sequence management for Islamic conferences.",
    imageSrc: "/images/student-societies.jpg",
    imageAlt: "Nizamat Hosting Class",
    subjectsCount: "4 Modules",
    monthlyFee: "₹300",
    tags: ["MODERATION"],
  },
  {
    id: "calligraphy-course",
    title: "Calligraphy Course",
    subtitle: "Traditional Thuluth & Naskh Calligraphy",
    categoryTag: "ISLAMIC ART • 6 MONTHS",
    description:
      "Traditional Arabic & Urdu calligraphy mastery including Thuluth, Naskh, and Nastaliq scripts with reed pen technique and canvas creation.",
    imageSrc: "/images/hero-library.jpg",
    imageAlt: "Islamic Calligraphy Studio",
    subjectsCount: "5 Modules",
    monthlyFee: "₹180",
    tags: ["ISLAMIC ART & WRITING"],
  },
  {
    id: "english-course",
    title: "English Course",
    subtitle: "Conversational & Academic English",
    categoryTag: "MODERN LANGUAGES • 6 MONTHS",
    description:
      "Professional conversational English, academic writing, vocabulary expansion, and confidence building for Islamic students and researchers.",
    imageSrc: "/images/hero-library.jpg",
    imageAlt: "English Language Lab",
    subjectsCount: "6 Modules",
    monthlyFee: "₹300",
    tags: ["GLOBAL SKILLS"],
  },
  {
    id: "madani-qaida",
    title: "Madani Qaida",
    subtitle: "Primer for Beginners & New Readers",
    categoryTag: "FIRST STEP • 3 MONTHS",
    description:
      "Step-by-step primer for young learners and new readers to master Arabic letters, joint forms, vowels, Tanween, and pronunciation.",
    imageSrc: "/images/course-quran.jpg",
    imageAlt: "Madani Qaida Class",
    subjectsCount: "12 Lessons",
    monthlyFee: "₹120",
    tags: ["BEGINNER/PRIMER"],
  },
];

export interface Notice {
  id: string;
  day: string;
  month: string;
  year: string;
  category: "Examination" | "New Batch" | "Holiday" | "Admission" | "Event";
  title: string;
  description: string;
  tags: string[];
  featured?: boolean;
}

export const noticesData: Notice[] = [
  {
    id: "admissions-open-2026-27",
    day: "20",
    month: "OCT",
    year: "2026",
    category: "Admission",
    title: "Admissions Open for Academic Session 2026–27",
    description:
      "Applications are now being invited for selected Islamic and academic programmes. Families are encouraged to complete the admission form with accurate student details.",
    tags: ["#Admissions 2026", "#Dars-E-Nizami", "#Online Reg", "#Registration"],
    featured: true,
  },
  {
    id: "half-yearly-exams-2026",
    day: "15",
    month: "NOV",
    year: "2026",
    category: "Examination",
    title: "Half-Yearly Exams 2026 — Date Sheet Released",
    description:
      "All students of Classes 6–12 and the Aalimah Program should review the examination dates and syllabus breakdown before the preparation period begins.",
    tags: ["#Classes 6-12", "#Aalimah", "#Examinations", "#Syllabus"],
  },
  {
    id: "new-tajweed-batch-ages-7-12",
    day: "01",
    month: "NOV",
    year: "2026",
    category: "New Batch",
    title: "New Tajweed Batch for Ages 7–12",
    description:
      "Enrollment is open for a fresh beginner Tajweed batch. Morning and evening learning windows are available, with limited seats in each batch.",
    tags: ["#Tajweed", "#Kids Batch", "#Morning/Evening", "#QuranicPhonetics"],
  },
  {
    id: "academy-closed-friday-8-nov",
    day: "08",
    month: "NOV",
    year: "2026",
    category: "Holiday",
    title: "Academy Closed on Friday, 8 Nov",
    description:
      "The academy will remain closed on account of 'Urs. All live classes will resume as per the regular schedule from Saturday.",
    tags: ["#Holiday Notice", "#Academy Closed", "#Urs"],
  },
  {
    id: "parents-orientation-academic-guidance",
    day: "12",
    month: "OCT",
    year: "2026",
    category: "Event",
    title: "Parents' Orientation & Academic Guidance Session",
    description:
      "A dedicated session for parents to understand class routines, student progress updates, communication channels and the academy's learning approach.",
    tags: ["#Parents Orientation", "#Academic Guidance", "#Progress Reports"],
  },
  {
    id: "arabic-language-foundation-batch",
    day: "05",
    month: "OCT",
    year: "2026",
    category: "New Batch",
    title: "Arabic Language Foundation Batch",
    description:
      "A beginner-friendly Arabic foundation batch is being prepared for learners who wish to strengthen reading, vocabulary and everyday understanding of the language.",
    tags: ["#Arabic Foundation", "#Grammar Basics", "#Nahw-Sarf", "#Language Lab"],
  },
  {
    id: "internal-assessment-preparation-week",
    day: "28",
    month: "SEP",
    year: "2026",
    category: "Examination",
    title: "Internal Assessment Preparation Week",
    description:
      "Students are advised to use the preparation week to revise lesson plans, complete pending work and clarify difficult topics with their teachers.",
    tags: ["#Assessments", "#Revision Week", "#Study Plans"],
  },
  {
    id: "fee-support-scholarship-enquiry-window",
    day: "18",
    month: "SEP",
    year: "2026",
    category: "Admission",
    title: "Fee Support & Scholarship Enquiry Window",
    description:
      "Families seeking information about available fee support or scholarship consideration may contact the academy team during the admission enquiry process.",
    tags: ["#Scholarship", "#Fee Support", "#Zakat Fund", "#Financial Aid"],
  },
  {
    id: "student-enrichment-seerah-character-building",
    day: "10",
    month: "SEP",
    year: "2026",
    category: "Event",
    title: "Student Enrichment Session: Seerah & Character Building",
    description:
      "An enrichment session focusing on Seerah, adab and practical character-building themes as part of the academy's wider Islamic education approach.",
    tags: ["#Seerah", "#Tarbiyyah", "#Character Building", "#Akhlaq"],
  },
];

