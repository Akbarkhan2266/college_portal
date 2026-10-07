import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#251d12] via-[#2c2214] to-[#1e170e] text-[#fffdf8] overflow-hidden border-b border-[#8c6828]/30">
      {/* Subtle ambient glow highlights in gold & amber */}
      <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-[#b48a3c]/15 filter blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-0 w-96 h-96 rounded-full bg-[#eebf71]/15 filter blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 pt-12 pb-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f5eedb]/10 border border-[#b48a3c]/40 text-[#ffdcc3] text-xs font-semibold tracking-wide">
             
              Admission Open 2026–27 • Deeni Taleem &amp; Contemporary Degrees
            </div>

            <div className="space-y-3 pt-1">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#fffdf8] tracking-tight leading-[1.15]">
                Where Faith Meets <br className="hidden sm:inline" />
                <span className="text-[#eebf71]">the Future.</span>
              </h1>
              <p
                className="font-arabic text-xl sm:text-5xl text-[#ffdcc3] font-medium pt-1"
                dir="rtl"
              >
                دین اور جدید علوم کی معتبر جامعہ
              </p>
            </div>

            <p className="text-base sm:text-lg text-[#ebe3cc] max-w-xl leading-relaxed">
              Empowering the next generation of thinkers with divine wisdom and
              world-class education.{" "}
              <span className="text-[#ffdeaa] font-medium">
                Apne mustaqbil ki bunyad aaj rakhein.
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3 w-full sm:w-auto">
              <Link
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#b48a3c] text-[#1f1b15] text-sm font-bold hover:bg-[#d4af37] transition-all shadow-md group"
                href="#courses"
              >
                <span>Explore Academic Programs</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
              <a
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-[#ffffff]/10 hover:bg-[#ffffff]/15 text-[#fffdf8] text-sm font-medium border border-[#b48a3c]/40 backdrop-blur-sm transition-all"
                href="#prospectus"
              >
                <span className="material-symbols-outlined text-[18px] text-[#eebf71]">
                  download
                </span>
                <span>Prospectus 2026 (PDF)</span>
              </a>
            </div>

            {/* Announcement Banner */}
            {/* <div className="w-full mt-4 p-4 rounded-xl bg-[#f5eedb]/10 border border-[#b48a3c]/30 backdrop-blur-sm flex items-center gap-3 text-xs sm:text-sm text-[#ebe3cc]">
              <span className="material-symbols-outlined text-[#eebf71] text-[20px] shrink-0">
                event_available
              </span>
              <p>
                <strong className="text-[#fffdf8]">Autumn 2026 Intake:</strong>{" "}
                Merit &amp; Zakat Scholarships Available •{" "}
                <span className="text-[#ffdcc3] font-medium">
                  Last Date: 30 June 2026
                </span>
              </p>
            </div> */}
          </div>

          {/* Right Hero Image Column */}
          <div className="lg:col-span-5 relative flex flex-col items-center pt-4 lg:pt-0">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-[#b48a3c]/40 shadow-2xl bg-[#3a2c16]">
              <Image
                alt="A group of young Muslim female college students studying together in a modern university library"
                src="/images/hero-library.jpg"
                fill
                className="object-cover brightness-95 contrast-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#251d12]/95 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-lg bg-[#251d12]/90 backdrop-blur-md border border-[#b48a3c]/30 text-[#fcf9f2] flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#eebf71] font-bold block">
                    Student Life &amp; Research
                  </span>
                  <span className="font-serif text-base text-[#fffdf8]">
                    Academic Library &amp; Learning Commons
                  </span>
                </div>
                <div className="w-9 h-9 rounded-lg bg-[#b48a3c]/20 border border-[#b48a3c]/50 text-[#eebf71] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">
                    verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid Footer */}
        <div className="mt-14 pt-8 border-t border-[#b48a3c]/20 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2 text-[#eebf71]">
              <span className="material-symbols-outlined text-[20px]">
                verified
              </span>
              <span className="font-serif text-2xl font-bold">100%</span>
            </div>
            <p className="text-xs font-semibold text-[#fffdf8]">Halal Campus</p>
            <p className="text-[11px] text-[#dfd5ba]">
              Dedicated Prayer Halls &amp; Facilities
            </p>
          </div>

          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2 text-[#eebf71]">
              <span className="material-symbols-outlined text-[20px]">
                menu_book
              </span>
              <span className="font-serif text-2xl font-bold">18+</span>
            </div>
            <p className="text-xs font-semibold text-[#fffdf8]">
              Academic Programs
            </p>
            <p className="text-[11px] text-[#dfd5ba]">
              Traditional &amp; Modern Disciplines
            </p>
          </div>

          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2 text-[#eebf71]">
              <span className="material-symbols-outlined text-[20px]">
                public
              </span>
              <span className="font-serif text-2xl font-bold">12k+</span>
            </div>
            <p className="text-xs font-semibold text-[#fffdf8]">Alumni Network</p>
            <p className="text-[11px] text-[#dfd5ba]">
              Global Alumni Community
            </p>
          </div>

          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2 text-[#eebf71]">
              <span className="material-symbols-outlined text-[20px]">
                workspace_premium
              </span>
              <span className="font-serif text-2xl font-bold">50+</span>
            </div>
            <p className="text-xs font-semibold text-[#fffdf8]">
              Islamic Research
            </p>
            <p className="text-[11px] text-[#dfd5ba]">
              Recognized Scholarly Publications
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
