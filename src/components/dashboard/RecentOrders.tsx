"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_RECENT_ORDERS } from "@/lib/graphql/queries/orders";
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

export default function RecentOrdersTable() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);

  const { data, loading, error } = useQuery(GET_RECENT_ORDERS, {
    variables: { hoursAgo: 8 },
    fetchPolicy: "network-only",
  });

  const [markOrderAsPaid] = useMutation(MARK_ORDER_AS_PAID);
  const [markOrderAsCompleted] = useMutation(MARK_ORDER_AS_COMPLETED);
  const [markOrderAsRefunded] = useMutation(MARK_ORDER_AS_REFUNDED);
  const [markOrderAsCancelled] = useMutation(MARK_ORDER_AS_CANCELLED);

  const orders = data?.recentOrders || [];

  const toggleSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleCheckboxes = () => {
    setShowCheckboxes((v) => !v);
    setSelectedItems([]);
  };

  const batch = async (fn) => {
    try {
      for (const id of selectedItems) {
        // wrap orderId in `variables`
        await fn({ variables: { orderId: id } });
      }
      setSelectedItems([]);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Operation failed. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading orders</p>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={toggleCheckboxes}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Select
        </button>
        {selectedItems.length > 0 && (
          <div className="flex gap-3">
            {orders
              .filter((o) => selectedItems.includes(o.id))
              .every((o) => o.status === "Pending") && (
              <button
                onClick={() => batch(markOrderAsPaid)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Mark as Paid
              </button>
            )}
            {orders
              .filter((o) => selectedItems.includes(o.id))
              .every((o) => o.status === "Paid") && (
              <button
                onClick={() => batch(markOrderAsCompleted)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Mark as Completed
              </button>
            )}
            {orders
              .filter((o) => selectedItems.includes(o.id))
              .every((o) => o.status !== "Completed" && o.status !== "Cancelled") && (
              <button
                onClick={() => batch(markOrderAsCancelled)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Mark as Cancelled
              </button>
            )}
            {orders
              .filter((o) => selectedItems.includes(o.id))
              .every((o) => o.status === "Completed") && (
              <button
                onClick={() => batch(markOrderAsRefunded)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg"
              >
                Mark as Refunded
              </button>
            )}
          </div>
        )}
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {showCheckboxes && <TableCell className="w-12"></TableCell>}
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
              {orders.map((order: any) => (
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
                  <TableCell className="px-4 py-3 text-left">
                    {order.displayId}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    ₦{order.total.toLocaleString()}
                  </TableCell>
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
                    {new Date(order.createdAt).toLocaleString("en-GB")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-left">
                    <div className="flex -space-x-2">
                      {order.orderItems.map((item: any, idx: number) => {
                        let url = "/images/default.jpg";
                        if (item.product?.images?.length) url = item.product.images[0];
                        else if (item.collection?.image) url = item.collection.image;
                        return (
                          <Image
                            key={idx}
                            width={30}
                            height={30}
                            src={url}
                            alt=""
                            className="rounded-full border"
                          />
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-left">
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
