"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { name: "Scents",      description: "Immerse yourself in luxurious fragrances...",          image: "/images/scents-4k.jpg" },
  { name: "Aesthetics",  description: "Our fashion pieces complement your unique style...",   image: "/images/aesthetics-4k.jpg" },
  { name: "Tastes",       description: "Velvety brownies, curated desserts, and exquisite treats...", image: "/images/tastes-4k.jpg" },
  { name: "Sights",       description: "Turn heads with our premium accessories...",           image: "/images/sight-4k.jpg" },
];

export default function CategoryGrid() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const gridRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        activeCategory &&
        gridRef.current &&
        !gridRef.current.contains(e.target as Node)
      ) {
        setActiveCategory(null);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [activeCategory]);

  return (
    <section ref={gridRef} className="py-20 px-6 mg-top-0">
      <h2 className="text-5xl font-semibold text-center mb-6">Our Categories</h2>
      <p className="text-center max-w-2xl mx-auto text-lg mb-12" style={{ fontFamily: "Hellix-Regular" }}>
        Experience luxury through our carefully curated categories.
      </p>

      {/* Desktop Grid */}
      {!isMobile && (
        <div className="grid-cols-4 gap-4 h-[450px] relative hidden md:grid">
          {categories.map((category, index) => {
            const isHovered  = hovered === category.name;
            const isActive   = activeCategory === category.name;
            const hideOthers = activeCategory !== null && !isActive;

            const dynamicMargin = isHovered
              ? `0 ${9.25 + (-108.25 * index) + 1.25 * index ** 2}%`
              : "0";

            return (
              <motion.div
                key={category.name}
                className={
                  "relative h-full overflow-hidden rounded-lg cursor-pointer transition-all duration-500 " +
                  (hideOthers ? "opacity-0 pointer-events-none" : "")
                }
                onMouseEnter={() => setHovered(category.name)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setActiveCategory(isActive ? null : category.name)}
                animate={{
                  width: isHovered ? "90vw" : "100%",
                  height: "100%",
                  opacity: isHovered ? 1 : hovered ? 0 : 1,
                  zIndex: isHovered ? 50 : 1,
                  margin: dynamicMargin,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  layout="fill"
                  objectFit="cover"
                  quality={100}
                  className="rounded-lg transition-all duration-500"
                />

                <motion.div
                  className="absolute bottom-4 left-0 right-0 text-center text-white text-2xl font-bold py-2"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isHovered ? 0 : 1 }}
                >
                  {category.name}
                </motion.div>

                {/* ← switched from isActive to isHovered */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black bg-opacity-60 text-white space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <p className="max-w-sm text-lg text-center">
                        {category.description}
                      </p>
                      <Link
                        href={`/category/${category.name}`}
                        className="px-6 py-3 text-lg font-semibold border border-white rounded-full transition-all duration-300 hover:bg-white hover:text-black inline-block"
                      >
                        Explore
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Mobile Grid unchanged */}
      {isMobile && (
        <div className="relative">
          <div className="grid grid-cols-2 gap-4 h-[450px] md:hidden">
            {categories.map((category, index) => {
              const isActive   = activeCategory === category.name;
              const hideOthers = activeCategory !== null && !isActive;
              const row = Math.floor(index / 2), col = index % 2;
              const originX = col === 0 ? 0 : 1;
              const originY = row === 0 ? 0 : 1;

              return (
                <motion.div
                  key={category.name}
                  className={
                    "relative h-full overflow-hidden rounded-lg cursor-pointer transition-all duration-500 " +
                    (hideOthers ? "opacity-0 pointer-events-none" : "")
                  }
                  onClick={() => setActiveCategory(isActive ? null : category.name)}
                  animate={{
                    scale: isActive ? 2.1 : 1,
                    originX,
                    originY,
                    zIndex: isActive ? 50 : 1,
                  }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    className="rounded-lg transition-all duration-500"
                  />
                  <motion.div
                    className="absolute bottom-4 left-0 right-0 text-center text-white text-2xl font-bold py-2"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isActive ? 0 : 1 }}
                  >
                    {category.name}
                  </motion.div>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-8 bg-black bg-opacity-60 text-white space-y-4 sm:space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <p className="max-w-xs sm:max-w-sm text-sm sm:text-lg text-center">
                          {category.description}
                        </p>
                        <Link
                          href={`/category/${category.name}`}
                          className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg font-semibold border border-white rounded-full transition-all duration-300 hover:bg-white hover:text-black inline-block"
                        >
                          Explore
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
