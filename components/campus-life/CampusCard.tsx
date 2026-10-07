import React from "react";
import Image from "next/image";

export interface CampusCardProps {
  title: string;
  badge: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  bullets: string[];
}

export default function CampusCard({
  title,
  badge,
  description,
  imageSrc,
  imageAlt,
  bullets,
}: CampusCardProps) {
  return (
    <div className="bg-[#ffffff] rounded-xl overflow-hidden border border-[#e5dcc7] shadow-sm flex flex-col h-full group hover:shadow-md hover:border-[#b48a3c]/60 transition-all">
      <div className="relative h-56 w-full overflow-hidden bg-[#f5eedb] shrink-0">
        <Image
          alt={imageAlt}
          src={imageSrc}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-[#251d12]/90 text-[#ffdcc3] text-xs font-semibold px-3 py-1 rounded backdrop-blur-sm border border-[#b48a3c]/40">
          {badge}
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between bg-[#fffdf8]">
        <div className="space-y-3 flex-1">
          <h3 className="text-lg text-[#1f1b15] font-serif font-semibold">
            {title}
          </h3>
          <p className="text-xs text-[#4e4435] leading-relaxed">
            {description}
          </p>
        </div>
        <ul className="pt-4 space-y-2 text-xs text-[#4e4435] border-t border-[#e5dcc7] mt-4">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#785610] text-[16px]">
                check_circle
              </span>
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
