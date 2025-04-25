"use client";

import { motion } from "framer-motion";

export default function Hero({ isVisible }: { isVisible: boolean }) {

  
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
    >
       <section className="relative w-full h-screen">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Featured Collection/Product Description */}
      <motion.div
        className="absolute bottom-16 left-1/2 transform -translate-x-1 text-center text-white"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <h2 className="text-4xl font-semibold">Brownie Heaven</h2>
        <p className="mt-4 max-w-xl" style={{ fontFamily: "Hellix-Regular" }}>
          A culinary masterpiece that is truly divine.
        </p>

        {/* Discover Button */}
        <motion.button
          whileHover={{ scale: 0.8 }}
          whileTap={{ scale: 0.5 }}
          className="px-6 py-3 mt-5 text-xl font-semibold border border-white rounded-full transition-all duration-300 hover:bg-white hover:text-black"
        >
          Discover
        </motion.button>
      </motion.div>
    </section>
    </motion.section>
  );
}