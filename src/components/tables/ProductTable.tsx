"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Eye, Trash2, Pencil } from "lucide-react";
import { Modal } from "../ui/modal";
import ProductFormModal from "../modals/form/ProductForm"; // Reuse this for create
import ConfirmationModal from "../modals/ConfirmationModal";
import ProductUpdateModal from "../modals/form/ProductUpdateModal";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PRODUCTS } from "@/lib/graphql/queries/products";
import { DELETE_PRODUCT } from "@/lib/graphql/mutations/product";
import Link from "next/link";

interface Product {
  id: string;
  displayId: string;
  name: string;
  description: string;
  additionalInfo: string;
  brand: string;
  discountRate: number;
  typeId: string;
  categoryId: string;
  category?: { name?: string };
  prices: number[]; // Updated from `price: string` to `prices: number[]`
  collections?: { name?: string }[];
  images: string[];
  videos: string[];
  materials: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  isFeatured: boolean;
}

export default function ProductTable() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  const defaultProduct: Product = {
    id: "",
    displayId: "",
    name: "",
    description: "",
    additionalInfo: "",
    brand: "",
    discountRate: 0,
    typeId: "",
    categoryId: "",
    category: { name: "" },
    prices: [],
    collections: [],
    images: [],
    videos: [],
    materials: [],
    sizes: [],
    colors: [],
    stock: 0,
    isFeatured: false,
  };
  
  useEffect(() => {
    if (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products. Please try again.");
    }
  }, [error]);

  const tableData: Product[] = data?.products || [];

  const toggleSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCheckboxes = () => {
    setShowCheckboxes(!showCheckboxes);
    setSelectedItems([]); // Reset selection when toggling
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openUpdateModal = (id: string) => {
    setSelectedProductId(id); // Track selected product ID
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => setIsUpdateModalOpen(false);

  const openConfirmationModal = (id: string) => {
    setItemToDelete(id);
    setIsConfirmationOpen(true);
  };

  const closeConfirmationModal = () => {
    setItemToDelete(null);
    setIsConfirmationOpen(false);
  };

  const handleProductCreated = () => {
    closeCreateModal();
    refetch(); // Refetch products to update the table
  };

  const handleProductUpdated = () => {
    closeUpdateModal();
    refetch(); // Refetch products to update the table
  };

  const handleDeleteConfirmed = async () => {
    if (!itemToDelete) return;
    try {
      await deleteProduct({ variables: { id: itemToDelete } });
      refetch();
      closeConfirmationModal();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:px-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Select Button */}
        <button
          onClick={toggleCheckboxes}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Select
        </button>
        {/* Dynamic Buttons */}
        <div className="flex items-center gap-3">
          {selectedItems.length > 0 ? (
            <button
              onClick={() => openConfirmationModal(selectedItems[0])}
              className="inline-flex items-center gap-2 bg-red-500 px-4 py-2 text-white rounded-md hover:bg-red-600 transition"
            >
              <Trash2 size={16} /> Delete
            </button>
          ) : (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-blue-500 px-4 py-2 text-white rounded-md hover:bg-blue-600 transition"
            >
              Create Product
            </button>
          )}
        </div>
      </div>
      {/* Table Section */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-200 dark:border-gray-800">
            <TableRow>
              {showCheckboxes && <TableCell className="w-12">&nbsp;</TableCell>}
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start dark:text-gray-400"
              >
                Actions
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start dark:text-gray-400"
              >
                ID
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start dark:text-gray-400"
              >
                Products
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start dark:text-gray-400"
              >
                Category
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start dark:text-gray-400"
              >
                Collection
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start dark:text-gray-400"
              >
                Price
              </TableCell>
            </TableRow>
          </TableHeader>
          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((product) => (
              <TableRow
                key={product.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                {showCheckboxes && (
                  <TableCell className="w-12">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      checked={selectedItems.includes(product.id)}
                      onChange={() => toggleSelection(product.id)}
                    />
                  </TableCell>
                )}
                <TableCell className="py-3 pr-5 w-10 text-gray-500 text-theme-sm dark:text-gray-400">
                  <div className="flex justify-between">
                    <button className="text-blue-500 hover:text-blue-700">
                      <Link href={`inventory/preview/products/${product.id}`} passHref>
                        <Eye size={16} />
                      </Link>
                    </button>
                    <button
                      className="text-green-500 hover:text-green-700 mx-2"
                      onClick={() => openUpdateModal(product.id)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => openConfirmationModal(product.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.displayId}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.name}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.category?.name || "N/A"}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <span className="text-gray-500 dark:text-gray-400">
                    {product.collections?.map((collection) => collection.name).join(", ") ||
                      "N/A"}
                  </span>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {/* Display the first price from the prices array */}
                  {product.prices.length > 0 ? `$${product.prices[0].toFixed(2)}` : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Create Product Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        className="w-full h-full fixed top-0 left-0 bg-white dark:bg-gray-900 p-5 lg:p-10 overflow-auto"
      >
        <ProductFormModal onClose={handleProductCreated} />
      </Modal>
      {/* Update Product Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        className="w-full h-full fixed top-0 left-0 bg-white dark:bg-gray-900 p-5 lg:p-10 overflow-auto"
      >
        {selectedProductId && (
          <ProductUpdateModal
            onClose={handleProductUpdated}
            initialData={tableData.find((p) => p.id === selectedProductId) || defaultProduct}
            onSubmitSuccess={handleProductUpdated}
          />
        )}
      </Modal>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        closeModal={closeConfirmationModal}
        onConfirm={handleDeleteConfirmed}
        actionType="DELETE"
      />
    </div>
  );
}