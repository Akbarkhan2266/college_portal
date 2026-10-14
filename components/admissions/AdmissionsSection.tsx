import React from "react";
import Link from "next/link";
import AdmissionStepCard from "./AdmissionStepCard";

export default function AdmissionsSection() {
  const steps = [
    {
      stepNumber: "01",
      title: "Select Your Degree & Review Criteria",
      description:
        "Review prerequisites for our Shariah, Islamic Banking, Computing, or Arabic faculties.",
      badgeIcon: "check",
      badgeLabel: "Criteria Published",
    },
    {
      stepNumber: "02",
      title: "Submit Academic Transcripts",
      description:
        "Upload past educational certificates, Statement of Intent, and Quranic recitation or Hifz proof if applicable.",
      badgeIcon: "upload_file",
      badgeLabel: "Online Portal",
    },
    {
      stepNumber: "03",
      title: "Faculty Ethics Assessment",
      description:
        "Participate in an interactive virtual or in-person discussion with senior faculty mentors and Shariah counselors.",
      badgeIcon: "forum",
      badgeLabel: "Virtual or In-Person",
    },
  ];

  return (
    <section
      id="admission"
      className="w-full bg-gradient-to-b from-[#241c11] via-[#2c2214] to-[#1c160e] text-[#fffdf8] py-10 sm:py-16 relative overflow-hidden border-t border-[#8c6828]/40"
    >
      <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-[#b48a3c]/15 filter blur-3xl pointer-events-none" />
      <div className="absolute -left-20 top-20 w-80 h-80 rounded-full bg-[#eebf71]/10 filter blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block py-1 px-3.5 rounded-full bg-[#ffffff]/10 border border-[#b48a3c]/40 text-[#ffdcc3] text-xs tracking-widest uppercase font-semibold mb-3">
            Admissions 2026–27 Open
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#fffdf8] font-serif font-semibold">
            Begin Your Path of Knowledge &amp; Purpose
          </h2>
          <p className="text-sm sm:text-lg text-[#ebe3cc] mt-3 leading-relaxed">
            Apply for the 2026–27 Academic Year. Need-based, Merit-based, and
            Tahfeez-ul-Quran special scholarship windows are currently open.
          </p>
        </div>

        {/* 3-Step Progression Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 sm:mb-16">
          {steps.map((step, idx) => (
            <AdmissionStepCard key={idx} {...step} />
          ))}
        </div>

        {/* Action Hub Box */}
        <div className="bg-gradient-to-br from-[#fffdf8] to-[#fbf7ee] rounded-xl p-5 sm:p-8 text-[#1f1b15] shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 border border-[#e5dcc7]">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-xl sm:text-2xl text-[#1f1b15] font-serif font-bold">
              Ready to Join Al-Jamia Tul Bukhari?
            </h3>
            <p className="text-xs sm:text-sm text-[#4e4435] max-w-xl leading-relaxed">
              Complete the intuitive online admissions portal in under 15
              minutes. No initial application fee required for early scholarship
              consideration.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Link
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#785610] text-white text-sm font-semibold hover:bg-[#946e28] transition-all shadow-md border border-[#b48a3c]"
              href="/admission"
            >
              <span>Start Online Application</span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </Link>
            <Link
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#f5eedb] border border-[#d9cdb8] text-[#785610] hover:bg-[#ebe3cc] text-sm font-semibold transition-all"
              href="#scholarship"
            >
              <span className="material-symbols-outlined text-[#8c6828] text-[18px]">
                volunteer_activism
              </span>
              <span>Apply for Zakat Scholarship</span>
            </Link>
          </div>
        </div>

        {/* Quick Helpline Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-2xl sm:rounded-full bg-[#ffffff]/5 border border-[#b48a3c]/30 text-[#ebe3cc] text-xs backdrop-blur-sm">
            <span className="material-symbols-outlined text-[16px] text-[#eebf71]">
              support_agent
            </span>
            <span>
              Admissions / WhatsApp:{" "}
              <a
                href="https://wa.me/917505611253"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#fffdf8] font-bold hover:underline"
              >
                +91 7505611253
              </a>
              {" "}•{" "}
              <a
                href="mailto:aljamiatulbukhari@gmail.com"
                className="text-[#fffdf8] font-semibold hover:underline"
              >
                aljamiatulbukhari@gmail.com
              </a>
            </span>
            <span className="opacity-40 text-[#c2b498]">•</span>
            <span>Dedicated Sister &amp; Brother Admissions Counselors Available</span>
            <span className="opacity-40 text-[#c2b498]">•</span>
            <Link
              className="text-[#ffdcc3] hover:underline inline-flex items-center gap-1 font-semibold"
              href="#tour"
            >
              Schedule Virtual Campus Tour →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
