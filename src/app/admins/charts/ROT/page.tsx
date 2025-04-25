"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_REVENUE_BY_PERIOD } from "@/lib/graphql/queries/chart";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const periods = ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"];

export default function RevenuePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");

  // Fetch revenue data using GraphQL
  const { data, loading, error } = useQuery(GET_REVENUE_BY_PERIOD, {
    variables: { period: selectedPeriod },
  });
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  console.log("GraphQL Response:", data);
  
  const revenueData = data?.revenueByPeriod?.revenueData || [];
  const periodLabels = data?.revenueByPeriod?.periodLabels || [];
  const totalRevenue = data?.revenueByPeriod?.totalRevenue || 0;

  const previousRevenue = revenueData.slice(0, -1).reduce((acc: number, val: number) => acc + val, 0);
  const revenueGrowth =
    revenueData.length > 1 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

  const options: ApexOptions = {
    colors: ["#28C76F"],
    chart: { type: "line", height: 320, toolbar: { show: false } },
    stroke: { curve: "smooth", width: 3 },
    xaxis: { categories: periodLabels },
    yaxis: { labels: { formatter: (val) => `$${val}k` } },
    tooltip: { y: { formatter: (val) => `$${val}k` } },
  };

  const series = [{ name: "Revenue", data: revenueData }];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Revenue Over Time</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-lg flex flex-col gap-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp size={18} /> Total Revenue ({selectedPeriod})
          </h2>
          <p className="text-3xl font-bold">${totalRevenue}k</p>
          <p className={`text-sm flex items-center gap-1 ${revenueGrowth > 0 ? "text-green-500" : "text-red-500"}`}>
            {revenueGrowth.toFixed(2)}% {revenueGrowth > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          </p>
        </div>

        <div className="p-4 bg-white rounded-lg flex flex-col gap-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar size={18} /> Select Period
          </h2>
          <select
            className="border p-2 rounded"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            {periods.map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-lg font-semibold">Revenue Trend</h2>
        <ReactApexChart options={options} series={series} type="line" height={320} />
      </div>
    </div>
  );
}