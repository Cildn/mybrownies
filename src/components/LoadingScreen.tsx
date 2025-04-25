"use client";
import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-white">
      <Image
        src="/images/brownies-icon.png"
        alt="Loading..."
        width={75}
        height={75}
        className="animate-pulse-scale"
      />
    </div>
  );
}