"use client";
import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import CollectionTable from "@/components/tables/CollectionTable";
import ProductTable from "@/components/tables/ProductTable";
import InventoryTab from "@/components/inventory/InventoryTab";
import React from "react";
import '../admin-styles.css';

export default function Inventory() {
  const [selectedTab, setSelectedTab] = useState<"Products" | "Collections">("Products");

  return (
    <div>
      <div className="space-y-6">
        <InventoryTab onTabChange={setSelectedTab} />
        {selectedTab === "Products" && (
          <ComponentCard title="Products">
            <ProductTable />
          </ComponentCard>
        )}
        {selectedTab === "Collections" && (
          <ComponentCard title="Collections">
            <CollectionTable />
          </ComponentCard>
        )}
      </div>
    </div>
  );
}