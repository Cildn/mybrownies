"use client";
import { useEffect, useState } from "react";
import AnimationWrapper from "@/components/AnimationWrapper";
import CategoryGrid from "@/components/landing/CategoryGrid";
import PerfectGiftBanner from "@/components/landing/PerfectGiftBanner";
import { SidebarProvider } from "@/components/context/SidebarContext";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetch or auth check
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) return <LoadingScreen />;
  return (
    <main className="bg-white text-black">
      <SidebarProvider>
      <AnimationWrapper/>
      <CategoryGrid />
      <PerfectGiftBanner />
      <Footer />
      </SidebarProvider>
    </main>
  );
}