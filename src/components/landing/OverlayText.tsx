import { useEffect, useState, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";

export default function OverlayText({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  const [text, setText] = useState("");
  const controls = useAnimationControls();
  const targetText = "Brownie's";
  const animationCompleteRef = useRef(onAnimationComplete);

  // Update ref when prop changes
  useEffect(() => {
    animationCompleteRef.current = onAnimationComplete;
  }, [onAnimationComplete]);

  // Typing animation
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(targetText.substring(0, index + 1));
      index++;
      if (index === targetText.length) {
        clearInterval(interval);
        setTimeout(() => {
          controls.start("floatUp");
        }, 300);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [controls]);

  // Handle animation completion using the built-in onAnimationComplete event
  return (
    <motion.div
      className="fixed inset-0 bg-white flex justify-center items-center z-50 overflow-hidden"
      initial={{ opacity: 1 }}
      animate={controls}
      variants={{
        floatUp: {
          y: -235,
          opacity: 0,
          transition: { duration: .7, ease: "easeInOut" },
        },
      }}
      onAnimationComplete={() => {
        animationCompleteRef.current?.();
      }}
    >
      <motion.h1
        className="text-center text-black font-bold tracking-wide"
        style={{ 
          fontSize: "clamp(3rem, 8vw, 5rem)",
          lineHeight: "clamp(1.2, 3vw, 1.5)",
        }}
      >
        {text}
      </motion.h1>
    </motion.div>
  );
}