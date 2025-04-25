"use client";
import { EcommerceMetrics } from "@/components/dashboard/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/dashboard/MonthlyTarget";
import MonthlySalesChart from "@/components/dashboard/MonthlySalesChart";
import RecentOrders from "@/components/dashboard/RecentOrders";
import '../admin-styles.css';
//import { useAuthGuard } from "@/hooks/useGuard";

export default function AdminPage() {
  //useAuthGuard();
  return (
    <div className="grid grid-cols-12 gap-6 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-full">
        <RecentOrders />
      </div>
    </div>
  );
}