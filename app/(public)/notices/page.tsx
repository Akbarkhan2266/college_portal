"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { noticesData, Notice } from "@/lib/data";

export default function NoticesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDate, setSelectedDate] = useState("All Dates");

  const featuredNotice = useMemo(() => {
    return noticesData.find((n) => n.featured) || noticesData[0];
  }, []);

  const regularNotices = useMemo(() => {
    return noticesData.filter((n) => !n.featured);
  }, []);

  // Filter regular notices by search, category, and date
  const filteredNotices = useMemo(() => {
    return regularNotices.filter((notice) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "All Categories" ||
        notice.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesDate =
        selectedDate === "All Dates" ||
        `${notice.month} ${notice.year}`.toLowerCase() ===
          selectedDate.toLowerCase() ||
        notice.year === selectedDate;

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [regularNotices, searchQuery, selectedCategory, selectedDate]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedDate("All Dates");
  };

  return (
    <div className="w-full bg-[#fcf9f2] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* 1. Header Section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              {/* <div className="inline-flex items-center gap-2 text-[#785610] text-[11px] font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-[#a27b34]" />
                <span>NOTICE BOARD</span>
              </div> */}
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-serif text-[#1f1b15] font-bold tracking-tight">
                Academy Updates &amp; Announcements
              </h1>
              <p className="text-xs sm:text-sm text-[#4e4435] mt-1.5 leading-relaxed">
                Stay updated with important announcements, examinations, admissions, holidays, events, and new batches.
              </p>
            </div>
            <div className="shrink-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f5eedb] border border-[#d9cdb8] text-xs font-medium text-[#785610]">
                <span className="material-symbols-outlined text-[15px] text-[#a27b34]">
                  calendar_month
                </span>
                <span>Hijri 1447 / Academic Year 2026–27</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Search & Filter Bar */}
        <section className="bg-white border border-[#e5dcc7] rounded-xl p-3 sm:p-4 mb-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#807566] text-[18px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search announcements..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#fbf7ee] border border-[#d9cdb8] text-xs sm:text-sm text-[#1f1b15] placeholder-[#807566] focus:bg-white focus:border-[#b48a3c] focus:outline-none transition-all"
              />
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#fbf7ee] border border-[#d9cdb8] text-xs sm:text-sm text-[#1f1b15] focus:bg-white focus:border-[#b48a3c] focus:outline-none transition-all cursor-pointer"
              >
                <option value="All Categories">All Categories</option>
                <option value="Examination">Examination</option>
                <option value="New Batch">New Batch</option>
                <option value="Holiday">Holiday</option>
                <option value="Admission">Admission</option>
                <option value="Event">Event</option>
              </select>
            </div>

            {/* Date Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#fbf7ee] border border-[#d9cdb8] text-xs sm:text-sm text-[#1f1b15] focus:bg-white focus:border-[#b48a3c] focus:outline-none transition-all cursor-pointer"
              >
                <option value="All Dates">All Dates</option>
                <option value="NOV 2026">November 2026</option>
                <option value="OCT 2026">October 2026</option>
                <option value="SEP 2026">September 2026</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="md:col-span-1 flex justify-end">
              <button
                onClick={handleReset}
                title="Reset filters"
                className="w-full md:w-auto p-2.5 rounded-lg bg-[#fbf7ee] border border-[#d9cdb8] text-[#4e4435] hover:text-[#1f1b15] hover:bg-[#f5eedb] transition-all flex items-center justify-center"
                aria-label="Reset Filters"
              >
                <span className="material-symbols-outlined text-[18px]">
                  refresh
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* 3. Featured Announcement Card */}
        {featuredNotice && (
          <section className="mb-12">
            <div className="relative rounded-2xl bg-gradient-to-r from-[#fbf7ee] via-[#f7f0df] to-[#ebe3cc] border border-[#e5dcc7] p-6 sm:p-8 lg:p-10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#b48a3c] text-white">
                    FEATURED ANNOUNCEMENT
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#f5eedb] text-[#785610] border border-[#d9cdb8]">
                    {featuredNotice.category}
                  </span>
                  <span className="text-xs text-[#807566] flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[14px]">
                      calendar_today
                    </span>
                    {featuredNotice.day} {featuredNotice.month} {featuredNotice.year}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif text-[#1f1b15] font-bold tracking-tight">
                  {featuredNotice.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#4e4435] leading-relaxed max-w-2xl">
                  {featuredNotice.description}
                </p>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <Link
                  href="/admission"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1f1b15] hover:bg-[#3a2c16] text-white text-xs sm:text-sm font-semibold transition-all shadow-md group"
                >
                  <span>Read Full Notice</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 4. Latest Announcements Section */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl sm:text-2xl font-serif text-[#1f1b15] font-bold">
              Latest Announcements
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#f5eedb] text-[#785610] text-[11px] font-semibold border border-[#d9cdb8]">
              {filteredNotices.length} Notices Available
            </span>
          </div>

          {/* Vertical Notice List */}
          {filteredNotices.length > 0 ? (
            <div className="space-y-4">
              {filteredNotices.map((notice) => (
                <NoticeListItem key={notice.id} notice={notice} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#e5dcc7] p-10 text-center my-6">
              <span className="material-symbols-outlined text-4xl text-[#8c6828] mb-2">
                info
              </span>
              <h3 className="text-lg font-serif font-semibold text-[#1f1b15]">
                No announcements match your search
              </h3>
              <p className="text-xs text-[#4e4435] mt-1">
                Try clearing or adjusting your search keywords and filter criteria.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-[#785610] text-white text-xs font-semibold rounded-lg hover:bg-[#946e28] transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* 5. Need Help With an Announcement Bottom Box */}
        <section className="rounded-2xl bg-white border border-[#e5dcc7] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-[#785610] text-[11px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[15px] text-[#a27b34]">
                support_agent
              </span>
              <span>NEED ASSISTANCE?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-[#1f1b15] font-bold">
              Need Help With an Announcement?
            </h3>
            <p className="text-xs sm:text-sm text-[#4e4435] leading-relaxed">
              For admission, class schedules, examination information or any notice-related query, contact the academy team.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Link
              href="/admission"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#785610] hover:bg-[#8c6413] text-white text-xs font-semibold transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span>Contact Admissions</span>
            </Link>
            <a
              href="mailto:admissions@aljamiatulbukhari.org"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#f5eedb] hover:bg-[#ebe3cc] text-[#1f1b15] text-xs font-semibold border border-[#d9cdb8] transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-[#785610]">
                mail
              </span>
              <span>Email Academy</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

function NoticeListItem({ notice }: { notice: Notice }) {
  // Category badge color mapping
  const categoryStyles: Record<string, string> = {
    Examination: "bg-[#e2e8f0] text-[#334155]",
    "New Batch": "bg-[#fef3c7] text-[#92400e]",
    Holiday: "bg-[#fee2e2] text-[#991b1b]",
    Admission: "bg-[#fef9c3] text-[#854d0e]",
    Event: "bg-[#ffedd5] text-[#9a3412]",
  };

  const badgeClass =
    categoryStyles[notice.category] || "bg-[#f5eedb] text-[#785610]";

  return (
    <div className="bg-white border border-[#e5dcc7] rounded-xl p-5 sm:p-6 hover:border-[#b48a3c]/60 hover:shadow-xs transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-5">
      {/* Date & Category Box */}
      <div className="flex items-center gap-5">
        <div className="w-16 sm:w-20 shrink-0 text-center flex flex-col items-center justify-center border-r border-[#e5dcc7] pr-4 sm:pr-5">
          <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1f1b15] leading-none">
            {notice.day}
          </span>
          <span className="text-[10px] font-bold text-[#807566] tracking-wider uppercase mt-1">
            {notice.month} {notice.year}
          </span>
          <span
            className={`mt-2 px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase ${badgeClass}`}
          >
            {notice.category}
          </span>
        </div>

        {/* Notice Info */}
        <div className="space-y-1.5 flex-1">
          <h3 className="text-base sm:text-lg font-serif font-bold text-[#1f1b15] leading-snug">
            {notice.title}
          </h3>
          <p className="text-xs text-[#4e4435] leading-relaxed max-w-3xl">
            {notice.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {notice.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] text-[#807566] bg-[#fbf7ee] px-2 py-0.5 rounded border border-[#e5dcc7]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Read Notice CTA */}
      <div className="shrink-0 self-start md:self-center pl-20 md:pl-0">
        <Link
          href={`#${notice.id}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#fbf7ee] hover:bg-[#f5eedb] border border-[#d9cdb8] text-xs font-semibold text-[#1f1b15] transition-all group"
        >
          <span>Read Notice</span>
          <span className="material-symbols-outlined text-[14px] text-[#785610] group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </Link>
      </div>
    </div>
  );
}
