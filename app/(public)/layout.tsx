import React from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f2]">
      <Header />
      <main className="w-full pt-28 sm:pt-32 bg-[#fcf9f2] flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
