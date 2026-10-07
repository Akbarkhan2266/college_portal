import React from "react";
import CourseCard from "./CourseCard";

export default function AcademicPathways() {
  const courses = [
    {
      title: "Qura'an / Tajweed",
      subtitle: "Recite the Words of Allah with Beauty & Accuracy",
      categoryTag: "ISLAMIC & ACADEMIC PROGRAM • 12 MONTHS",
      description:
        "Qur’an / Tajweed course mein Qur’an-e-Kareem ki durust tilawat aur Tajweed ke qawaid ko asaan andaaz mein sikhaya jata hai. Yeh course makharij, huroof ki adaigi aur tilawat ki durustgi par khaas tawajjoh deta hai.",
      imageSrc: "/images/course-quran.jpg",
      imageAlt: "Qur'an Tajweed Course Banner",
      subjectsCount: "0 subjects",
      monthlyFee: "₹200",
    },
    {
      title: "Islamic Jurisprudence",
      subtitle: "Faculty of Classical Shariah & Law",
      categoryTag: "ISLAMIC & ACADEMIC PROGRAM • 4 YEARS",
      description:
        "Classical Islamic sciences, Islamic banking & finance, contemporary bioethics, aur comparative jurisprudence par mushtamil jame degree program.",
      imageSrc: "/images/course-jurisprudence.jpg",
      imageAlt: "Muballighah Course Banner",
      subjectsCount: "8 subjects",
      monthlyFee: "₹250",
    },
    {
      title: "Ethical AI & Software",
      subtitle: "Faculty of CS & Technology",
      categoryTag: "ISLAMIC & ACADEMIC PROGRAM • 4 YEARS B.TECH",
      description:
        "B.Tech in Ethical AI, Data Systems, Software Engineering aur Cybersecurity, Shariah ethics ke pledge ke sath jaded technology ki taleem.",
      imageSrc: "/images/course-ai.jpg",
      imageAlt: "Ethical AI & Software Engineering Banner",
      subjectsCount: "12 subjects",
      monthlyFee: "₹300",
    },
  ];

  return (
    <section id="courses" className="w-full bg-[#fbf7ee] py-10 sm:py-14 border-b border-[#e5dcc7]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#785610] mb-2">
              <span className="material-symbols-outlined text-[18px]">
                school
              </span>
              <span className="text-xs uppercase tracking-widest font-bold">
                Comprehensive Curricula
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl text-[#1f1b15] font-serif font-semibold">
              Dual-Excellence Academic Pathways
            </h2>
            <p className="text-base text-[#4e4435] mt-2">
              Rooted in divine wisdom, prepared for global professions.
            </p>
          </div>
          <div className="hidden md:block">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#fffdf8] border border-[#d9cdb8] text-xs text-[#785610] font-semibold shadow-sm">
              <span className="material-symbols-outlined text-[#a27b34] text-[16px]">
                verified
              </span>
              UGC Recognised • OIC Academic Affiliate
            </span>
          </div>
        </div>

        {/* 3-Column Card Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {courses.map((course, idx) => (
            <CourseCard key={idx} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
}
