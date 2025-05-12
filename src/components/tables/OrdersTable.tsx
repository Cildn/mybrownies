"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ORDERS } from "@/lib/graphql/queries/orders";
import {
  MARK_ORDER_AS_PAID,
  MARK_ORDER_AS_COMPLETED,
  MARK_ORDER_AS_REFUNDED,
  MARK_ORDER_AS_CANCELLED,
} from "@/lib/graphql/mutations/orders";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { OrderType, OrderItemType } from "@/types";


export default function OrdersTable() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const { data, loading, error } = useQuery(GET_ORDERS);
  const [markOrderAsPaid] = useMutation(MARK_ORDER_AS_PAID);
  const [markOrderAsCompleted] = useMutation(MARK_ORDER_AS_COMPLETED);
  const [markOrderAsRefunded] = useMutation(MARK_ORDER_AS_REFUNDED);
  const [markOrderAsCancelled] = useMutation(MARK_ORDER_AS_CANCELLED);

  const orders = data?.orders || [];

  const toggleSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCheckboxes = () => {
    setShowCheckboxes(!showCheckboxes);
    setSelectedItems([]);
  };

  const handleMarkAsPaid = async () => {
    try {
      for (const id of selectedItems) {
        await markOrderAsPaid({ variables: { orderId: id } });
      }
      setSelectedItems([]);
      window.location.reload();
    } catch (err) {
      console.error("Error marking orders as paid:", err);
      alert("Failed to mark orders as paid. Please try again.");
    }
  };

  const handleMarkAsCompleted = async () => {
    try {
      for (const id of selectedItems) {
        await markOrderAsCompleted({ variables: { orderId: id } });
      }
      setSelectedItems([]);
      window.location.reload();
    } catch (err) {
      console.error("Error marking orders as completed:", err);
      alert("Failed to mark orders as completed. Please try again.");
    }
  };

  const handleMarkAsCancelled = async () => {
    try {
      for (const id of selectedItems) {
        await markOrderAsCancelled({ variables: { orderId: id } });
      }
      setSelectedItems([]);
      window.location.reload();
    } catch (err) {
      console.error("Error marking orders as cancelled:", err);
      alert("Failed to mark orders as cancelled. Please try again.");
    }
  };

  const handleMarkAsRefunded = async () => {
    try {
      for (const id of selectedItems) {
        await markOrderAsRefunded({ variables: { orderId: id } });
      }
      setSelectedItems([]);
      window.location.reload();
    } catch (err) {
      console.error("Error marking orders as refunded:", err);
      alert("Failed to mark orders as refunded. Please try again.");
    }
  };

  const handleExportCSV = () => {
    window.open(`${process.env.NEXT_PUBLIC_API}/download/orders.csv`, "_blank");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading orders</p>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={toggleCheckboxes}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Select
          </button>
        </div>

        {selectedItems.length > 0 && (
          <div className="flex gap-3">
            {/* Mark as Paid */}
            {orders
              .filter((order: OrderType) => selectedItems.includes(order.id))
              .every((order: OrderType) => order.status === "Pending") && (
              <button onClick={handleMarkAsPaid} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Mark as Paid
              </button>
            )}
            {/* Mark as Completed */}
            {orders
              .filter((order: OrderType) => selectedItems.includes(order.id))
              .every((order: OrderType) => order.status === "Paid") && (
              <button onClick={handleMarkAsCompleted} className="bg-green-600 text-white px-4 py-2 rounded-lg">
                Mark as Completed
              </button>
            )}

            {/* Mark as Cancelled */}
            {orders
              .filter((order: OrderType) => selectedItems.includes(order.id))
              .every(
                (order: OrderType) =>
                  order.status !== "Completed" && order.status !== "Cancelled"
              ) && (
              <button onClick={handleMarkAsCancelled} className="bg-red-600 text-white px-4 py-2 rounded-lg">
                Mark as Cancelled
              </button>
            )}

            {/* Mark as Refunded */}
            {orders
              .filter((order: OrderType) => selectedItems.includes(order.id))
              .every((order: OrderType) => order.status === "Completed") && (
              <button onClick={handleMarkAsRefunded} className="bg-purple-600 text-white px-4 py-2 rounded-lg">
                Mark as Refunded
              </button>
            )}

            {/* Export CSV */}
            <button onClick={handleExportCSV} className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
              Export CSV
            </button>
          </div>
        )}
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {showCheckboxes && <TableCell className="w-12">&nbsp;</TableCell>}
                {/* Use displayId instead of id */}
                <TableCell isHeader className="text-left pl-4">
                  Order ID
                </TableCell>
                <TableCell isHeader className="text-right pr-4">
                  Total (₦)
                </TableCell>
                <TableCell isHeader className="text-left pl-4">
                  Status
                </TableCell>
                <TableCell isHeader className="text-left pl-4">
                  Created At
                </TableCell>
                <TableCell isHeader className="text-left pl-4">
                  Products
                </TableCell>
                <TableCell isHeader className="text-left pl-4">
                  Invoice
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {orders.map((order: OrderType) => (
                <TableRow key={order.id}>
                  {showCheckboxes && (
                    <TableCell className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(order.id)}
                        onChange={() => toggleSelection(order.id)}
                      />
                    </TableCell>
                  )}
                  {/* Use displayId instead of id */}
                  <TableCell className="px-4 py-3 text-left">{order.displayId}</TableCell>
                  <TableCell className="px-4 py-3 text-right">₦{order.total.toLocaleString()}</TableCell>
                  <TableCell className="px-4 py-3 text-left">
                    <Badge
                      size="sm"
                      variant="light"
                      color={
                        order.status === "Completed"
                          ? "success"
                          : order.status === "Pending"
                          ? "warning"
                          : order.status === "Refunded"
                          ? "info"
                          : order.status === "Paid"
                          ? "primary"
                          : "error"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-left">
                    {new Date(Number(order.createdAt)).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-left">
                    <div className="flex -space-x-2">
                      {order.orderItems.map((item: OrderItemType, idx: number) => {
                        let imageUrl = "/images/default.jpg"; // Default fallback

                        if (item?.product?.images?.[0]) {
                          imageUrl = item.product.images[0];
                        } else if (item?.collection?.images?.[0]) {
                          imageUrl = item.collection.images[0];
                        }

                        return (
                          <Image
                            key={idx}
                            width={30}
                            height={30}
                            src={imageUrl}
                            alt="Product or Collection"
                            className="rounded-full border"
                          />
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-left">
                    {/* Use displayId instead of id for the download link */}
                    <a
                      href={`/uploads/records/invoices/invoice-${order.displayId}.pdf`}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Download
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}