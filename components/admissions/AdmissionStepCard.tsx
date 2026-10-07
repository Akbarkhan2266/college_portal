import React from "react";

export interface AdmissionStepCardProps {
  stepNumber: string;
  title: string;
  description: string;
  badgeIcon: string;
  badgeLabel: string;
}

export default function AdmissionStepCard({
  stepNumber,
  title,
  description,
  badgeIcon,
  badgeLabel,
}: AdmissionStepCardProps) {
  return (
    <div className="bg-[#ffffff]/5 border border-[#b48a3c]/30 hover:border-[#b48a3c]/60 backdrop-blur-md p-6 rounded-xl flex flex-col justify-between transition-all">
      <div className="space-y-3">
        <span className="font-serif text-2xl text-[#eebf71] font-bold block">
          {stepNumber}
        </span>
        <h4 className="font-serif text-base text-[#fffdf8] font-semibold">
          {title}
        </h4>
        <p className="text-xs text-[#dfd5ba] leading-relaxed">{description}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-[#b48a3c]/20 text-[#ffdcc3] text-xs flex items-center gap-1.5 font-medium">
        <span className="material-symbols-outlined text-[16px] text-[#eebf71]">
          {badgeIcon}
        </span>
        {badgeLabel}
      </div>
    </div>
  );
}
