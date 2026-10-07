import React from "react";
import Link from "next/link";

export default function HadithRibbon() {
  return (
    <div className="mt-14 p-8 rounded-xl bg-gradient-to-r from-[#fbf7ee] to-[#f5eedb] border border-[#d9cdb8] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#785610] text-[#ffdeaa] flex items-center justify-center shrink-0 border border-[#b48a3c]">
          <span className="material-symbols-outlined text-[24px]">
            format_quote
          </span>
        </div>
        <div>
          <p className="text-xl sm:text-2xl text-[#1f1b15] font-serif italic">
            “Seeking knowledge is an obligation upon every Muslim.”
          </p>
          <p className="text-xs text-[#8c6828] font-bold tracking-widest uppercase mt-1">
            — Sunan Ibn Majah (Hadith 224)
          </p>
        </div>
      </div>
      <Link
        className="shrink-0 px-5 py-2.5 rounded-lg bg-[#785610] text-white hover:bg-[#946e28] text-xs font-semibold transition-all shadow-sm border border-[#b48a3c]"
        href="#campus-life"
      >
        Explore Student Life Guide →
      </Link>
    </div>
  );
}
