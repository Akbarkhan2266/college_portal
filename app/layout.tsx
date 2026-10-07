import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Al Jamia Tul Bukhari Academy | Where Faith Meets the Future",
  description:
    "An autonomous center for advanced classical Shariah studies, modern sciences, and ethical leadership in Agra, India.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Noto+Serif:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-[#fcf9f2] text-[#1f1b15] font-sans selection:bg-[#d4af37] selection:text-[#1f1b15]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
