"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useQuery, useMutation } from "@apollo/client";
import { GET_INVOICES, EXPORT_INVOICES_CSV } from "@/lib/graphql/queries/invoices";
import { MARK_INVOICE_AS_PAID } from "@/lib/graphql/mutations/invoices";
import Badge from "../ui/badge/Badge";
import { Pencil } from "lucide-react";

interface Invoice {
  id: string;
  displayId: string;
  createdAt: string;
  total: number;
  status: "Pending" | "Paid" | "Completed" | "Cancelled" | "Refunded";
}

export default function InvoiceTable() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const { data, loading, error } = useQuery(GET_INVOICES);
  const [markInvoiceAsPaid] = useMutation(MARK_INVOICE_AS_PAID);
  const [exportInvoicesCSV] = useMutation(EXPORT_INVOICES_CSV);

  const invoices = data?.orders || [];

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
        await markInvoiceAsPaid({ variables: { orderId: id } });
      }
      window.location.reload(); // Refresh to fetch updated statuses
    } catch (err) {
      console.error("Error marking invoices as paid:", err);
      alert("Failed to mark invoices as paid. Please try again.");
    }
  };

  const handleExportCSV = async () => {
    try {
      const { data } = await exportInvoicesCSV();
      if (data?.exportOrdersCSV.csvUrl) {
        window.open(data.exportOrdersCSV.csvUrl, "_blank");
      }
    } catch (err) {
      console.error("Error exporting invoices CSV:", err);
      alert("Failed to export invoices CSV. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading invoices</p>;

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
        <div className="flex items-center">
          {selectedItems.length > 0 ? (
            <button onClick={handleMarkAsPaid} className="ml-4 inline-flex items-center gap-2 bg-green-600 px-4 py-2 text-white rounded-lg hover:bg-green-700 transition">
              <Pencil size={16} /> Mark as Paid
            </button>
          ) : (
            <button onClick={handleExportCSV} className="ml-3 inline-flex items-center gap-2 bg-blue-600 px-4 py-2 text-white rounded-lg">
              Export CSV
            </button>
          )}
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {showCheckboxes && (
                  <TableCell className="w-12" />
                )}
                <TableCell isHeader className="text-left pl-4">
                  Invoice ID
                </TableCell>
                <TableCell isHeader className="text-left pl-4">
                  Due Date
                </TableCell>
                <TableCell isHeader className="text-right pr-4">
                  Total (₦)
                </TableCell>
                <TableCell isHeader className="text-left pl-4">
                  Status
                </TableCell>
                <TableCell isHeader className="text-left pl-4">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {invoices.map((invoice: Invoice) => (
                <TableRow key={invoice.id}>
                  {showCheckboxes && (
                    <TableCell className="w-12">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                        checked={selectedItems.includes(invoice.id)}
                        onChange={() => toggleSelection(invoice.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell className="px-4 py-3 text-left">
                    {invoice.displayId ? invoice.displayId.replace(/^ORD/, "INV") : "INV-N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-left">
                    {new Date(Number(invoice.createdAt)).toLocaleDateString('en-GB')}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    ₦{invoice.total.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-left">
                    <Badge
                      size="sm"
                      color={
                        invoice.status === "Paid"
                          ? "success"
                          : invoice.status === "Pending"
                          ? "warning"
                          : invoice.status === "Refunded"
                          ? "info"
                          : invoice.status === "Completed"
                          ? "primary"
                          : "error"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-left">
                    <a
                      href={`/uploads/records/invoices/invoice-${invoice.displayId}.pdf`}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      View Invoice
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