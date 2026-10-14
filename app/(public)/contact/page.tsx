import React from "react";
import Link from "next/link";

export default function ContactPage() {
  const contactCards = [
    {
      id: "whatsapp-channel",
      icon: "campaign",
      topRightTag: "OFFICIAL BROADCAST",
      categoryTag: "WHATSAPP · COMMUNITY CHANNEL",
      title: "WhatsApp Channel Group",
      description:
        "Join our official WhatsApp channel for timely announcements, admission alerts, class circulars, and sacred reminders.",
      actionLabel: "Join WhatsApp Channel",
      actionHref: "https://whatsapp.com/channel/0029Vb95CnC1CYoNGRnVQv2Y",
      actionIcon: "open_in_new",
      isExternal: true,
    },
    {
      id: "email",
      icon: "mail",
      topRightTag: "OFFICIAL INBOX",
      categoryTag: "EMAIL · REGISTRY",
      title: "aljamiatulbukhari@gmail.com",
      description:
        "For formal applications, document verification, verification of sanad, and written queries.",
      actionLabel: "Send An Email",
      actionHref: "mailto:aljamiatulbukhari@gmail.com",
      actionIcon: "arrow_forward",
      isExternal: false,
    },
    {
      id: "whatsapp",
      icon: "forum",
      topRightTag: "WHATSAPP HELPLINE",
      categoryTag: "WHATSAPP · DIRECT CHAT",
      title: "+91 7505611253",
      description: 
        "Instant WhatsApp support for admission inquiries, batch schedules, fees assistance, and academic notices.",
      actionLabel: "Chat on WhatsApp",
      actionHref: "https://wa.me/917505611253?text=Assalamu%20Alaikum%20Al%20Jamia%20Tul%20Bukhari%20Academy%2C%20I%20would%20like%20to%20inquire%20about%20admissions%20and%20courses.",
      actionIcon: "open_in_new",
      isExternal: true,
    },
    {
      id: "instagram",
      icon: "photo_camera",
      topRightTag: "SOCIAL HUB",
      categoryTag: "INSTAGRAM · COMMUNITY",
      title: "@aljamiatulbukhari_official",
      description:
        "Follow academy life, sacred recitations, lectures by renowned scholars, and annual graduation highlights.",
      actionLabel: "View Instagram Profile",
      actionHref: "https://instagram.com/aljamiatulbukhari_official",
      actionIcon: "open_in_new",
      isExternal: true,
    },
    {
      id: "address",
      icon: "location_on",
      topRightTag: "AGRA CAMPUS",
      categoryTag: "ACADEMY CAMPUS ADDRESS",
      title: "Shahganj, Agra",
      subtitle: "Uttar Pradesh, India",
      description:
        "Visitors and guardian delegations are welcome during academic office hours by prior appointment.",
      actionLabel: "Open in Google Maps",
      actionHref: "https://maps.google.com/?q=Shahganj+Agra+Uttar+Pradesh",
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
    <div className="w-full bg-[#fcf9f2] min-h-screen py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-10">
        {/* 1. Header Banner */}
        <section className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-serif text-[#1f1b15] font-bold tracking-tight leading-tight">
            We’re Ready to Assist.
          </h1>

          <p className="text-xs sm:text-base text-[#4e4435] mt-2.5 sm:mt-3 leading-relaxed">
            For admissions, course information and general enquiries, contact the academy using the official verified channels below.
          </p>

          <div className="mt-5 sm:mt-6 inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#f5eedb]/80 border border-[#d9cdb8] text-xs text-[#785610] font-medium">
            <span className="material-symbols-outlined text-[16px] text-[#a27b34]">
              schedule
            </span>
            <span>Office Hours: Mon – Sat, 9:00 AM – 5:00 PM IST</span>
          </div>
        </section>

        {/* 2. Six Contact Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12 sm:mb-16">
          {contactCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-[#e5dcc7] p-5 sm:p-7 flex flex-col justify-between hover:border-[#b48a3c]/60 hover:shadow-xs transition-all duration-200 overflow-hidden"
            >
              <div>
                {/* Top Row: Icon & Top Right Tag */}
                <div className="flex items-center justify-between mb-4 sm:mb-5 gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#f5eedb] text-[#785610] flex items-center justify-center border border-[#d9cdb8] shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      {card.icon}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#807566] tracking-wider uppercase text-right">
                    {card.topRightTag}
                  </span>
                </div>

                {/* Category Tag */}
                <div className="text-[11px] font-bold text-[#a27b34] tracking-wider uppercase mb-1.5">
                  {card.categoryTag}
                </div>

                {/* Title & Subtitle */}
                <h3
                  className={`font-serif font-bold text-[#1f1b15] tracking-tight break-all sm:break-words [overflow-wrap:anywhere] ${
                    card.id === "email"
                      ? "text-base sm:text-[17px] lg:text-lg"
                      : "text-lg sm:text-xl"
                  }`}
                >
                  {card.actionHref ? (
                    <a
                      href={card.actionHref}
                      target={card.isExternal ? "_blank" : undefined}
                      rel={card.isExternal ? "noopener noreferrer" : undefined}
                      className="hover:text-[#785610] transition-colors"
                    >
                      {card.title}
                    </a>
                  ) : (
                    card.title
                  )}
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
        <section className="rounded-2xl bg-gradient-to-r from-[#fbf7ee] via-[#f7f0df] to-[#f5eedb] border border-[#d9cdb8] p-6 sm:p-12 text-center max-w-4xl mx-auto shadow-xs">
          <p className="text-lg sm:text-2xl font-serif italic text-[#1f1b15] leading-relaxed">
            “Whoever travels a path in search of knowledge, Allah makes easy for him a path to Paradise.”
          </p>
          <span className="inline-block mt-2.5 sm:mt-3 text-xs uppercase tracking-widest text-[#8c6828] font-bold">
            — SAHIH AL-BUKHARI
          </span>
        </section>
      </div>
    </div>
  );
}
