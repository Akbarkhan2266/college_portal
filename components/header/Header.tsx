"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import TopBar from "./TopBar";
import { getLiveIslamicInfo, IslamicLiveInfo } from "@/lib/islamic-time";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [islamicInfo, setIslamicInfo] = useState<IslamicLiveInfo | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const update = () => {
      setIslamicInfo(getLiveIslamicInfo(new Date()));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Admission", href: "/admission" },
    { name: "Careers", href: "/careers" },
    { name: "Notices", href: "/notices" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#fffdf8]/95 backdrop-blur-md border-b border-[#e5dcc7] shadow-sm">
      <TopBar />
      <div className="w-full px-4 sm:px-10 py-2">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          {/* Logo */}
          <Link className="flex items-center gap-3" href="/">
            <div className="relative h-14 sm:h-20 w-44 sm:w-64 flex items-center">
              <Image
                alt="Al Jamia Tul Bukhari Academy"
                src="/images/logo.png"
                fill
                sizes="(max-width: 640px) 176px, 256px"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                mounted &&
                (pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href)));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm transition-colors py-2 ${
                    isActive
                      ? "text-[#785610] font-bold border-b-2 border-[#b48a3c]"
                      : "text-[#4e4435] hover:text-[#785610]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right CTA Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#785610] text-white text-sm font-semibold hover:bg-[#946e28] transition-all border border-[#b48a3c] shadow-sm"
              href="/admission"
            >
              Apply for 2026
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#4e4435] hover:text-[#785610] hover:bg-[#f5eedb]/60 transition-colors"
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined text-[26px]">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-[#e5dcc7] pt-3 pb-5 space-y-3 mt-2 max-h-[calc(100vh-110px)] overflow-y-auto">
            {/* Primary Nav Links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive =
                  mounted &&
                  (pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href)));

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3.5 py-2.5 text-sm rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-[#f5eedb] text-[#785610] font-bold border-l-4 border-[#785610]"
                        : "text-[#4e4435] hover:bg-[#fbf7ee]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile CTA Apply Button */}
            <div className="pt-1">
              <Link
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#785610] text-white text-sm font-semibold hover:bg-[#946e28] transition-all shadow-sm"
                href="/admission"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Apply for 2026 Admissions</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </Link>
            </div>

            {/* Shifted TopBar Content Section */}
            <div className="pt-3 border-t border-[#e5dcc7] space-y-2.5">
              {/* Islamic Timing Badge Card */}
              {islamicInfo && (
                <div className="p-3 rounded-xl bg-[#2a2113] text-[#fffdf8] text-xs space-y-1.5 border border-[#473820]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[#eebf71] font-semibold">
                      <span className="material-symbols-outlined text-[15px]">
                        schedule
                      </span>
                      {islamicInfo.liveTime}
                    </span>
                    <span className="text-[#ffdcc3] font-medium text-[11px]">
                      {islamicInfo.prayerDisplayText}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#e5dcc7] border-t border-[#473820] pt-1.5 flex items-center justify-between">
                    <span className="text-[#dfd5ba]">Islamic Calendar:</span>
                    <span className="text-[#ffdeaa] font-medium">
                      {islamicInfo.hijriDate}
                    </span>
                  </div>
                </div>
              )}

              {/* Location & Direct Admissions Call */}
              <div className="p-3 rounded-xl bg-[#f5eedb]/70 border border-[#d9cdb8] text-xs text-[#4e4435] space-y-2">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#785610] shrink-0 mt-0.5">
                    location_on
                  </span>
                  <span className="text-[11px] leading-tight text-[#4e4435]">
                    Campus: Shahganj, Agra, Uttar Pradesh, India
                  </span>
                </div>
                <a
                  href="tel:+917505611253"
                  className="flex items-center gap-2 text-[11px] font-semibold text-[#785610] hover:text-[#946e28] pt-1 border-t border-[#d9cdb8]/60"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#785610]">
                    call
                  </span>
                  <span>Admissions / WhatsApp: +91 7505611253</span>
                </a>
              </div>

              {/* Portal Links (Student & Admin) */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/student"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#ffffff] border border-[#d9cdb8] text-xs font-semibold text-[#785610] hover:bg-[#f5eedb] transition-colors shadow-xs"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    school
                  </span>
                  Student Portal
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#ffffff] border border-[#d9cdb8] text-xs font-semibold text-[#785610] hover:bg-[#f5eedb] transition-colors shadow-xs"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    admin_panel_settings
                  </span>
                  Admin Portal
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
