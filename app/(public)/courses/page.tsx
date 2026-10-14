"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Course, coursesData } from "@/lib/data";
import { usePublicCoursesQuery, mapAdminCourseToPublic } from "@/lib/api/public-courses";
import { useAdminStore } from "@/lib/stores/admin-store";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: publicCourses, isLoading } = usePublicCoursesQuery();
  const storeCourses = useAdminStore((s) => s.courses);

  // Dynamic courses strictly from backend API or official 13 courses catalogue
  const activeCatalogueCourses = useMemo(() => {
    if (publicCourses && publicCourses.length > 0) {
      return publicCourses;
    }
    if (storeCourses && storeCourses.length > 0) {
      const active = storeCourses.filter((c) => c.status !== "Inactive");
      if (active.length > 0) {
        return active.map(mapAdminCourseToPublic);
      }
    }
    return coursesData;
  }, [storeCourses, publicCourses]);

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return activeCatalogueCourses;
    const q = searchQuery.toLowerCase();
    return activeCatalogueCourses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.categoryTag.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery, activeCatalogueCourses]);

  return (
    <div className="w-full bg-[#fcf9f2] min-h-screen pb-20">
      {/* Upper Search Header Banner Component */}
      <section className="w-full bg-[#fbf7ee] border-b border-[#e5dcc7] py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5eedb] border border-[#d9cdb8] text-[#785610] text-[11px] font-bold uppercase tracking-wider mb-3 sm:mb-4">
            <span className="text-[#a27b34] text-[10px]">✦</span>
            <span>EXPLORE OUR PROGRAMS</span>
            <span className="text-[#a27b34] text-[10px]">✦</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1f1b15] font-semibold tracking-tight leading-tight">
            Find the Right Course for Your Journey
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-[#4e4435] max-w-2xl mx-auto mt-2.5 sm:mt-3 leading-relaxed font-sans">
            Discover traditional Islamic scholarship, Quranic sciences, modern
            technology, and contemporary skill programs designed to nurture
            knowledge and character.
          </p>

          {/* Search Input Box */}
          <div className="mt-6 sm:mt-8 max-w-xl mx-auto relative">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 sm:left-4 text-[#807566] text-[20px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a course, by title or specialization..."
                className="w-full pl-11 sm:pl-12 pr-10 py-3 sm:py-3.5 rounded-xl bg-white border border-[#d9cdb8] text-xs sm:text-sm text-[#1f1b15] placeholder-[#807566] focus:outline-none focus:border-[#b48a3c] focus:ring-2 focus:ring-[#b48a3c]/20 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-[#807566] hover:text-[#1f1b15] p-1"
                  aria-label="Clear Search"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    close
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Course Catalogue Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-10 pt-8 sm:pt-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3 sm:gap-4">
          <div>
            <span className="text-[11px] font-bold text-[#a27b34] tracking-widest uppercase block mb-1">
              ACADEMIC CATALOGUE
            </span>
            <h2 className="text-2xl sm:text-4xl text-[#1f1b15] font-serif font-semibold">
              All Courses
            </h2>
            <p className="text-xs sm:text-sm text-[#4e4435] mt-1">
              Explore comprehensive syllabi taught by qualified Islamic scholars
              and educators.
            </p>
          </div>
          <div className="shrink-0 self-start sm:self-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#f5eedb] border border-[#d9cdb8] text-xs font-semibold text-[#785610]">
              <span className="material-symbols-outlined text-[16px] text-[#a27b34]">
                school
              </span>
              {isLoading ? "Loading..." : `${filteredCourses.length} Courses Available`}
            </span>
          </div>
        </div>

        {/* 3-Column Course Card Grid with Loading & Empty States */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#e5dcc7] p-6 shadow-xs animate-pulse h-96 flex flex-col justify-between"
              >
                <div className="w-full h-44 bg-[#f5eedb]/60 rounded-xl mb-4" />
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-[#f5eedb]/80 rounded w-1/3" />
                  <div className="h-6 bg-[#f5eedb]/80 rounded w-3/4" />
                  <div className="h-3 bg-[#f5eedb]/50 rounded w-full" />
                  <div className="h-3 bg-[#f5eedb]/50 rounded w-5/6" />
                </div>
                <div className="h-10 bg-[#f5eedb]/80 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : searchQuery.trim() ? (
          <div className="bg-white rounded-2xl border border-[#e5dcc7] p-12 text-center my-8 shadow-xs">
            <span className="material-symbols-outlined text-4xl text-[#8c6828] mb-3">
              search_off
            </span>
            <h3 className="text-xl font-serif font-semibold text-[#1f1b15]">
              No courses found
            </h3>
            <p className="text-sm text-[#4e4435] mt-1 max-w-md mx-auto">
              No matching courses found for &quot;{searchQuery}&quot;. Try searching
              with a different keyword or clear your search query.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-5 px-5 py-2.5 rounded-xl bg-[#785610] text-white text-xs font-semibold hover:bg-[#946e28] transition-all"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#e5dcc7] p-12 text-center my-8 shadow-xs max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#f5eedb] text-[#785610] flex items-center justify-center border border-[#d9cdb8] mx-auto mb-4">
              <span className="material-symbols-outlined text-[28px]">
                auto_stories
              </span>
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#1f1b15]">
              No Courses Published Yet
            </h3>
            <p className="text-sm text-[#4e4435] mt-2 leading-relaxed">
              Academic programs and courses published in the administration portal will appear here in real-time. Please check back soon or contact the admissions helpline.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-[#785610] text-white text-xs font-semibold hover:bg-[#946e28] transition-all"
              >
                Contact Admissions Office
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  // Format tuition display cleanly
  const rawFee = course.monthlyFee?.trim() || "";
  const isSubsidy =
    !rawFee ||
    rawFee.toLowerCase().includes("merit subsidy") ||
    rawFee.toLowerCase() === "free";

  let displayFee = "Merit Subsidy Available";
  let showMonthly = false;

  if (!isSubsidy) {
    const isPureDigits = /^\d+(\.\d+)?$/.test(rawFee);
    if (isPureDigits) {
      displayFee = `₹${rawFee}`;
      showMonthly = true;
    } else {
      displayFee = rawFee.replace(/\s*\/(mo|month)$/i, "");
      showMonthly = true;
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e5dcc7] shadow-sm hover:shadow-md hover:border-[#b48a3c]/60 transition-all duration-300 overflow-hidden flex flex-col h-full group">
      {/* Top Banner Image */}
      <div className="relative w-full h-44 overflow-hidden bg-[#2a2113] shrink-0">
        <Image
          alt={course.imageAlt}
          src={course.imageSrc}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={Boolean(
            course.imageSrc?.startsWith("data:") ||
              course.imageSrc?.startsWith("http")
          )}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 flex flex-col justify-between p-4 pointer-events-none">
          {/* Top Tags */}
          <div className="flex flex-wrap gap-1.5 justify-between items-start pointer-events-auto">
            <div className="flex flex-wrap gap-1.5">
              {course.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full backdrop-blur-sm ${
                    tag.includes("PINNED")
                      ? "bg-[#d4af37] text-[#1f1b15]"
                      : "bg-[#251d12]/90 text-[#ffdcc3] border border-[#b48a3c]/40"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {/* Title Overlay */}
          <div className="text-white">
            <h4 className="font-serif font-bold text-lg leading-tight drop-shadow-sm">
              {course.title}
            </h4>
            <p className="text-[11px] text-[#ffdeaa] tracking-wide mt-0.5">
              {course.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div className="flex-1 flex flex-col">
          <div className="text-[#a27b34] font-semibold text-xs tracking-wider uppercase mb-2">
            {course.categoryTag}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#1f1b15] font-serif mb-2.5 sm:mb-3 tracking-tight">
            {course.title}
          </h3>
          <p className="text-[#4e4435] text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 flex-1">
            {course.description}
          </p>
        </div>

        <div>
          <div className="border-t border-dashed border-[#d9cdb8] my-4" />
          <div className="flex items-center justify-between py-1">
            <div>
              <span className="block text-[11px] font-semibold text-[#807566] tracking-wider uppercase">
                SUBJECTS
              </span>
              <span className="text-sm font-semibold text-[#1f1b15] mt-0.5 block">
                {course.subjectsCount}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-semibold text-[#807566] tracking-wider uppercase">
                TUITION
              </span>
              <span className="text-sm font-bold text-[#785610] font-serif mt-0.5 block">
                {displayFee}{" "}
                {showMonthly && (
                  <span className="text-xs font-normal text-[#807566] font-sans">
                    /mo
                  </span>
                )}
              </span>
            </div>
          </div>
          <div className="border-t border-dashed border-[#d9cdb8] my-4" />

          {/* Action Button: Wide, responsive Enroll Now */}
          <div className="pt-1">
            <Link
              className="w-full bg-[#1f1b15] hover:bg-[#785610] active:scale-[0.99] text-white font-semibold py-3 px-5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-200"
              href={`/admission?course=${encodeURIComponent(course.title)}`}
            >
              <span>Enroll Now</span>
              <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
