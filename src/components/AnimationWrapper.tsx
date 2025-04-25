"use client";

import { useState } from "react";
import OverlayText from "@/components/landing/OverlayText";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";

export default function AnimationWrapper() {
  const [animationComplete, setAnimationComplete] = useState(false);

  return (
    <>
      {!animationComplete && <OverlayText onAnimationComplete={() => setAnimationComplete(true)} />}
      <Navbar isVisible={animationComplete} />
      <Hero isVisible={animationComplete} />
    </>
  );
}