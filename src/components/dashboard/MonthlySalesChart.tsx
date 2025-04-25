import React, { useMemo } from "react";
import { useQuery } from "@apollo/client";
import dynamic from "next/dynamic";
import { GET_REVENUE_BY_PERIOD } from "@/lib/graphql/queries/chart";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlySalesChart({ period = "Monthly" }) {
  const { data, loading, error } = useQuery(GET_REVENUE_BY_PERIOD, {
    variables: { period },
  });

  // Memoize options to prevent unnecessary re-renders
  const options = useMemo(() => {
    return {
      colors: ["#465fff"],
      chart: {
        fontFamily: "Outfit, sans-serif",
        type: "bar", // Explicitly typed as "bar"
        height: 180,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "39%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: data?.revenueByPeriod?.periodLabels || [],
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { title: { text: undefined } },
      tooltip: {
        x: { show: false },
        y: { formatter: (val: number) => `$${val.toFixed(2)}` },
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: { height: 150 },
            plotOptions: { bar: { columnWidth: "50%" } },
          },
        },
      ],
    };
  }, [data?.revenueByPeriod?.periodLabels]);

  // Memoize series to prevent unnecessary re-renders
  const series = useMemo(() => {
    return [{ name: "Sales", data: data?.revenueByPeriod?.revenueData || [] }];
  }, [data?.revenueByPeriod?.revenueData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Sales
        </h3>
        <a href="/admins/charts/ROT/" className="text-blue-600">
          View More
        </a>
      </div>

      <div className="max-w-full overflow-x-auto">
        <ReactApexChart options={options} series={series} type="bar" height={180} />
      </div>
    </div>
  );
}