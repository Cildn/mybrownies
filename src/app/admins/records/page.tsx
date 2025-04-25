"use client";
import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import InvoiceTable from "@/components/tables/InvoiceTable";
import OrdersTable from "@/components/tables/OrdersTable";
import RecordsTab from "@/components/inventory/RecordsTab";
import React from "react";
import '../admin-styles.css';

export default function Inventory() {
  const [selectedTab, setSelectedTab] = useState<"Orders" | "Invoices">("Orders");

  return (
    <div>
      <div className="space-y-6">
        <RecordsTab onTabChange={setSelectedTab} />
        {selectedTab === "Orders" && (
          <ComponentCard title="Orders">
          <OrdersTable />
          </ComponentCard>
        )}
        {selectedTab === "Invoices" && (
          <ComponentCard title="Invoices">
          <InvoiceTable />
          </ComponentCard>
        )}
      </div>
    </div>
  );
}