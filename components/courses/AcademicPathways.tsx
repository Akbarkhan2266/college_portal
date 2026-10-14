import React from "react";
import Link from "next/link";
import CourseCard from "./CourseCard";

export default function AcademicPathways() {
  const courses = [
    {
      title: "Dars-e-Nizami Course",
      subtitle: "Classical Alimiyyah & Traditional Islamic Scholarship",
      categoryTag: "ISLAMIC SCHOLARSHIP • ALIMIYYAH",
      description:
        "Dars-e-Nizami course mein Quran, Hadith, Fiqh, Usool-e-Fiqh, Arabic grammar, aur classical Islamic scholarship ki mustanad aur jame taleem di jati hai.",
      imageSrc: "/images/course-jurisprudence.jpg",
      imageAlt: "Dars-e-Nizami Course Banner",
      subjectsCount: "Comprehensive Curricula",
      monthlyFee: "₹500",
      pinned: true,
    },
    {
      title: "Takhassus (Muftiya) Course",
      subtitle: "Specialization in Ifta & Islamic Jurisprudence",
      categoryTag: "POST-ALIMIYYAH SPECIALIZATION • IFTA",
      description:
        "Fatwa naweesi, jadeed masail ki tehqeeq, comparative jurisprudence, aur shariah counseling par mushtamil aala darje ka mustanad takhassus program.",
      imageSrc: "/images/hero-library.jpg",
      imageAlt: "Takhassus (Muftiya) Course Banner",
      subjectsCount: "Advanced Specialization",
      monthlyFee: "₹500",
      pinned: true,
    },
    {
      title: "Bahaar-e-Shariat Course",
      subtitle: "Essential Islamic Jurisprudence & Practical Shariah",
      categoryTag: "ISLAMIC LAW & FIQH • PRACTICAL GUIDE",
      description:
        "Bahaar-e-Shariat ke zariye roozmarrah ke deeni masail, aqaid, ibadat (Namaz, Roza, Zakaat, Hajj), muamalat aur halal-o-haram ke mustanad ahkaam ki feham.",
      imageSrc: "/images/course-quran.jpg",
      imageAlt: "Bahaar-e-Shariat Course Banner",
      subjectsCount: "Practical Shariah",
      monthlyFee: "₹500",
      pinned: true,
    },
  ];

  return (
    <section id="courses" className="w-full bg-[#fbf7ee] py-10 sm:py-16 border-b border-[#e5dcc7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#785610] mb-2">
              <span className="material-symbols-outlined text-[18px]">
                school
              </span>
              <span className="text-xs uppercase tracking-widest font-bold">
                Featured Programs
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl text-[#1f1b15] font-serif font-semibold">
              Featured Islamic Courses
            </h2>
            <p className="text-base text-[#4e4435] mt-2">
              Authentic Islamic scholarship and traditional deeni taleem with qualified faculty.
            </p>
          </div>
          <div className="hidden md:block">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#fffdf8] border border-[#d9cdb8] text-xs text-[#785610] font-semibold shadow-sm">
              <span className="material-symbols-outlined text-[#a27b34] text-[16px]">
                verified
              </span>
              Qualified Scholars • Recognized Islamic Syllabus
            </span>
          </div>
        </div>

        {/* 3-Column Card Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {courses.map((course, idx) => (
            <CourseCard key={idx} {...course} />
          ))}
        </div>

        {/* Explore All Courses Button */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1f1b15] hover:bg-[#785610] text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md"
          >
            <span>Explore All 13 Courses</span>
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
