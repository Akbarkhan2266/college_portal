import React from "react";
import Link from "next/link";

export default function HadithRibbon() {
  return (
    <div className="mt-10 sm:mt-14 p-6 sm:p-8 rounded-xl bg-gradient-to-r from-[#fbf7ee] to-[#f5eedb] border border-[#d9cdb8] flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 shadow-sm">
      <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 w-full md:w-auto">
        <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-[#785610] text-[#ffdeaa] flex items-center justify-center shrink-0 border border-[#b48a3c]">
          <span className="material-symbols-outlined text-[20px] sm:text-[24px]">
            format_quote
          </span>
        </div>
        <div>
          <p className="text-base sm:text-2xl text-[#1f1b15] font-serif italic leading-snug">
            “Seeking knowledge is an obligation upon every Muslim.”
          </p>
          <p className="text-[11px] sm:text-xs text-[#8c6828] font-bold tracking-widest uppercase mt-1">
            — Sunan Ibn Majah (Hadith 224)
          </p>
        </div>
      </div>
      <Link
        className="w-full md:w-auto text-center shrink-0 px-5 py-2.5 rounded-lg bg-[#785610] text-white hover:bg-[#946e28] text-xs font-semibold transition-all shadow-sm border border-[#b48a3c]"
        href="#campus-life"
      >
        Explore Student Life Guide →
      </Link>
    </div>
  );
}
