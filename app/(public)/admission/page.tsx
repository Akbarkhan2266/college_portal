"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { coursesData } from "@/lib/data";

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

  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.confirmed) {
      alert("Please confirm that the information provided is correct.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-[#fcf9f2] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Top Header Banner Component */}
        <section className="w-full bg-[#fbf7ee] border border-[#e5dcc7] rounded-2xl p-8 sm:p-10 lg:p-12 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5eedb] border border-[#d9cdb8] text-[#785610] text-[11px] font-bold uppercase tracking-wider">
              
              <span>ADMISSIONS OPEN</span>
              <span className="text-[#a27b34]">•</span>
              <span className="text-[#4e4435] font-medium normal-case">Session 2026-27</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-serif text-[#1f1b15] font-bold tracking-tight leading-tight">
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
        <div id="admission-form" className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Admission Form */}
          <div className="lg:col-span-7 bg-white border border-[#e5dcc7] rounded-2xl p-6 sm:p-10 shadow-sm flex flex-col justify-between">
            <div>
              {/* Form Header */}
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f1b15]">
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
                <div className="p-8 rounded-xl bg-[#f5eedb]/80 border border-[#b48a3c]/40 text-center space-y-4 my-8">
                  <span className="material-symbols-outlined text-5xl text-[#785610]">
                    check_circle
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#1f1b15]">
                    Application Submitted Successfully!
                  </h3>
                  <p className="text-sm text-[#4e4435] max-w-md mx-auto">
                    JazakAllah Khair! Your admission application for session 2026-27
                    has been received. Our admissions team will review your details and contact you shortly.
                  </p>
                  <button
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
                    className="mt-4 px-6 py-2.5 bg-[#785610] text-white text-xs font-semibold rounded-lg hover:bg-[#946e28] transition-all"
                  >
                    Submit Another Application
                  </button>
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
                      {coursesData.map((c) => (
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
                    className="w-full py-3.5 rounded-xl bg-[#1f1b15] hover:bg-[#3a2c16] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all mt-4"
                  >
                    <span>Submit Admission Application</span>
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
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
                    Direct helpline se rabta karein: +91 9917802153
                  </span>
                </div>
              </div>
              <a
                href="https://wa.me/919917802153"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-3.5 py-1.5 rounded-lg bg-white border border-[#d9cdb8] text-[#785610] font-semibold hover:bg-[#f5eedb] transition-colors shadow-xs"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Right Column: Visual Feature Showcase */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-lg min-h-[600px] lg:min-h-[700px] flex flex-col justify-between border border-[#e5dcc7] bg-[#2a2113]">
            <Image
              alt="Young Muslim female university students studying classical & modern curriculum"
              src="/images/hero-library.jpg"
              fill
              className="object-cover brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f1b15] via-black/20 to-black/30 pointer-events-none" />

            {/* Top Pill Tag */}
            <div className="relative z-10 p-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#1f1b15] text-xs font-bold shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-[#785610]">
                  menu_book
                </span>
                <span>CLASSICAL &amp; MODERN CURRICULUM</span>
              </div>
            </div>

            {/* Bottom Floating Info Card */}
            <div className="relative z-10 p-6">
              <div className="p-6 rounded-xl bg-[#fffdf8]/95 backdrop-blur-md border border-[#e5dcc7] text-[#1f1b15] shadow-xl space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#785610]">
                  <span className="w-2 h-2 rounded-full bg-[#eebf71] animate-pulse" />
                  ADMISSIONS 2026–27
                </div>
                <h3 className="text-xl font-serif font-bold text-[#1f1b15]">
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
