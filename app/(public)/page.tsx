import React from "react";
import HeroSection from "@/components/hero/HeroSection";
import AcademicPathways from "@/components/courses/AcademicPathways";
import CampusLifeSection from "@/components/campus-life/CampusLifeSection";
import AdmissionsSection from "@/components/admissions/AdmissionsSection";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <AcademicPathways />
      <CampusLifeSection />
      <AdmissionsSection />
    </div>
  );
}
