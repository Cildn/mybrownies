"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function PerfectGiftBanner() {
  return (
    <section className="relative w-full h-[400px] sm:h-[500px] md:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/Perfect-gift.png"
          alt="The Perfect Gift"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
          className="brightness-75"
        />
      </div>

      {/* Content Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 sm:px-6"
      >
        <h2
          className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4"
          style={{ fontFamily: "Hellix-Regular" }}
        >
          The Perfect Gift
        </h2>
        <p className="max-w-xs sm:max-w-xl text-sm sm:text-base md:text-xl mb-4 sm:mb-6 leading-snug sm:leading-relaxed">
          Thoughtfully curated selections for every occasion. Find the perfect
          gift that speaks luxury, elegance, and sophistication.
        </p>

        {/* CTA Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg font-semibold border border-white rounded-full transition-all duration-300 hover:bg-white hover:text-black"
        >
          Coming Soon
        </motion.button>
      </motion.div>
    </section>
  );
}
