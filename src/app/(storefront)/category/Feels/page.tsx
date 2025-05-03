import FeelsPage from "@/components/categories/feels";
import { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Scents | Les Brownies",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default function Scents() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isVisible />
      <div className="flex-grow">
        
        <FeelsPage />
      </div>
      <Footer />
    </div>
);
}
