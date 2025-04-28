import React from "react";
import { useQuery } from "@apollo/client";
import Badge from "../ui/badge/Badge";
import { ArrowDown, ArrowUp } from "lucide-react";
import { BoxIconLine } from "../icons";
import { Users } from "lucide-react";
import { GET_TOTAL_ORDERS_FOR_TWO_PERIODS } from "@/lib/graphql/queries/chart";

export const EcommerceMetrics = () => {
  const [selectedPeriod, setSelectedPeriod] = React.useState("Monthly");
  const { data, loading, error } = useQuery(GET_TOTAL_ORDERS_FOR_TWO_PERIODS, {
    variables: { period: selectedPeriod.toLowerCase() }, // Pass the selected period
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { currentOrders, previousOrders } = data?.totalOrdersForTwoPeriods || {};
  const totalOrders = currentOrders || 0;

  // Calculate percentage change
  let percentageChange = 0;
  if (previousOrders > 0) {
    percentageChange = ((currentOrders - previousOrders) / previousOrders) * 100;
  }

  // Determine badge color and arrow direction
  let badgeColor = "warning"; // Default to yellow
  let arrow = null;

  if (percentageChange > 0) {
    badgeColor = "success"; // Green for positive growth
    arrow = <ArrowUp className="text-success-500" />;
  } else if (percentageChange < 0) {
    badgeColor = "error"; // Red for negative growth
    arrow = <ArrowDown className="text-error-500" />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Users className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Customers</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm text-2xl dark:text-white/90">
              Coming Soon
            </h4>
          </div>
          <Badge color="success">
            <ArrowUp />
            
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Orders</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm text-2xl dark:text-white/90">
              {totalOrders}
            </h4>
          </div>
          <Badge color={badgeColor}>
            {arrow} {Math.abs(percentageChange).toFixed(2)}%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};