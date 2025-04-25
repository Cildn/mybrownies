"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@apollo/client";
import { PackageCheck, XCircle } from "lucide-react";
import { GET_ORDER_STATUS_DISTRIBUTION } from "@/lib/graphql/queries/chart";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function OrderStatusPage() {
  const [selectedPeriod] = useState("Monthly"); // Removed setSelectedPeriod since it's unused

  const { data, loading, error } = useQuery(GET_ORDER_STATUS_DISTRIBUTION, {
    variables: { period: selectedPeriod },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { pending, completed, cancelled, refunded } = data?.orderStatusDistribution || {};
  const series = [pending, completed, cancelled, refunded];
  const totalOrders = series.reduce((acc, val) => acc + val, 0);
  const completedRate = ((completed / totalOrders) * 100).toFixed(1);
  const cancelledRate = ((cancelled / totalOrders) * 100).toFixed(1);

  const options: ApexOptions = {
    labels: ["Pending", "Completed", "Cancelled", "Refunded"],
    colors: ["#FF9F43", "#28C76F", "#EA5455", "#7367F0"],
    chart: { type: "donut" as const, height: 320 }, // Added 'as const' to make type more specific
    legend: { position: "bottom" },
    tooltip: { y: { formatter: (val: number) => `${val} Orders` } }, // Added type for val
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Order Status Distribution</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-lg flex flex-col gap-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <PackageCheck size={18} /> Completed Orders Rate
          </h2>
          <p className="text-3xl font-bold">{completedRate}%</p>
        </div>

        <div className="p-4 bg-white rounded-lg flex flex-col gap-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <XCircle size={18} /> Cancelled Orders Rate
          </h2>
          <p className="text-3xl font-bold">{cancelledRate}%</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-lg font-semibold">Order Status Breakdown</h2>
        <ReactApexChart options={options} series={series} type="donut" height={320} />
      </div>
    </div>
  );
}