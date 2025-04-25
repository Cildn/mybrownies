"use client";
import WebConfigPage from "@/components/webState/WebConfig";
import React from "react";
import '../admin-styles.css';
import { useAuthGuard } from "@/lib/hooks/useGuard";

export default function Config() {
  useAuthGuard();
  return (
    <div>
      <div className="space-y-6">
        <WebConfigPage />
      </div>
    </div>
  );
}
