"use client";
import React from "react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import { GET_BEST_SELLING_PRODUCTS, GET_BEST_SELLING_COLLECTIONS } from "@/lib/graphql/queries/chart";
import { ApexOptions } from "apexcharts";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function BestSellersPage() {
  const [selectedPeriod] = useState("Monthly"); // Removed setSelectedPeriod

  // Fetch best-selling products
  const { data: productsData, loading: productsLoading, error: productsError } = useQuery(GET_BEST_SELLING_PRODUCTS, {
    variables: { period: selectedPeriod.toLowerCase() },
  });

  // Fetch best-selling collections
  const { data: collectionsData, loading: collectionsLoading, error: collectionsError } = useQuery(GET_BEST_SELLING_COLLECTIONS, {
    variables: { period: selectedPeriod.toLowerCase() },
  });

  if (productsLoading || collectionsLoading) return <p>Loading...</p>;
  if (productsError || collectionsError) return <p>Error: {(productsError || collectionsError)?.message}</p>;

  const bestSellingProducts = productsData?.bestSellingProducts || [];
  const bestSellingCollections = collectionsData?.bestSellingCollections || [];

  // Prepare chart data for products
  const productOptions: ApexOptions = {
    colors: ["#FF9F43"],
    chart: { type: "bar", height: 300 },
    plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
    xaxis: {
      categories: bestSellingProducts.map((item: { product: { name: string } }) => item.product.name),
    },
    tooltip: { y: { formatter: (val: number) => `${val} units` } },
  };

  const productSeries = [{ name: "Units Sold", data: bestSellingProducts.map((item: { totalSold: number }) => item.totalSold) }];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Best-Sellers</h1>

      <div className="grid grid-cols-2 gap-4 text-gray-700">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Top-Selling Product</h2>
          {bestSellingProducts.length > 0 && (
            <>
              <p className="text-3xl font-bold">{bestSellingProducts[0].product.name}</p>
              <p className="text-sm text-green-500">
                +{((bestSellingProducts[0].totalSold / (bestSellingProducts[1]?.totalSold || 1)) * 100).toFixed(2)}% increase from last month
              </p>
            </>
          )}
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Best-Selling Collection</h2>
          {bestSellingCollections.length > 0 && (
            <div className="flex items-center gap-2">
              <Image
                src={bestSellingCollections[0].collection.image || "/images/default.jpg"}
                alt={bestSellingCollections[0].collection.name}
                width={40}
                height={40}
                className="rounded"
              />
              <p className="text-3xl font-bold">{bestSellingCollections[0].collection.name}</p>
            </div>
          )}
          {bestSellingCollections.length > 0 && (
            <p className="text-sm text-green-500">
              {bestSellingCollections[0].totalSold} units sold
            </p>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Top 5 Products</h2>
        <ReactApexChart options={productOptions} series={productSeries} type="bar" height={300} />
      </div>
    </div>
  );
}