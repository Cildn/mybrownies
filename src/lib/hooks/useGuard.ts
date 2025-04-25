"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/zustand/auth";

export const useAuthGuard = () => {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure client-side execution

    if (!token) {
      router.push("/signin");
    }
  }, [token, router]);
};