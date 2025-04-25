"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Sidebar from "./Sidebar";
import Link from "next/link";

export default function Navbar({ isVisible }: { isVisible: boolean }) {
  const [hidden, setHidden] = useState(false);
  const [sidebar, setSidebar] = useState<"menu" | "search" | "cart" | null>(null);

  // Hide Navbar when scrolling down, show when scrolling up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const updateScroll = () => {
      setHidden(window.scrollY > lastScrollY && window.scrollY > 50);
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <motion.nav
        className="fixed top-0 left-0 w-full bg-white flex justify-between items-center px-6 py-4 z-50 transition-all duration-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0 }}
        style={{ transform: hidden ? "translateY(-100%)" : "translateY(0)" }}
      >
        <button onClick={() => setSidebar("menu")}>
          <Menu size={24} />
        </button>
        <Link href="/" className="flex items-center gap-2 text-4xl text-amber-900">
        <Image src="/images/brownies.png" alt="Brownies" width={60} height={60} /> Brownie's
        </Link>
        <div className="flex gap-4">
          <button onClick={() => setSidebar("search")}>
            <Search size={24} />
          </button>
          <button onClick={() => setSidebar("cart")}>
            <ShoppingBag size={24} />
          </button>
        </div>
      </motion.nav>

      {/* Sidebar */}
      <Sidebar type={sidebar} onClose={() => setSidebar(null)} />
    </>
  );
}