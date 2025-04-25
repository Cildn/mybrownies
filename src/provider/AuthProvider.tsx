"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/zustand/auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const setToken = useAuthStore((s) => s.setToken);

  // only run on client
  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const rememberMe = localStorage.getItem("admin_remember_me_token");
    if (rememberMe) {
      // set token in store
      localStorage.setItem("admin_token", rememberMe);
      setToken(rememberMe);

      // only redirect if we're on the login (or root) page
      if (pathname === "/signin" || pathname === "/") {
        router.replace("/admins/dashboard");
      }
    }
  }, [isReady, pathname, router, setToken]);

  if (!isReady) return null;
  return <>{children}</>;
};
