import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#fbf7ee] px-6 sm:px-8 border-t border-[#e5dcc7] pt-16 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Top Quran Verse Banner */}
        <div className="bg-[#fffdf8] border border-[#d9cdb8] p-6 sm:p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm mb-14">
          <div className="flex flex-wrap items-center gap-3 text-[#1f1b15]">
            <span className="material-symbols-outlined text-[24px] text-[#a27b34]">
              menu_book
            </span>
            <span className="text-base italic font-serif">
              &quot;Rabbi Zidni Ilma&quot;
            </span>
            <span className="font-arabic text-sm text-[#4e4435] font-medium">
              (رَّبِّ زِدْنِي عِلْمًا — اے میرے رب، میرے علم میں اضافہ فرما)
            </span>
          </div>
        
        </div>

        {/* 4 Grid Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-14">
          {/* Col 1: Academy Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative h-16 w-52">
                <Image
                  alt="Al Jamia Tul Bukhari Academy"
                  src="/images/logo.png"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
            <p className="text-xs text-[#4e4435] leading-relaxed">
              An autonomous center for advanced classical Shariah studies, modern
              sciences, and ethical leadership. Deeni taleem aur jadeed tehqeeq ka
              sangam — fostering holistic scholars since 1984.
            </p>
            <div className="py-1.5 px-3 rounded bg-[#f5eedb] text-[#785610] text-xs font-semibold inline-block border border-[#d9cdb8]">
              علم، عمل اور اخلاق کا سنگم (Ilm, Amal aur Akhlaaq)
            </div>
            <div className="pt-2 text-[#4e4435] text-xs space-y-2">
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#8c6828]">
                  location_on
                </span>
                Campus: Shahganj, Agra, Uttar Pradesh, India
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#785610]">
                  call
                </span>
                Admissions: +91 9917802153
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-base text-[#1f1b15] font-serif font-bold mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3 text-xs text-[#4e4435]">
              <li>
                <Link className="hover:text-[#785610] transition-colors" href="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#785610] transition-colors" href="/courses">
                  Courses
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#785610] transition-colors" href="/admission">
                  Admission
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#785610] transition-colors" href="/notices">
                  Notices
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#785610] transition-colors" href="/contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#785610] transition-colors" href="/student">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#785610] transition-colors" href="/admin">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Faculties */}
          <div>
            <h4 className="text-base text-[#1f1b15] font-serif font-bold mb-5">
              Academic Faculties
            </h4>
            <ul className="space-y-3 text-xs text-[#4e4435]">
              <li>
                <Link className="hover:text-[#785610] transition-colors" href="#courses">
                  Faculty of Shariah &amp; Usul al-Fiqh (کلیۃ الشریعہ)
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#785610] transition-colors" href="#courses">
                  Department of Hadith &amp; Quranic Exegesis
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#785610] transition-colors" href="#courses">
                  Faculty of Contemporary Ethics &amp; Finance
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#785610] transition-colors" href="#courses">
                  Center for Arabic Linguistics &amp; Rhetoric
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#785610] transition-colors" href="#courses">
                  Institute of Manuscript Preservation
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Connect with Us */}
          <div>
            <h4 className="text-base text-[#1f1b15] font-serif font-bold mb-5">
              Connect with Us
            </h4>
            <p className="text-xs text-[#4e4435] leading-relaxed mb-4">
              Stay connected with campus announcements, scholarly discourses, and
              community updates:
            </p>
            <div className="flex flex-col gap-2.5 text-xs">
              <a
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#ffffff] border border-[#d9cdb8] text-[#1f1b15] hover:border-[#b48a3c] hover:bg-[#f5eedb] transition-all group shadow-xs"
                href="#instagram"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#785610]">
                    photo_camera
                  </span>
                  <span>Instagram</span>
                </span>
                <span className="text-[#8c6828] group-hover:translate-x-0.5 transition-transform">
                  @aljamiatulbukhari
                </span>
              </a>
              <a
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#ffffff] border border-[#d9cdb8] text-[#1f1b15] hover:border-[#b48a3c] hover:bg-[#f5eedb] transition-all group shadow-xs"
                href="#facebook"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#785610]">
                    public
                  </span>
                  <span>Facebook</span>
                </span>
                <span className="text-[#8c6828] group-hover:translate-x-0.5 transition-transform">
                  /aljamiatulbukhari
                </span>
              </a>
              <a
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#ffffff] border border-[#d9cdb8] text-[#1f1b15] hover:border-[#b48a3c] hover:bg-[#f5eedb] transition-all group shadow-xs"
                href="#youtube"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#785610]">
                    smart_display
                  </span>
                  <span>YouTube</span>
                </span>
                <span className="text-[#8c6828] group-hover:translate-x-0.5 transition-transform">
                  Lectures &amp; Bayans
                </span>
              </a>
              <a
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#ffffff] border border-[#d9cdb8] text-[#1f1b15] hover:border-[#b48a3c] hover:bg-[#f5eedb] transition-all group shadow-xs"
                href="#whatsapp"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#785610]">
                    forum
                  </span>
                  <span>WhatsApp Channel</span>
                </span>
                <span className="text-[#8c6828] group-hover:translate-x-0.5 transition-transform">
                  Instant Notices
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Sub-footer copyright bar */}
        <div className="pt-8 pb-4 border-t border-[#e5dcc7] flex flex-col md:flex-row items-center justify-between text-[#4e4435] text-xs mt-2 gap-6">
          <p className="text-center md:text-left">
            © 2026 Al Jamia Tul Bukhari Academy. Tamam huqooq mehfooz hain (All
            Rights Reserved). Built with ethical academic reverence.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link className="hover:text-[#785610] transition-colors" href="#privacy">
              Privacy Policy
            </Link>
            <Link className="hover:text-[#785610] transition-colors" href="#shariah">
              Shariah Governance Code
            </Link>
            <Link className="hover:text-[#785610] transition-colors" href="/admin">
              Admin Portal
            </Link>
            <span className="opacity-40 text-[#c2b498]">•</span>
            <a className="text-[#785610] hover:underline font-semibold" dir="rtl" href="#urdu">
              اردو ورژن
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
