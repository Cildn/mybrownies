import { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import FAQ from "@/contextPages/FAQ";

export const metadata: Metadata = {
  title: "Scents | Les Brownies",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default function Privacy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isVisible />
      <div className="flex-grow">
        <FAQ />
      </div>
      <Footer />
    </div>
);
}
