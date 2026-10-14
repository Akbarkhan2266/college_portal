"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function CareersPage() {
  const [formData, setFormData] = useState({
    titlePrefix: "Maulana",
    fullName: "",
    gender: "Male",
    mobile: "",
    email: "",
    city: "",
    state: "",
    highestSanad: "",
    madrasaName: "",
    passingYear: "",
    appliedRole: "Senior Alim / Faculty of Dars-e-Nizami",
    experienceYears: "3-5 years",
    preferredMode: "Hybrid (Online & Campus)",
    availability: "Full-Time",
    previousInstitutes: "",
    resumeUrl: "",
    teachingBio: "",
    confirmed: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill role if passed via URL query
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get("role");
      if (roleParam) {
        setFormData((prev) => ({ ...prev, appliedRole: decodeURIComponent(roleParam) }));
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const getWhatsAppCareersUrl = (refId?: string) => {
    const lines = [
      "🕌 *Al Jamia Tul Bukhari — Teacher & Faculty Application*",
      "",
      `🔖 *Application Ref:* ${refId || applicationId || "Pending"}`,
      `👤 *Applicant:* ${formData.titlePrefix} ${formData.fullName} (${formData.gender})`,
      `💼 *Applied Role:* ${formData.appliedRole}`,
      `📜 *Highest Sanad:* ${formData.highestSanad} (${formData.passingYear})`,
      `🏛️ *Madrasa / Jamia:* ${formData.madrasaName}`,
      `⏳ *Experience:* ${formData.experienceYears}`,
      `💻 *Preferred Mode:* ${formData.preferredMode}`,
      `⏰ *Availability:* ${formData.availability}`,
      `📱 *Mobile / WhatsApp:* ${formData.mobile}`,
      `✉️ *Email:* ${formData.email}`,
      `📍 *Location:* ${formData.city}, ${formData.state}`,
      formData.previousInstitutes ? `🏫 *Past Institutes:* ${formData.previousInstitutes}` : null,
      formData.resumeUrl ? `📎 *Resume Link:* ${formData.resumeUrl}` : null,
      `📝 *Teaching Methodology:* ${formData.teachingBio}`,
      "",
      "Assalamu Alaikum, I have submitted my faculty application on the official academy portal. Kindly review my credentials.",
    ].filter(Boolean);

    return `https://wa.me/917505611253?text=${encodeURIComponent(lines.join("\n"))}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.confirmed) {
      alert("Please check the declaration box to verify your credentials.");
      return;
    }

    setIsSubmitting(true);

    // Generate reference and open WhatsApp
    setTimeout(() => {
      const randomRef = "FAC-2026-" + Math.floor(1000 + Math.random() * 9000);
      setApplicationId(randomRef);
      setIsSubmitting(false);
      setSubmitted(true);

      const waUrl = getWhatsAppCareersUrl(randomRef);
      if (typeof window !== "undefined") {
        window.open(waUrl, "_blank");
      }

      const formElement = document.getElementById("application-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 600);
  };

  return (
    <div className="w-full bg-[#fcf9f2] min-h-screen py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-10">
        {/* Top Header Hero Banner */}
        <section className="w-full bg-[#fbf7ee] border border-[#e5dcc7] rounded-2xl p-6 sm:p-10 lg:p-12 mb-8 sm:mb-10 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5eedb] border border-[#d9cdb8] text-[#785610] text-[11px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px]">
                  school
                </span>
                <span>FACULTY RECRUITMENT • JOIN OUR ASATIZA</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-serif text-[#1f1b15] font-bold tracking-tight leading-tight">
                Teacher &amp; Faculty Application
              </h1>
              <p className="text-xs sm:text-sm text-[#4e4435] leading-relaxed max-w-xl">
                Khidmat-e-Deen aur taleem-o-tarbiyat ka ahem hissa baniye. We welcome qualified Asatiza, Muallimeen, and Muallimat who possess authentic Sanad, sound pedagogical skill, and a commitment to nurturing faithful, knowledgeable students.
              </p>
            </div>
            <div className="shrink-0 w-full md:w-auto">
              <a
                href="#application-form"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#785610] hover:bg-[#8c6413] text-[#ffffff] text-sm font-semibold transition-all shadow-sm"
              >
                <span>Fill Application Form</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_downward
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* 2-Column Application Layout */}
        <div id="application-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Main Form Column */}
          <div className="lg:col-span-8 bg-white border border-[#e5dcc7] rounded-2xl p-5 sm:p-8 lg:p-10 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#785610] font-bold">
                  Official Application Portal
                </span>
                <h2 className="text-xl sm:text-3xl font-serif font-bold text-[#1f1b15]">
                  Teacher &amp; Faculty Application Form
                </h2>
              </div>
              <span className="hidden sm:inline-block bg-[#f5eedb] text-[#785610] text-xs font-bold px-3 py-1 rounded-md border border-[#d9cdb8]">
                Session 2026-27
              </span>
            </div>
            <p className="text-xs text-[#807566] italic mb-6">
              Baraye meherbani apni mustanad ilmi maloomat darj karein. Talaba aur academy ki committee aapse jald rabta karegi.
            </p>

            {submitted ? (
              <div className="p-8 rounded-xl bg-[#f5eedb]/80 border border-[#b48a3c]/40 text-center space-y-4 my-8">
                <div className="w-16 h-16 rounded-full bg-[#785610] text-white flex items-center justify-center mx-auto shadow-sm">
                  <span className="material-symbols-outlined text-3xl">
                    check
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#1f1b15]">
                  Application Submitted Successfully!
                </h3>
                <p className="text-sm text-[#4e4435] max-w-lg mx-auto">
                  JazakAllah Khair! Respected <span className="font-semibold">{formData.titlePrefix} {formData.fullName}</span>, your faculty application for the role of <span className="font-semibold text-[#785610]">{formData.appliedRole}</span> has been securely submitted.
                </p>

                <div className="p-4 rounded-xl bg-white border border-[#d9cdb8] max-w-md mx-auto text-left space-y-1.5 text-xs text-[#4e4435]">
                  <p className="flex justify-between">
                    <span className="text-[#807566]">Application Reference:</span>
                    <strong className="text-[#1f1b15] font-mono">{applicationId}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-[#807566]">Contact Number:</span>
                    <strong className="text-[#1f1b15]">{formData.mobile}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-[#807566]">Highest Sanad:</span>
                    <strong className="text-[#1f1b15]">{formData.highestSanad || "Verified Sanad"}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-[#807566]">Preferred Mode:</span>
                    <strong className="text-[#1f1b15]">{formData.preferredMode}</strong>
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={getWhatsAppCareersUrl(applicationId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#785610] text-white text-xs font-bold rounded-xl hover:bg-[#8c6413] transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      forum
                    </span>
                    <span>Send Application on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        titlePrefix: "Maulana",
                        fullName: "",
                        gender: "Male",
                        mobile: "",
                        email: "",
                        city: "",
                        state: "",
                        highestSanad: "",
                        madrasaName: "",
                        passingYear: "",
                        appliedRole: "Senior Alim / Faculty of Dars-e-Nizami",
                        experienceYears: "3-5 years",
                        preferredMode: "Hybrid (Online & Campus)",
                        availability: "Full-Time",
                        previousInstitutes: "",
                        resumeUrl: "",
                        teachingBio: "",
                        confirmed: false,
                      });
                    }}
                    className="w-full sm:w-auto px-5 py-3 bg-[#fffdf8] text-[#1f1b15] border border-[#d9cdb8] text-xs font-bold rounded-xl hover:bg-[#f5eedb] transition-all"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: Personal & Contact Information */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#785610] font-bold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#b48a3c]"></span>
                    1. Personal &amp; Contact Details
                  </h4>

                  <div className="space-y-4">
                    {/* Row: Title Prefix, Full Name, Gender */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                          Title Prefix <span className="text-[#ba1a1a]">*</span>
                        </label>
                        <select
                          name="titlePrefix"
                          value={formData.titlePrefix}
                          onChange={handleChange}
                          className="w-full px-3 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all cursor-pointer"
                        >
                          <option value="Maulana">Maulana</option>
                          <option value="Mufti">Mufti</option>
                          <option value="Qari">Qari</option>
                          <option value="Hafiz">Hafiz</option>
                          <option value="Alimah">Alimah</option>
                          <option value="Muftiya">Muftiya</option>
                          <option value="Ustad">Ustad</option>
                          <option value="Dr. / Scholar">Dr. / Scholar</option>
                        </select>
                      </div>

                      <div className="sm:col-span-6">
                        <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                          Full Name <span className="text-[#ba1a1a]">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Mohammad Bilal Qadri"
                          className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] placeholder-[#807566] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                          Gender <span className="text-[#ba1a1a]">*</span>
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full px-3 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all cursor-pointer"
                        >
                          <option value="Male">Male (Muallim)</option>
                          <option value="Female">Female (Muallimah)</option>
                        </select>
                      </div>
                    </div>

                    {/* Row: Mobile & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                          WhatsApp / Mobile Number <span className="text-[#ba1a1a]">*</span>
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          required
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] placeholder-[#807566] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                          Email Address <span className="text-[#ba1a1a]">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="teacher@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] placeholder-[#807566] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Row: City & State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                          City / District <span className="text-[#ba1a1a]">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="e.g. Agra / Bareilly / Lucknow"
                          className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] placeholder-[#807566] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                          State / Province <span className="text-[#ba1a1a]">*</span>
                        </label>
                        <input
                          type="text"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="e.g. Uttar Pradesh"
                          className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] placeholder-[#807566] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Religious & Academic Credentials */}
                <div className="pt-4 border-t border-[#e5dcc7]">
                  <h4 className="text-xs uppercase tracking-wider text-[#785610] font-bold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#b48a3c]"></span>
                    2. Religious &amp; Academic Qualifications
                  </h4>

                  <div className="space-y-4">
                    {/* Row: Highest Sanad & Passing Year */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      <div className="sm:col-span-8">
                        <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                          Highest Sanad / Degree <span className="text-[#ba1a1a]">*</span>
                        </label>
                        <input
                          type="text"
                          name="highestSanad"
                          required
                          value={formData.highestSanad}
                          onChange={handleChange}
                          placeholder="e.g. Dars-e-Nizami (Alimiyyah), Fazil, Takhassus fi al-Ifta, Hifz &amp; Tajweed"
                          className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] placeholder-[#807566] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                          Year of Completion <span className="text-[#ba1a1a]">*</span>
                        </label>
                        <input
                          type="number"
                          name="passingYear"
                          required
                          min="1970"
                          max="2026"
                          value={formData.passingYear}
                          onChange={handleChange}
                          placeholder="e.g. 2021"
                          className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] placeholder-[#807566] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Madrasa / University Name */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                        Madrasa / Jamia / University of Graduation <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <input
                        type="text"
                        name="madrasaName"
                        required
                        value={formData.madrasaName}
                        onChange={handleChange}
                        placeholder="e.g. Al Jamia Tul Ashrafia, Manzar-e-Islam, Darul Uloom, or Jamia Nizamia"
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] placeholder-[#807566] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Teaching Preferences & History */}
                <div className="pt-4 border-t border-[#e5dcc7]">
                  <h4 className="text-xs uppercase tracking-wider text-[#785610] font-bold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#b48a3c]"></span>
                    3. Teaching Profile &amp; Preferences
                  </h4>

                  <div className="space-y-4">
                    {/* Position Applied For */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                        Subject / Position Applying For <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <select
                        name="appliedRole"
                        required
                        value={formData.appliedRole}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all cursor-pointer"
                      >
                        <option value="Senior Alim / Faculty of Dars-e-Nizami">
                          Senior Alim / Faculty of Dars-e-Nizami
                        </option>
                        <option value="Muftiya / Female Islamic Scholar">
                          Muftiya / Female Islamic Scholar (Takhassus &amp; Muballighah)
                        </option>
                        <option value="Ustad-e-Tajweed &amp; Qirat (Muallim / Muallimah)">
                          Ustad-e-Tajweed &amp; Qirat (Muallim / Muallimah)
                        </option>
                        <option value="Arabic Grammar &amp; Linguistics Instructor">
                          Arabic Grammar &amp; Linguistics Instructor (Nahw &amp; Sarf)
                        </option>
                        <option value="Junior Deeniyat &amp; Nazra Quran Teacher">
                          Junior Deeniyat &amp; Nazra Quran Teacher
                        </option>
                        <option value="Bahaar-e-Shariat &amp; Practical Fiqh Instructor">
                          Bahaar-e-Shariat &amp; Practical Fiqh Instructor
                        </option>
                        <option value="Tafseer-ul-Quran &amp; Hadith Teacher">
                          Tafseer-ul-Quran &amp; Hadith Teacher
                        </option>
                        <option value="Urdu Adab &amp; Islamic Language Faculty">
                          Urdu Adab &amp; Islamic Language Faculty
                        </option>
                        <option value="Other Islamic Disciplines">
                          Other Islamic Disciplines
                        </option>
                      </select>
                    </div>

                    {/* Row: Experience, Mode, Availability */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                          Teaching Experience <span className="text-[#ba1a1a]">*</span>
                        </label>
                        <select
                          name="experienceYears"
                          value={formData.experienceYears}
                          onChange={handleChange}
                          className="w-full px-3 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all cursor-pointer"
                        >
                          <option value="Fresher (0-1 year)">Fresher (0-1 year)</option>
                          <option value="1-2 years">1-2 years</option>
                          <option value="3-5 years">3-5 years</option>
                          <option value="6-10 years">6-10 years</option>
                          <option value="10+ years">10+ years</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                          Preferred Mode <span className="text-[#ba1a1a]">*</span>
                        </label>
                        <select
                          name="preferredMode"
                          value={formData.preferredMode}
                          onChange={handleChange}
                          className="w-full px-3 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all cursor-pointer"
                        >
                          <option value="Hybrid (Online & Campus)">Hybrid (Online &amp; Campus)</option>
                          <option value="Online Only (Remote)">Online Only (Remote)</option>
                          <option value="Campus Only (Agra)">Campus Only (Agra)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                          Availability <span className="text-[#ba1a1a]">*</span>
                        </label>
                        <select
                          name="availability"
                          value={formData.availability}
                          onChange={handleChange}
                          className="w-full px-3 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all cursor-pointer"
                        >
                          <option value="Full-Time">Full-Time</option>
                          <option value="Part-Time (Morning)">Part-Time (Morning)</option>
                          <option value="Part-Time (Evening)">Part-Time (Evening)</option>
                          <option value="Weekend Batches">Weekend Batches</option>
                        </select>
                      </div>
                    </div>

                    {/* Previous Teaching Experience */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                        Previous Teaching Experience / Madrasa History
                      </label>
                      <input
                        type="text"
                        name="previousInstitutes"
                        value={formData.previousInstitutes}
                        onChange={handleChange}
                        placeholder="e.g. Taught Dars-e-Nizami at Jamia XYZ for 3 years; online Quran tutor for 2 years"
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] placeholder-[#807566] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all"
                      />
                    </div>

                    {/* Resume Link */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                        Resume / CV Link (Google Drive / Cloud Link)
                      </label>
                      <input
                        type="url"
                        name="resumeUrl"
                        value={formData.resumeUrl}
                        onChange={handleChange}
                        placeholder="https://drive.google.com/... (optional)"
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] placeholder-[#807566] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all"
                      />
                      <span className="text-[11px] text-[#807566] block mt-1">
                        Please ensure share permissions are set to &quot;Anyone with the link can view&quot;.
                      </span>
                    </div>

                    {/* Teaching Philosophy / Khulasah */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                        Teaching Methodology &amp; Short Bio <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <textarea
                        name="teachingBio"
                        required
                        rows={4}
                        value={formData.teachingBio}
                        onChange={handleChange}
                        placeholder="Mukhtasaran apne tadreesi tareeqe, talaba ko samjhane ke usool, aur deeni ilmi maqasid ke bare mein likhein..."
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] placeholder-[#807566] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Declaration Checkbox */}
                <div className="pt-4 border-t border-[#e5dcc7]">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="confirmed"
                      checked={formData.confirmed}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 rounded border-[#d9cdb8] text-[#785610] focus:ring-[#b48a3c] cursor-pointer"
                    />
                    <span className="text-xs text-[#4e4435] leading-relaxed">
                      I solemnly affirm that the religious and academic credentials, sanad, and teaching background submitted in this application are authentic and verifiable. I understand that selection is subject to scholarly interview and demonstration lectures.
                    </span>
                  </label>
                </div>

                {/* Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#785610] hover:bg-[#8c6413] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin text-base">◌</span>
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit &amp; Send on WhatsApp</span>
                        <span className="material-symbols-outlined text-[18px]">
                          forum
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Sidebar: Guidelines & Support */}
          <div className="lg:col-span-4 space-y-6">
            {/* Core Values Card */}
            <div className="bg-white border border-[#e5dcc7] rounded-2xl p-6 shadow-sm">
              <h3 className="font-serif font-bold text-base text-[#1f1b15] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#785610]">
                  menu_book
                </span>
                Our Faculty Expectations
              </h3>
              <ul className="space-y-2.5 text-xs text-[#4e4435] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#785610] mt-0.5 shrink-0">
                    check_circle
                  </span>
                  <span>Commitment to authentic Sunnah and Ahl-e-Sunnat wal Jama&apos;at principles.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#785610] mt-0.5 shrink-0">
                    check_circle
                  </span>
                  <span>Akhlaaq-e-Hasana, shafqat and utmost patience with young learners and new students.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#785610] mt-0.5 shrink-0">
                    check_circle
                  </span>
                  <span>Strict punctuality and adherence to academic timetables and batch guidelines.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#785610] mt-0.5 shrink-0">
                    check_circle
                  </span>
                  <span>Basic digital literacy for online classroom setups (Google Meet / Zoom / Portal).</span>
                </li>
              </ul>
            </div>

            {/* Contact Support for Teachers Card */}
            <div className="bg-[#fffdf8] border border-[#d9cdb8] rounded-2xl p-6 shadow-sm">
              <h4 className="text-sm font-serif font-bold text-[#1f1b15] mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#785610]">
                  contact_support
                </span>
                Faculty Inquiry Desk
              </h4>
              <p className="text-xs text-[#4e4435] leading-relaxed mb-4">
                Have specific queries regarding faculty positions, curriculum scope, or honorarium structure?
              </p>
              <div className="space-y-2 text-xs text-[#1f1b15]">
                <p className="flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-[#785610]">
                    call
                  </span>
                  <span>Admissions / WhatsApp: +91 7505611253</span>
                </p>
                <p className="flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-[#785610]">
                    mail
                  </span>
                  <span>aljamiatulbukhari@gmail.com</span>
                </p>
                <p className="flex items-center gap-2 text-[#807566]">
                  <span className="material-symbols-outlined text-[16px] text-[#785610]">
                    location_on
                  </span>
                  <span>Campus: Shahganj, Agra, Uttar Pradesh</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
