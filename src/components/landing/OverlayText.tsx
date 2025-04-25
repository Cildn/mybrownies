"use client";

import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

export default function OverlayText({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  const [text, setText] = useState("");
  const controls = useAnimationControls();
  const targetText = "Brownie's";

  // Typing animation
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(targetText.substring(0, index + 1));
      index++;
      if (index === targetText.length) {
        clearInterval(interval);
        setTimeout(() => {
          controls.start("floatUp"); // Start floating effect
        }, 500);
      }
    }, 125);
    return () => clearInterval(interval);
  }, [controls]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-white z-50"
      initial={{ opacity: 1 }}
      animate={controls}
      variants={{
        floatUp: { y: -240, transition: { duration: 0.8 } }, // Floating Up Animation
      }}
      onAnimationComplete={onAnimationComplete} // Call parent function when done
    >
      <motion.h1 className="text-8xl font-bold text-black">{text}</motion.h1>
    </motion.div>
  );
}