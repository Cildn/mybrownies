"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function PerfectGiftBanner() {
  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/Perfect-gift.png"
          alt="The Perfect Gift"
          layout="fill"
          objectFit="cover"
          quality={100} // Ensures crisp 4K clarity
          priority // Ensures fast loading
          className="brightness-75"
        />
      </div>

      {/* Content Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6"
      >
        <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: "Hellix-Regular" }}>
          The Perfect Gift
        </h2>
        <p className="max-w-2xl text-lg md:text-xl mb-6 leading-relaxed">
          Thoughtfully curated selections for every occasion. Find the perfect
          gift that speaks luxury, elegance, and sophistication.
        </p>

        {/* CTA Button */}
        <motion.button
          type="disabled"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 text-lg font-semibold border border-white rounded-full transition-all duration-300 hover:bg-white hover:text-black"
        >
          Coming Soon
        </motion.button>
      </motion.div>
    </section>
  );
}