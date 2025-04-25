"use client";
import ScentsPage from "@/components/categories/scents";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Scents() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isVisible />
      <div className="flex-grow">
        <ScentsPage />
      </div>
      <Footer />
    </div>
);
}
