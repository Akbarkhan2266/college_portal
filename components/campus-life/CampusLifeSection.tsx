import React from "react";
import CampusCard from "./CampusCard";
import HadithRibbon from "./HadithRibbon";

export default function CampusLifeSection() {
  const campusFeatures = [
    {
      title: "Central Grand Musalla & Spiritual Mentorship",
      badge: "5 Daily Prayers",
      description:
        "Daily 5 congregation prayers led by resident scholars, weekly Jummah Khutbah, Halaqat-ul-Quran circles, and individual pastoral care for brothers and sisters.",
      imageSrc: "/images/musalla.jpg",
      imageAlt:
        "Young Muslim female university students in elegant modest hijabs gathered in campus prayer hall and library reading Quran together",
      bullets: [
        "Tafseer & Hadith Circles Every Evening",
        "Resident Murabbi & Murabbiyah Counseling",
      ],
    },
    {
      title: "Certified Halal Dining & Wholesome Living",
      badge: "Tayyib Verified",
      description:
        "100% strictly verified Halal dining halls, separate modern residential dormitories with study commons, 24/7 security, and dedicated wellness facilities.",
      imageSrc: "/images/halal-dining.jpg",
      imageAlt:
        "Young Muslim female university students in modern hijabs enjoying a clean, bright halal dining cafeteria on campus",
      bullets: [
        "Nutritious Tayyib Farm-to-Table Menus",
        "Separate Residential Quarters for Male & Female",
      ],
    },
    {
      title: "Muslim Student Societies & Global Impact",
      badge: "26+ Clubs",
      description:
        "Active student unions, Islamic Relief student chapter, Da'wah & Debating Union, Women in STEM & Islamic Leadership forum, and intra-university sports leagues.",
      imageSrc: "/images/student-societies.jpg",
      imageAlt:
        "Young Muslim female university students in modern hijabs engaged in an academic debating society and global youth leadership seminar",
      bullets: [
        "Annual Youth Leadership Summit & Model OIC",
        "Community Outreach & Relief Volunteering",
      ],
    },
  ];

  return (
    <section id="campus-life" className="w-full bg-[#fcf9f2] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f5eedb] border border-[#d9cdb8] text-[#785610] text-xs uppercase tracking-widest font-bold mb-3 shadow-xs">
            <span className="material-symbols-outlined text-[16px]">mosque</span>
            Spiritual &amp; Holistic Student Life
          </div>
          <h2 className="text-3xl sm:text-4xl text-[#1f1b15] font-serif font-semibold">
            Campus Life Cultivated on Sunnah &amp; Community
          </h2>
          <p className="text-base text-[#4e4435] mt-3">
            A sanctuary that supports your deen, your wellbeing, and your
            academic pursuits.
          </p>
        </div>

        {/* 3-Feature Editorial Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {campusFeatures.map((feature, idx) => (
            <CampusCard key={idx} {...feature} />
          ))}
        </div>

        {/* Sacred Hadith Quote Ribbon */}
        <HadithRibbon />
      </div>
    </section>
  );
}
