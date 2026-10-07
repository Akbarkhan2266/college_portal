import React from "react";
import Link from "next/link";

export default function ContactPage() {
  const contactCards = [
    {
      id: "phone",
      icon: "call",
      topRightTag: "DIRECT DESK",
      categoryTag: "PHONE · ADMISSIONS",
      title: "+91 9214210310",
      description:
        "Direct line for admission guidance, academic counselling, and student administrative support.",
      actionLabel: "Dial Academy Office",
      actionHref: "tel:+919214210310",
      actionIcon: "arrow_forward",
      isExternal: false,
    },
    {
      id: "email",
      icon: "mail",
      topRightTag: "OFFICIAL INBOX",
      categoryTag: "EMAIL · REGISTRY",
      title: "alzeyaacademy@gmail.com",
      description:
        "For formal applications, document verification, verification of sanad, and written queries.",
      actionLabel: "Send An Email",
      actionHref: "mailto:alzeyaacademy@gmail.com",
      actionIcon: "arrow_forward",
      isExternal: false,
    },
    {
      id: "whatsapp",
      icon: "forum",
      topRightTag: "BROADCAST",
      categoryTag: "WHATSAPP · LIVE FEED",
      title: "Announcements & News",
      description:
        "Receive instant updates on admission cycles, exam timetables, new class batches, and official holidays.",
      actionLabel: "Join our WhatsApp Channel",
      actionHref: "https://whatsapp.com/channel",
      actionIcon: "open_in_new",
      isExternal: true,
    },
    {
      id: "instagram",
      icon: "photo_camera",
      topRightTag: "SOCIAL HUB",
      categoryTag: "INSTAGRAM · COMMUNITY",
      title: "@alzeyaacademy",
      description:
        "Follow academy life, sacred recitations, lectures by renowned scholars, and annual graduation highlights.",
      actionLabel: "View Instagram Profile",
      actionHref: "https://instagram.com/alzeyaacademy",
      actionIcon: "open_in_new",
      isExternal: true,
    },
    {
      id: "address",
      icon: "location_on",
      topRightTag: "GORAKHPUR CAMPUS",
      categoryTag: "ACADEMY CAMPUS ADDRESS",
      title: "Bargadhi, Gorakhpur",
      subtitle: "Uttar Pradesh, India – 273001",
      description:
        "Visitors and guardian delegations are welcome during academic office hours by prior appointment.",
      actionLabel: "Open in Google Maps",
      actionHref: "https://maps.google.com/?q=Bargadhi+Gorakhpur+Uttar+Pradesh",
      actionIcon: "near_me",
      isExternal: true,
    },
    {
      id: "prompt-assistance",
      icon: "verified_user",
      topRightTag: "ADMISSIONS DESK",
      categoryTag: "PROMPT ASSISTANCE",
      title: "Visit & Helpline Guidance",
      description:
        "Families and aspiring students are welcome to connect directly via telephone or WhatsApp for expedited admission interviews, syllabus clarification, and hostel accommodations.",
      statusText: "Dedicated response within 24 hours",
    },
  ];

  return (
    <div className="w-full bg-[#fcf9f2] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* 1. Header Banner */}
        <section className="text-center max-w-3xl mx-auto mb-14">
          {/* <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f5eedb] border border-[#d9cdb8] text-[#785610] text-[11px] font-bold uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a27b34]" />
            <span>CONTACT US</span>
          </div> */}

          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif text-[#1f1b15] font-bold tracking-tight leading-tight">
            We’re Ready to Assist.
          </h1>

          <p className="text-sm sm:text-base text-[#4e4435] mt-3 leading-relaxed">
            For admissions, course information and general enquiries, contact the academy using the official verified channels below.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f5eedb]/80 border border-[#d9cdb8] text-xs text-[#785610] font-medium">
            <span className="material-symbols-outlined text-[16px] text-[#a27b34]">
              schedule
            </span>
            <span>Office Hours: Mon – Sat, 9:00 AM – 5:00 PM IST</span>
          </div>
        </section>

        {/* 2. Six Contact Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {contactCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-[#e5dcc7] p-7 flex flex-col justify-between hover:border-[#b48a3c]/60 hover:shadow-xs transition-all duration-200"
            >
              <div>
                {/* Top Row: Icon & Top Right Tag */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#f5eedb] text-[#785610] flex items-center justify-center border border-[#d9cdb8]">
                    <span className="material-symbols-outlined text-[20px]">
                      {card.icon}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#807566] tracking-wider uppercase">
                    {card.topRightTag}
                  </span>
                </div>

                {/* Category Tag */}
                <div className="text-[11px] font-bold text-[#a27b34] tracking-wider uppercase mb-1.5">
                  {card.categoryTag}
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1f1b15] tracking-tight">
                  {card.title}
                </h3>
                {card.subtitle && (
                  <p className="text-xs text-[#807566] mt-0.5 font-medium">
                    {card.subtitle}
                  </p>
                )}

                {/* Description */}
                <p className="text-xs text-[#4e4435] leading-relaxed mt-3">
                  {card.description}
                </p>
              </div>

              {/* Action Button or Status Row */}
              <div className="pt-6 mt-4 border-t border-[#f5eedb]">
                {card.actionLabel ? (
                  <a
                    href={card.actionHref}
                    target={card.isExternal ? "_blank" : undefined}
                    rel={card.isExternal ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1f1b15] hover:text-[#785610] transition-colors group"
                  >
                    <span>{card.actionLabel}</span>
                    <span className="material-symbols-outlined text-[15px] text-[#785610] group-hover:translate-x-0.5 transition-transform">
                      {card.actionIcon}
                    </span>
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-[11px] text-[#807566] font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#a27b34]" />
                    <span>{card.statusText}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* 3. Sacred Quote Banner Ribbon */}
        <section className="rounded-2xl bg-gradient-to-r from-[#fbf7ee] via-[#f7f0df] to-[#f5eedb] border border-[#d9cdb8] p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-xs">
          <p className="text-xl sm:text-2xl font-serif italic text-[#1f1b15] leading-relaxed">
            “Whoever travels a path in search of knowledge, Allah makes easy for him a path to Paradise.”
          </p>
          <span className="inline-block mt-3 text-xs uppercase tracking-widest text-[#8c6828] font-bold">
            — SAHIH AL-BUKHARI
          </span>
        </section>
      </div>
    </div>
  );
}
