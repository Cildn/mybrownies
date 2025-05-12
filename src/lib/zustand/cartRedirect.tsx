"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/zustand/useCartStore";

export default function CartRedirectHandler() {
  const router = useRouter();
  const redirect = useCartStore((state) => state.redirect);
  const resetRedirect = useCartStore((state) => state.resetRedirect);

  useEffect(() => {
    if (redirect) {
      router.push("/checkout");
      resetRedirect();
    }
  }, [redirect, router, resetRedirect]);

  return null;
}
