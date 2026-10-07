"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import TopBar from "./TopBar";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Admission", href: "/admission" },
    { name: "Notices", href: "/notices" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#fffdf8]/95 backdrop-blur-md border-b border-[#e5dcc7] shadow-sm">
      <TopBar />
      <div className="w-full px-6 sm:px-10 py-2">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          {/* Logo */}
          <Link className="flex items-center gap-3" href="/">
            <div className="relative h-16 sm:h-20 w-48 sm:w-64 flex items-center">
              <Image
                alt="Al Jamia Tul Bukhari Academy"
                src="/images/logo.png"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                mounted &&
                (pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href)));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm transition-colors py-2 ${
                    isActive
                      ? "text-[#785610] font-bold border-b-2 border-[#b48a3c]"
                      : "text-[#4e4435] hover:text-[#785610]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right CTA Actions */}
          <div className="flex items-center gap-4">
            <Link
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#785610] text-white text-sm font-semibold hover:bg-[#946e28] transition-all border border-[#b48a3c] shadow-sm"
              href="/admission"
            >
              Apply for 2026
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#4e4435] hover:text-[#785610]"
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-[#e5dcc7] pt-3 pb-4 space-y-2 mt-2">
            {navLinks.map((link) => {
              const isActive =
                mounted &&
                (pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href)));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-sm rounded-md ${
                    isActive
                      ? "bg-[#f5eedb] text-[#785610] font-bold"
                      : "text-[#4e4435] hover:bg-[#fbf7ee]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-2 flex flex-col gap-2">
              <Link
                className="w-full text-center px-4 py-2 rounded-lg bg-[#785610] text-white text-sm font-semibold hover:bg-[#946e28]"
                href="/admission"
                onClick={() => setMobileMenuOpen(false)}
              >
                Apply for 2026
              </Link>
              <div className="flex justify-around pt-2 text-xs text-[#785610] border-t border-[#e5dcc7]">
                <Link href="/student" onClick={() => setMobileMenuOpen(false)}>
                  Student Portal
                </Link>
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                  Admin Portal
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
