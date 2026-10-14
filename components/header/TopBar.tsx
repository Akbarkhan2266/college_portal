"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getLiveIslamicInfo, IslamicLiveInfo } from "@/lib/islamic-time";

export default function TopBar() {
  const [islamicInfo, setIslamicInfo] = useState<IslamicLiveInfo | null>(null);

  useEffect(() => {
    const update = () => {
      setIslamicInfo(getLiveIslamicInfo(new Date()));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#2a2113] text-[#fffdf8] py-1.5 px-4 sm:px-10 border-b border-[#473820]">
      {/* Mobile Compact Bar (< md) */}
      <div className="flex md:hidden items-center justify-between text-[11px] tracking-normal">
        <div className="flex items-center gap-1.5 text-[#ffdeaa] min-w-0">
          <span className="material-symbols-outlined text-[13px] text-[#eebf71] shrink-0">
            schedule
          </span>
          <span className="tabular-nums font-mono tracking-tight text-[#fffdf8] font-medium shrink-0">
            {islamicInfo?.liveTime || "Live Time"}
          </span>
          <span className="opacity-40">•</span>
          <span className="text-[#ffdcc3] truncate font-medium">
            {islamicInfo?.prayerDisplayText || "Live Waqt"}
          </span>
        </div>
        <a
          href="tel:+917505611253"
          className="flex items-center gap-1 text-[#e5dcc7] hover:text-[#ffdcc3] transition-colors shrink-0 text-[11px] font-medium pl-2"
          title="Call or WhatsApp Admissions Helpline"
        >
          <span className="material-symbols-outlined text-[13px] text-[#eebf71]">
            call
          </span>
          <span>+91 7505611253</span>
        </a>
      </div>

      {/* Desktop Full Bar (>= md) */}
      <div className="hidden md:flex max-w-7xl mx-auto items-center justify-between text-[11px] tracking-normal">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5 text-[#e5dcc7]">
            <span className="material-symbols-outlined text-[13px] text-[#eebf71]">
              location_on
            </span>
            Shahganj, Agra, India
          </span>
          <a
            href="tel:+917505611253"
            className="flex items-center gap-1.5 text-[#e5dcc7] hover:text-[#ffdcc3] transition-colors"
          >
            <span className="material-symbols-outlined text-[13px] text-[#eebf71]">
              call
            </span>
            Admissions / WhatsApp: +91 7505611253
          </a>
          <span className="flex items-center gap-1.5 text-[#ffdeaa]">
            <span className="material-symbols-outlined text-[13px]">
              schedule
            </span>
            <span className="tabular-nums font-mono tracking-tight text-[#fffdf8] font-medium">
              {islamicInfo?.liveTime || "Live Time"}
            </span>
            <span className="opacity-40">•</span>
            <span className="text-[#ffdcc3]">
              {islamicInfo?.prayerDisplayText || "Live Namaz Waqt"}
            </span>
            <span className="opacity-40">|</span>
            <span className="text-[#eebf71]">
              {islamicInfo?.hijriDate || "Hijri Date"}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-3.5 text-[11px] tracking-normal text-[#e5dcc7]">
          <Link
            className="hover:text-[#ffdcc3] transition-colors"
            href="/student"
          >
            Student Portal
          </Link>
          <span className="opacity-40 text-[#c2b498]">•</span>
          <Link
            className="hover:text-[#ffdcc3] transition-colors"
            href="/admin"
          >
            Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
