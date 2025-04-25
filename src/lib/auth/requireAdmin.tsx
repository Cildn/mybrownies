"use client";
import { useAuthStore } from "@/lib/zustand/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function requireAdmin(Component) {
  return function ProtectedPage(props) {
    const token = useAuthStore((state) => state.token);
    const router = useRouter();

    useEffect(() => {
      if (!token) {
        router.push("/admins/dashboard"); // 🔒 Redirect if no token
      }
    }, [token, router]);

    if (!token) return null; // Prevent page from flashing before redirect

    return <Component {...props} />;
  };
}
