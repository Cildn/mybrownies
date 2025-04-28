"use client";

import { motion } from "framer-motion";

export default function Hero({ isVisible }: { isVisible: boolean }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      className="w-full h-[100vh] min-h-[500px]" // Ensure it works on smaller screens
    >
      <section className="relative w-full h-full overflow-hidden">
        {/* Background Video */}
        <motion.video
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </motion.video>

        {/* Gradient Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* Featured Collection/Product Description */}
        <motion.div
          className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center text-white max-w-2xl px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-4">
            Brownie Heaven
          </h2>
          <p className="mt-4 text-xl sm:text-2xl max-w-md mx-auto" style={{ fontFamily: "Hellix-Regular" }}>
            A culinary masterpiece that is truly divine.
          </p>

          {/* Discover Button */}
          <motion.button
            whileHover={{ scale: 0.95 }}
            whileTap={{ scale: 0.9 }}
            className="px-6 py-3 mt-6 text-xl font-semibold border border-white rounded-full transition-all duration-300 hover:bg-white hover:text-black"
          >
            Discover
          </motion.button>
        </motion.div>
      </section>
    </motion.section>
  );
}