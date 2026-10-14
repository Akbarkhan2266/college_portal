import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface CourseCardProps {
  title: string;
  subtitle: string;
  categoryTag: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  subjectsCount: string;
  monthlyFee: string;
  pinned?: boolean;
}

export default function CourseCard({
  title,
  subtitle,
  categoryTag,
  description,
  imageSrc,
  imageAlt,
  subjectsCount,
  monthlyFee,
  pinned = true,
}: CourseCardProps) {
  // Format tuition display cleanly
  const rawFee = monthlyFee?.trim() || "";
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
    <div className="bg-[#ffffff] rounded-2xl border border-[#e5dcc7] shadow-sm hover:shadow-md hover:border-[#b48a3c]/60 transition-all duration-300 overflow-hidden flex flex-col h-full group">
      {/* Top Banner */}
      <div className="relative w-full h-44 overflow-hidden rounded-t-xl bg-[#f5eedb] shrink-0">
        <Image
          alt={imageAlt}
          src={imageSrc}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={Boolean(
            imageSrc?.startsWith("data:") || imageSrc?.startsWith("http")
          )}
          className="object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 flex flex-col justify-between p-4 pointer-events-none">
          <div className="flex justify-end">
            {pinned && (
              <span className="inline-flex items-center gap-1 bg-[#d4af37] text-[#1f1b15] text-xs font-bold px-3 py-1 rounded-full shadow-sm pointer-events-auto">
                <span>★</span> PINNED
              </span>
            )}
          </div>
          <div className="text-white">
            <h4 className="font-serif font-bold text-lg leading-tight drop-shadow-sm">
              {title}
            </h4>
            <p className="text-[11px] text-[#ffdeaa] tracking-wide mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div className="flex-1 flex flex-col">
          <div className="text-[#a27b34] font-semibold text-xs tracking-wider uppercase mb-2">
            {categoryTag}
          </div>
          <h3 className="text-2xl font-bold text-[#1f1b15] font-serif mb-3 tracking-tight">
            {title}
          </h3>
          <p className="text-[#4e4435] text-sm leading-relaxed mb-5 flex-1">
            {description}
          </p>
        </div>

        <div>
          <div className="border-t border-dashed border-[#d9cdb8] my-4" />
          <div className="flex items-center justify-between py-1">
            <div>
              <span className="block text-xs font-semibold text-[#807566] tracking-wider uppercase">
                SUBJECTS
              </span>
              <span className="text-sm font-semibold text-[#1f1b15] mt-0.5 block">
                {subjectsCount}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-[#807566] tracking-wider uppercase">
                MONTHLY FEES
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
              href={`/admission?course=${encodeURIComponent(title)}`}
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
