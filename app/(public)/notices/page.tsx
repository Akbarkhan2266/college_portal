"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Notice } from "@/lib/data";
import { usePublicNoticesQuery, mapAdminNoticeToPublic } from "@/lib/api/public-notices";
import { useAdminStore } from "@/lib/stores/admin-store";
import { getStoredAdminNotices } from "@/lib/api/notice-store-sync";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function NoticesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDate, setSelectedDate] = useState("All Dates");
  const [activeModalNotice, setActiveModalNotice] = useState<Notice | null>(null);

  const { data: publicNotices, isLoading, refetch } = usePublicNoticesQuery();
  const storeNotices = useAdminStore((s) => s.notices);

  // Combine dynamic notices: backend query / store / local storage (ONLY real notices)
  const allAdminNotices: Notice[] = useMemo(() => {
    // 1. Query result from backend
    if (publicNotices && publicNotices.length > 0) {
      return publicNotices;
    }
    // 2. Check Zustand admin store if populated
    if (storeNotices && storeNotices.length > 0) {
      return storeNotices.map(mapAdminNoticeToPublic);
    }
    // 3. LocalStorage persistence
    const cached = getStoredAdminNotices();
    if (cached && cached.length > 0) {
      return cached.map(mapAdminNoticeToPublic);
    }
    // 4. Clean empty array (no hardcoded mock notices)
    return [];
  }, [storeNotices, publicNotices]);

  // Dynamic filter options based on available admin notices
  const availableCategories = useMemo(() => {
    const cats = new Set(allAdminNotices.map((n) => n.category));
    return ["All Categories", ...Array.from(cats)];
  }, [allAdminNotices]);

  const availableDates = useMemo(() => {
    const dates = new Set(allAdminNotices.map((n) => `${n.month} ${n.year}`));
    return ["All Dates", ...Array.from(dates)];
  }, [allAdminNotices]);

  // Featured notice: prefer one marked with showOnTicker or first item
  const featuredNotice = useMemo(() => {
    if (allAdminNotices.length === 0) return null;
    return allAdminNotices.find((n) => n.featured) || allAdminNotices[0];
  }, [allAdminNotices]);

  // Regular notices (excluding featured notice if multiple exist)
  const regularNotices = useMemo(() => {
    if (allAdminNotices.length <= 1) return allAdminNotices;
    return allAdminNotices.filter((n) => n.id !== featuredNotice?.id);
  }, [allAdminNotices, featuredNotice]);

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
    <div className="w-full bg-[#fcf9f2] min-h-screen py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-10">
        {/* 1. Header Section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[#785610] text-[11px] font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-[#a27b34]" />
                <span>OFFICIAL NOTICE BOARD</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-serif text-[#1f1b15] font-bold tracking-tight">
                Academy Updates &amp; Announcements
              </h1>
              <p className="text-xs sm:text-sm text-[#4e4435] mt-1.5 leading-relaxed">
                Official circulars, examinations, admissions, and academic notifications published by the administration.
              </p>
            </div>
            <div className="shrink-0 flex flex-wrap items-center gap-2">
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f5eedb] hover:bg-[#ebe3cc] border border-[#d9cdb8] text-xs font-semibold text-[#785610] transition-colors"
                title="Refresh notices"
              >
                <span className="material-symbols-outlined text-[15px] text-[#a27b34]">
                  sync
                </span>
                <span>Refresh</span>
              </button>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f5eedb] border border-[#d9cdb8] text-xs font-medium text-[#785610]">
                <span className="material-symbols-outlined text-[15px] text-[#a27b34]">
                  calendar_month
                </span>
                <span>Academic Year 2026–27</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Search & Filter Bar (Visible when notices exist) */}
        {allAdminNotices.length > 0 && (
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
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Dropdown */}
              <div className="md:col-span-3">
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#fbf7ee] border border-[#d9cdb8] text-xs sm:text-sm text-[#1f1b15] focus:bg-white focus:border-[#b48a3c] focus:outline-none transition-all cursor-pointer"
                >
                  {availableDates.map((dt) => (
                    <option key={dt} value={dt}>
                      {dt}
                    </option>
                  ))}
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
        )}

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

              <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row items-center gap-2.5">
                {featuredNotice.pdfAttachment && (
                  <a
                    href={featuredNotice.pdfAttachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#f5eedb] hover:bg-[#ebe3cc] border border-[#d9cdb8] text-xs sm:text-sm font-semibold text-[#785610] transition-all shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      download
                    </span>
                    <span>Download PDF</span>
                  </a>
                )}
                <button
                  onClick={() => setActiveModalNotice(featuredNotice)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1f1b15] hover:bg-[#785610] text-white text-xs sm:text-sm font-semibold transition-all shadow-md group"
                >
                  <span>Read Notice</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 4. Latest Announcements Section */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl sm:text-2xl font-serif text-[#1f1b15] font-bold">
              All Announcements
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#f5eedb] text-[#785610] text-[11px] font-semibold border border-[#d9cdb8]">
              {filteredNotices.length} Notices Available
            </span>
          </div>

          {/* Vertical Notice List or Empty State */}
          {filteredNotices.length > 0 ? (
            <div className="space-y-4">
              {filteredNotices.map((notice) => (
                <NoticeListItem
                  key={notice.id}
                  notice={notice}
                  onSelectNotice={(n) => setActiveModalNotice(n)}
                />
              ))}
            </div>
          ) : allAdminNotices.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e5dcc7] p-12 text-center my-6 shadow-xs">
              <span className="material-symbols-outlined text-5xl text-[#b48a3c] mb-3">
                campaign
              </span>
              <h3 className="text-xl font-serif font-bold text-[#1f1b15]">
                No Announcements Published Yet
              </h3>
              <p className="text-xs sm:text-sm text-[#4e4435] mt-1.5 max-w-md mx-auto leading-relaxed">
                Official circulars and notifications updated in the Admin Panel will appear here. Please check back later.
              </p>
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

        {/* 5. Need Help Box */}
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
              For admission, class schedules, examination information or any circular-related query, contact the academy office.
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
              href="mailto:aljamiatulbukhari@gmail.com"
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

      {/* Notice Detail Dialog */}
      <Dialog
        open={Boolean(activeModalNotice)}
        onOpenChange={(open) => !open && setActiveModalNotice(null)}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#f5eedb] text-[#785610] border border-[#d9cdb8]">
                {activeModalNotice?.category}
              </span>
              <span className="text-xs text-[#807566] font-medium">
                {activeModalNotice?.day} {activeModalNotice?.month} {activeModalNotice?.year}
              </span>
            </div>
            <DialogTitle className="text-xl font-serif font-bold text-[#1f1b15] leading-tight">
              {activeModalNotice?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#807566]">
              Official Academy Circular
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <p className="text-sm text-[#4e4435] leading-relaxed whitespace-pre-wrap">
              {activeModalNotice?.description}
            </p>

            {activeModalNotice?.tags && activeModalNotice.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {activeModalNotice.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] text-[#807566] bg-[#fbf7ee] px-2 py-0.5 rounded border border-[#e5dcc7]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row items-center gap-2 justify-between">
            {activeModalNotice?.pdfAttachment ? (
              <a
                href={activeModalNotice.pdfAttachment}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#785610] hover:bg-[#8c6413] text-white text-xs font-semibold transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[15px]">
                  download
                </span>
                <span>Download Official PDF</span>
              </a>
            ) : (
              <span className="text-xs text-[#807566] italic">
                No external document attached
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveModalNotice(null)}
              className="w-full sm:w-auto text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NoticeListItem({
  notice,
  onSelectNotice,
}: {
  notice: Notice;
  onSelectNotice: (n: Notice) => void;
}) {
  const categoryStyles: Record<string, string> = {
    Examination: "bg-[#e2e8f0] text-[#334155]",
    Exam: "bg-[#e2e8f0] text-[#334155]",
    "New Batch": "bg-[#fef3c7] text-[#92400e]",
    Holiday: "bg-[#fee2e2] text-[#991b1b]",
    Admission: "bg-[#fef9c3] text-[#854d0e]",
    Admissions: "bg-[#fef9c3] text-[#854d0e]",
    Urgent: "bg-[#fee2e2] text-[#991b1b]",
    Event: "bg-[#ffedd5] text-[#9a3412]",
  };

  const badgeClass =
    categoryStyles[notice.category] || "bg-[#f5eedb] text-[#785610]";

  return (
    <div className="bg-white border border-[#e5dcc7] rounded-xl p-4 sm:p-6 hover:border-[#b48a3c]/60 hover:shadow-xs transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5">
      {/* Date & Category Box */}
      <div className="flex items-start sm:items-center gap-3.5 sm:gap-5">
        <div className="w-14 sm:w-20 shrink-0 text-center flex flex-col items-center justify-center border-r border-[#e5dcc7] pr-3 sm:pr-5">
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
        <div className="space-y-1.5 flex-1 min-w-0">
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

      {/* Action Buttons */}
      <div className="shrink-0 w-full md:w-auto flex items-center justify-end md:justify-start gap-2 pt-2 md:pt-0 border-t border-[#f5eedb] md:border-t-0">
        {notice.pdfAttachment && (
          <a
            href={notice.pdfAttachment}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f5eedb] hover:bg-[#ebe3cc] border border-[#d9cdb8] text-xs font-semibold text-[#785610] transition-all"
            title="Download Attached Document"
          >
            <span className="material-symbols-outlined text-[14px]">
              download
            </span>
            <span>PDF</span>
          </a>
        )}
        <button
          onClick={() => onSelectNotice(notice)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#fbf7ee] hover:bg-[#f5eedb] border border-[#d9cdb8] text-xs font-semibold text-[#1f1b15] transition-all group"
        >
          <span>Read Notice</span>
          <span className="material-symbols-outlined text-[14px] text-[#785610] group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
