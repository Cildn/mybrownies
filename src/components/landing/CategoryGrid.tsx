"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link from Next.js
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  {
    name: "Scents",
    description: "Immerse yourself in luxurious fragrances...",
    image: "/images/scents-4k.jpg",
  },
  {
    name: "Aesthetics",
    description: "Our fashion pieces complement your unique style...",
    image: "/images/aesthetics-4k.jpg",
  },
  {
    name: "Taste",
    description: "Velvety brownies, curated desserts, and exquisite treats...",
    image: "/images/tastes-4k.jpg",
  },
  {
    name: "Sight",
    description: "Turn heads with our premium accessories...",
    image: "/images/sight-4k.jpg",
  },
];

export default function CategoryGrid() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="py-20 px-6 mg-top-0">
      {/* Title & Description */}
      <h2 className="text-5xl font-semibold text-center mb-6">Our Categories</h2>
      <p className="text-center max-w-2xl mx-auto text-lg mb-12" style={{ fontFamily: "Hellix-Regular" }}>
        Experience luxury through our carefully curated categories.
      </p>

      {/* Grid Layout */}
      <div className="grid grid-cols-4 gap-4 h-[450px] relative">
        {categories.map((category, index) => {
          const isHovered = hovered === category.name;

          // Apply the quadratic formula for centering the hovered image
          const dynamicMargin = isHovered
            ? `0 ${9.25 + (-108.25 * index) + (1.25 * index ** 2)}%`
            : "0";

          return (
            <motion.div
              key={category.name}
              className="relative h-full overflow-hidden rounded-lg cursor-pointer transition-all duration-500"
              onMouseEnter={() => setHovered(category.name)}
              onMouseLeave={() => setHovered(null)}
              animate={{
                width: isHovered ? "90vw" : "100%",
                height: "100%",
                opacity: isHovered ? 1 : hovered ? 0 : 1,
                zIndex: isHovered ? 50 : 1,
                margin: dynamicMargin, // Dynamically calculated margin
              }}
              transition={{ duration: 0.5 }}
            >
              {/* Background Image */}
              <Image
                src={category.image}
                alt={category.name}
                layout="fill"
                objectFit="cover"
                quality={100}
                className="rounded-lg transition-all duration-500"
              />

              {/* Category Name (White Text at Base) */}
              <motion.div
                className="absolute bottom-4 left-0 right-0 text-center text-white text-2xl font-bold py-2"
                initial={{ opacity: 1 }}
                animate={{ opacity: isHovered ? 0 : 1 }}
              >
                {category.name}
              </motion.div>

              {/* Expanded Description (Only on Hover) */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black bg-opacity-60 text-white space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="max-w-sm text-lg text-center">{category.description}</p>
                    {/* Updated Explore Button */}
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
    </section>
  );
}