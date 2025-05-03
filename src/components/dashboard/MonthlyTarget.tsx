"use client";
import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import dynamic from "next/dynamic";
import { GET_MONTHLY_TARGET } from "@/lib/graphql/queries/chart";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ApexOptions {
  colors: string[];
  chart: {
    fontFamily: string;
    type: "radialBar"; // Explicitly set to "radialBar"
    height: number;
    sparkline: { enabled: boolean };
  };
  plotOptions: {
    radialBar: {
      startAngle: number;
      endAngle: number;
      hollow: { size: string };
      track: { background: string; strokeWidth: string; margin: number };
      dataLabels: {
        name: { show: boolean };
        value: {
          fontSize: string;
          fontWeight: string;
          offsetY: number;
          color: string;
          formatter: (val: number) => string;
        };
      };
    };
  };
  fill: { type: "solid"; colors: string[] };
  stroke: { lineCap: "round" };
  labels: string[];
}

export default function MonthlyTarget() {
  const { data, loading, error } = useQuery(GET_MONTHLY_TARGET);

  const { monthlyTarget = 0, actualRevenue = 0, todayRevenue = 0, dailyProgress = 0 } =
    data?.monthlyTarget || {};

  const progress = useMemo(() => {
    if (monthlyTarget === 0) return 0;
    return Math.min((actualRevenue / monthlyTarget) * 100, 100);
  }, [monthlyTarget, actualRevenue]);

  const series = useMemo(() => [progress], [progress]);

  const options: ApexOptions = useMemo(() => {
    return {
      colors: ["#465FFF"],
      chart: {
        fontFamily: "Outfit, sans-serif",
        type: "radialBar",
        height: 330,
        sparkline: { enabled: true },
      },
      plotOptions: {
        radialBar: {
          startAngle: -85,
          endAngle: 85,
          hollow: { size: "80%" },
          track: { background: "#E4E7EC", strokeWidth: "100%", margin: 5 },
          dataLabels: {
            name: { show: false },
            value: {
              fontSize: "36px",
              fontWeight: "600",
              offsetY: -40,
              color: "#1D2939",
              formatter: (val: number) => `${val.toFixed(1)}%`,
            },
          },
        },
      },
      fill: { type: "solid", colors: ["#465FFF"] },
      stroke: { lineCap: "round" },
      labels: ["Progress"],
    };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Monthly Target
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              Target you’ve set for each month
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="max-h-[330px]">
            <ReactApexChart options={options} series={series} type="radialBar" height={330} />
          </div>

          <span
            className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium ${
              dailyProgress >= 0 ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-600" : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-600"
            }`}
          >
            {dailyProgress >= 0 ? "+" : ""}
            {dailyProgress.toFixed(1)}%
            <svg
              className="ml-1 inline-block h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d={dailyProgress >= 0 ? "M12 6l6 6-6 6z" : "M12 18l-6-6 6-6z"} />
            </svg>
          </span>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          You earned ${todayRevenue} today, which is {dailyProgress >= 0 ? "progressing" : "lagging"} behind.
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Target
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            ${monthlyTarget}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Revenue
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            ${actualRevenue}
            <svg
              className="ml-1 inline-block h-4 w-4 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 6l6 6-6 6z" />
            </svg>
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Today
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            ${todayRevenue}
            <svg
              className="ml-1 inline-block h-4 w-4 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 18l-6-6 6-6z" />
            </svg>
          </p>
        </div>
      </div>
    </div>
  );
}