import React from "react";
import Link from "next/link";

export default function TopBar() {
  return (
    <div className="w-full bg-[#2a2113] text-[#fffdf8] py-2 px-6 sm:px-10 hidden md:block border-b border-[#473820]">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs tracking-wide">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-[#e5dcc7]">
            <span className="material-symbols-outlined text-[14px] text-[#eebf71]">
              location_on
            </span>
            Shahganj, Agra, India
          </span>
          <span className="flex items-center gap-1.5 text-[#e5dcc7]">
            <span className="material-symbols-outlined text-[14px] text-[#eebf71]">
              call
            </span>
            Admissions: +91 9917802153
          </span>
          <span className="flex items-center gap-1.5 text-[#ffdeaa] font-semibold">
            <span className="material-symbols-outlined text-[14px]">
              schedule
            </span>
            Dhuhur 12:45 PM | 14 Shawwal 1447 AH
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs tracking-wide text-[#e5dcc7]">
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
