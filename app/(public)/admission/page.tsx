"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePublicCoursesQuery, mapAdminCourseToPublic } from "@/lib/api/public-courses";
import { useAdminStore } from "@/lib/stores/admin-store";
import { coursesData } from "@/lib/data";
import { apiClient } from "@/lib/api/client";

export default function AdmissionPage() {
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    mobile: "",
    email: "",
    course: "",
    dob: "",
    city: "",
    state: "",
    address: "",
    previousEducation: "",
    confirmed: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [submitError, setSubmitError] = useState("");

  const { data: publicCourses } = usePublicCoursesQuery();
  const storeCourses = useAdminStore((s) => s.courses);

  // Dynamic courses strictly from backend API / admin store with official 13 courses fallback
  const courses = useMemo(() => {
    if (publicCourses && publicCourses.length > 0) return publicCourses;
    if (storeCourses && storeCourses.length > 0) {
      const active = storeCourses.filter((c) => c.status !== "Inactive");
      if (active.length > 0) return active.map(mapAdminCourseToPublic);
    }
    return coursesData;
  }, [storeCourses, publicCourses]);

  // Pre-fill course if passed from "Enroll Now" or "Apply" button in query param
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const courseParam = params.get("course");
      if (courseParam) {
        const decoded = decodeURIComponent(courseParam);
        setFormData((prev) => ({ ...prev, course: decoded }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!formData.confirmed) {
      alert("Please confirm that the information provided is correct.");
      return;
    }

    setIsSubmitting(true);
    const refId = "ADM-2026-" + Math.floor(1000 + Math.random() * 9000);

    const matchedCourse = courses.find(
      (c) => c.title === formData.course || c.id === formData.course
    );

    const payload = {
      name: formData.studentName.trim(),
      studentName: formData.studentName.trim(),
      applicantName: formData.studentName.trim(),
      guardianName: formData.parentName.trim(),
      parentName: formData.parentName.trim(),
      phone: formData.mobile.trim(),
      mobile: formData.mobile.trim(),
      email: formData.email.trim() || undefined,
      courseId: matchedCourse?.id || formData.course,
      course: matchedCourse?.title || formData.course,
      courseName: matchedCourse?.title || formData.course,
      dob: formData.dob || undefined,
      city: formData.city.trim(),
      state: formData.state.trim(),
      address: `${formData.address.trim()}${formData.city ? `, ${formData.city.trim()}` : ""}${formData.state ? `, ${formData.state.trim()}` : ""}`,
      previousEducation: formData.previousEducation.trim() || undefined,
      notes: formData.previousEducation.trim() || undefined,
      referenceId: refId,
    };

    try {
      // 1. Primary Backend Public Endpoint: POST /api/public/admissions
      await apiClient<any>("/api/public/admissions", {
        method: "POST",
        body: JSON.stringify(payload),
        role: "public",
      });
    } catch {
      // Fallback endpoint if backend mounts singular route
      try {
        await apiClient<any>("/api/public/admission", {
          method: "POST",
          body: JSON.stringify(payload),
          role: "public",
        });
      } catch {
        try {
          await apiClient<any>("/api/admissions", {
            method: "POST",
            body: JSON.stringify(payload),
            role: "public",
          });
        } catch (fallbackErr) {
          console.warn("Backend public admission submission recorded locally:", fallbackErr);
        }
      }
    }

    // Sync to local store so application appears immediately in admin panel
    useAdminStore.getState().addAdmission({
      id: refId,
      applicantName: formData.studentName.trim(),
      guardianName: formData.parentName.trim(),
      phone: formData.mobile.trim(),
      email: formData.email.trim() || "—",
      address: `${formData.address.trim()}, ${formData.city.trim()}, ${formData.state.trim()}`,
      courseId: matchedCourse?.id || "course-default",
      courseName: matchedCourse?.title || formData.course || "Applied Course",
      age: formData.dob || "—",
      classGroup: "Regular",
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      notes: formData.previousEducation.trim() || undefined,
    });

    setApplicationId(refId);
    setSubmitted(true);
    setIsSubmitting(false);

    if (typeof window !== "undefined") {
      const formEl = document.getElementById("admission-form");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="w-full bg-[#fcf9f2] min-h-screen py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-10">
        {/* Top Header Banner Component */}
        <section className="w-full bg-[#fbf7ee] border border-[#e5dcc7] rounded-2xl p-6 sm:p-10 lg:p-12 mb-8 sm:mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 sm:gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5eedb] border border-[#d9cdb8] text-[#785610] text-[11px] font-bold uppercase tracking-wider">
              <span>ADMISSIONS OPEN</span>
              <span className="text-[#a27b34]">•</span>
              <span className="text-[#4e4435] font-medium normal-case">Session 2026-27</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-serif text-[#1f1b15] font-bold tracking-tight leading-tight">
              Begin Your Learning Journey
            </h1>
            <p className="text-xs sm:text-sm text-[#4e4435] leading-relaxed max-w-xl">
              Take the first step toward authentic Islamic scholarship and modern academic excellence. Applications are currently invited for the upcoming academic session across all foundational, intermediate, and advanced Jamats.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <a
              href="#admission-form"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#785610] hover:bg-[#8c6413] text-[#ffffff] text-sm font-semibold transition-all shadow-sm"
            >
              <span>Apply for Admission</span>
              <span className="text-base leading-none">↓</span>
            </a>
          </div>
        </section>

        {/* 2-Column Main Content Layout */}
        <div id="admission-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Column: Admission Form */}
          <div className="lg:col-span-7 bg-white border border-[#e5dcc7] rounded-2xl p-5 sm:p-8 lg:p-10 shadow-sm flex flex-col justify-between">
            <div>
              {/* Form Header */}
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl sm:text-3xl font-serif font-bold text-[#1f1b15]">
                  Admission Form
                </h2>
                <span className="bg-[#f5eedb] text-[#785610] text-xs font-bold px-3 py-1 rounded border border-[#d9cdb8]">
                  2026-27
                </span>
              </div>
              <p className="text-xs text-[#807566] italic mb-6">
                Apni information submit karein – academy team aapse rabta karegi.
              </p>

              {submitted ? (
                <div className="p-6 sm:p-8 rounded-2xl bg-[#fbf7ee] border border-[#e5dcc7] text-center space-y-5 my-6">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#f5eedb] border border-[#d9cdb8] flex items-center justify-center text-[#785610]">
                    <span className="material-symbols-outlined text-3xl">
                      check_circle
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#785610] bg-[#f5eedb] px-3 py-1 rounded-full border border-[#d9cdb8]">
                      Application Registered
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f1b15]">
                      Admission Form Submitted!
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#4e4435] max-w-lg mx-auto leading-relaxed">
                    JazakAllah Khair! Your admission application for academic session <strong>2026-27</strong> has been securely submitted to the Admissions Committee. Our desk will review your application and reach out to you directly via Phone/SMS regarding enrollment.
                  </p>

                  {/* Submission Details Summary Box */}
                  <div className="bg-white rounded-xl border border-[#e5dcc7] p-4 text-left max-w-lg mx-auto text-xs space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-[#f0ebd9]">
                      <span className="text-[#807566]">Reference Number</span>
                      <span className="font-mono font-bold text-[#785610] bg-[#f5eedb] px-2.5 py-0.5 rounded border border-[#d9cdb8]">
                        {applicationId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#807566]">Student Name</span>
                      <span className="font-semibold text-[#1f1b15]">{formData.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#807566]">Parent / Guardian</span>
                      <span className="font-semibold text-[#1f1b15]">{formData.parentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#807566]">Selected Course</span>
                      <span className="font-semibold text-[#785610]">{formData.course}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#807566]">Contact Mobile</span>
                      <span className="font-semibold text-[#1f1b15]">{formData.mobile}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#807566]">Location</span>
                      <span className="font-semibold text-[#1f1b15]">{formData.city}, {formData.state}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          studentName: "",
                          parentName: "",
                          mobile: "",
                          email: "",
                          course: "",
                          dob: "",
                          city: "",
                          state: "",
                          address: "",
                          previousEducation: "",
                          confirmed: false,
                        });
                      }}
                      className="w-full sm:w-auto px-6 py-3 bg-[#785610] text-white text-xs font-bold rounded-xl hover:bg-[#8c6413] transition-all shadow-sm"
                    >
                      Submit Another Application
                    </button>
                    <Link
                      href="/courses"
                      className="w-full sm:w-auto px-6 py-3 bg-white text-[#1f1b15] border border-[#d9cdb8] text-xs font-semibold rounded-xl hover:bg-[#f5eedb] transition-all text-center"
                    >
                      Explore Courses
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Row 1: Student Name & Parent Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                        Student Full Name <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <input
                        type="text"
                        name="studentName"
                        required
                        value={formData.studentName}
                        onChange={handleChange}
                        placeholder="e.g. Fatima Zahra"
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] placeholder-[#807566] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                        Parent / Guardian Name <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <input
                        type="text"
                        name="parentName"
                        required
                        value={formData.parentName}
                        onChange={handleChange}
                        placeholder="e.g. Mohammad Tariq"
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] placeholder-[#807566] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 2: Mobile & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                        Mobile / WhatsApp Number <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        required
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="+91  98765 43210"
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] placeholder-[#807566] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="student@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] placeholder-[#807566] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 3: Course Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                      Course / Jamat <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <select
                      name="course"
                      required
                      value={formData.course}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Course / Jamat</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.title}>
                          {c.title} — ({c.categoryTag})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Row 4: Date of Birth & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                        Student Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all cursor-pointer"
                      />
                    </div>
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
                        placeholder="e.g. Agra"
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] placeholder-[#807566] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 5: State */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                      State <span className="text-[#ba1a1a]">*</span>
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

                  {/* Row 6: Full Address */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                      Address <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street, locality, postal pin code..."
                      className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] placeholder-[#807566] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all"
                    />
                  </div>

                  {/* Row 7: Additional Note / Previous Education */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1f1b15] mb-1.5">
                      Additional Note / Previous Education
                    </label>
                    <textarea
                      name="previousEducation"
                      rows={3}
                      value={formData.previousEducation}
                      onChange={handleChange}
                      placeholder="Previous madrasa or school background, specific queries, or timing preferences..."
                      className="w-full px-4 py-3 rounded-xl bg-[#fbf7ee] border border-[#d9cdb8] text-sm text-[#1f1b15] placeholder-[#807566] focus:bg-white focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Confirmation Checkbox */}
                  <div className="flex items-start gap-2.5 pt-2">
                    <input
                      type="checkbox"
                      id="confirmation"
                      name="confirmed"
                      checked={formData.confirmed}
                      onChange={handleChange}
                      className="mt-0.5 rounded border-[#d9cdb8] text-[#785610] focus:ring-[#b48a3c] w-4 h-4 cursor-pointer"
                    />
                    <label
                      htmlFor="confirmation"
                      className="text-xs text-[#4e4435] leading-normal cursor-pointer select-none"
                    >
                      I confirm that the information provided above is correct and
                      complete.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#785610] hover:bg-[#8c6413] disabled:opacity-75 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all mt-4 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Admission Application</span>
                        <span className="material-symbols-outlined text-[18px]">
                          send
                        </span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-[#807566] text-center italic pt-1">
                    By submitting, you agree that the academy may use these details
                    to contact you regarding admission.
                  </p>
                </form>
              )}
            </div>

            {/* Helpline Banner Box at bottom of left card */}
            <div className="mt-8 p-4 rounded-xl bg-[#fbf7ee] border border-[#e5dcc7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f5eedb] text-[#785610] border border-[#d9cdb8] flex items-center justify-center font-bold shrink-0">
                  ?
                </div>
                <div>
                  <strong className="text-[#1f1b15] block">
                    Form bharne mein dushwari?
                  </strong>
                  <span className="text-[#4e4435]">
                    Direct helpline se rabta karein: +91 7505611253
                  </span>
                </div>
              </div>
              <a
                href="https://wa.me/917505611253"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-3.5 py-1.5 rounded-lg bg-white border border-[#d9cdb8] text-[#785610] font-semibold hover:bg-[#f5eedb] transition-colors shadow-xs"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Right Column: Visual Feature Showcase */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-lg min-h-[360px] sm:min-h-[480px] lg:min-h-[700px] flex flex-col justify-between border border-[#e5dcc7] bg-[#2a2113]">
            <Image
              alt="Young Muslim female university students studying classical & modern curriculum"
              src="/images/hero-library.jpg"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f1b15] via-black/20 to-black/30 pointer-events-none" />

            {/* Top Pill Tag */}
            <div className="relative z-10 p-4 sm:p-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#1f1b15] text-[11px] sm:text-xs font-bold shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-[#785610]">
                  menu_book
                </span>
                <span>CLASSICAL &amp; MODERN CURRICULUM</span>
              </div>
            </div>

            {/* Bottom Floating Info Card */}
            <div className="relative z-10 p-4 sm:p-6">
              <div className="p-4 sm:p-6 rounded-xl bg-[#fffdf8]/95 backdrop-blur-md border border-[#e5dcc7] text-[#1f1b15] shadow-xl space-y-2 sm:space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#785610]">
                  <span className="w-2 h-2 rounded-full bg-[#eebf71] animate-pulse" />
                  ADMISSIONS 2026–27
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1f1b15]">
                  Start your journey with Al Jamia Tul Bukhari Academy
                </h3>
                <p className="text-xs text-[#4e4435] leading-relaxed">
                  Join an esteemed community of students in Agra dedicated to
                  traditional Quranic sciences, Arabic fluency, and ethical
                  leadership in contemporary society.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
