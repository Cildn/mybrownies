"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Modal } from "../ui/modal";
import CollectionFormModal from "../modals/form/CollectionForm";
import CollectionUpdateModal from "../modals/form/CollectionUpdateModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import { useQuery, useMutation } from "@apollo/client";
import { DELETE_COLLECTION } from "@/lib/graphql/mutations/collections";
import { GET_COLLECTIONS } from "@/lib/graphql/queries/collections";
import Link from "next/link";

interface Collection {
  id: string;
  displayId: string;
  name: string;
  description: string;  // Make it optional if needed
  additionalInfo: string;  // Add other properties similarly
  discountRate: number;  // Add other properties similarly
  categoryId: string;
  productIds: string[];
  category?: { name?: string };
  price: number;
  products?: { name?: string }[];
  images: string[];
  videos: string[];
  status: string;
}

export default function CollectionTable() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const defaultCollection: Collection = {
    id: "",
    displayId: "",
    name: "",
    description: "",  // Add missing description
    additionalInfo: "", // Add missing additionalInfo
    discountRate: 0, // Add missing discountRate
    categoryId: "", // Add missing categoryId
    category: { name: "" },
    price: 0,
    products: [],
    images: [],
    videos: [],
    status: "active",
    productIds: [],
  };  

  // Fetch collections data
  const { loading, error, data, refetch } = useQuery(GET_COLLECTIONS);

  // Mutations for creating, updating, and deleting collections
  const [deleteCollection] = useMutation(DELETE_COLLECTION);

  useEffect(() => {
    if (error) {
      console.error("Error fetching collections:", error);
      alert("Failed to fetch collections. Please try again.");
    }
  }, [error]);

  const tableData: Collection[] = data?.collections || [];

  // Toggle row selection
  const toggleSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle checkboxes visibility
  const toggleCheckboxes = () => {
    setShowCheckboxes(!showCheckboxes);
    setSelectedItems([]); // Reset selection when toggling
  };

  // Open and close modals
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openConfirmationModal = (id: string) => {
    setItemToDelete(id);
    setIsConfirmationOpen(true);
  };

  const closeConfirmationModal = () => {
    setItemToDelete(null);
    setIsConfirmationOpen(false);
  };

  const openUpdateModal = (id: string) => {
    setSelectedCollectionId(id); // Track selected collection ID
    setIsUpdateModalOpen(true);
  };
  const closeUpdateModal = () => setIsUpdateModalOpen(false);

  // Handle collection update
  const handleCollectionUpdated = () => {
    closeUpdateModal();
    refetch(); // Refetch collections to update the table
  };

  // Handle deletion of a single collection
  const handleDeleteConfirmed = async () => {
    if (!itemToDelete) return;

    try {
      await deleteCollection({ variables: { id: itemToDelete } });
      refetch();
      closeConfirmationModal();
    } catch (err) {
      console.error("Error deleting collection:", err);
      alert("Failed to delete collection. Please try again.");
    }
  };

  // Handle deletion of selected collections
  const handleDeleteCollections = async () => {
    try {
      await Promise.all(
        selectedItems.map((id) =>
          deleteCollection({ variables: { id } })
        )
      );
      setSelectedItems([]);
      refetch(); // Refetch collections after deletion
    } catch (err) {
      console.error("Error deleting collections:", err);
      alert("Failed to delete collections. Please try again.");
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
              onClick={handleDeleteCollections}
              className="inline-flex items-center gap-2 bg-red-500 px-4 py-2 text-white rounded-md hover:bg-red-600 transition"
            >
              <Trash2 size={16} /> Delete
            </button>
          ) : (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-blue-500 px-4 py-2 text-white rounded-md hover:bg-blue-600 transition"
            >
              Create Collection
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
                Collection
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
                Products
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
            {tableData.map((collection) => (
              <TableRow
                key={collection.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                {showCheckboxes && (
                  <TableCell className="w-12">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      checked={selectedItems.includes(collection.id)}
                      onChange={() => toggleSelection(collection.id)}
                    />
                  </TableCell>
                )}
                <TableCell className="py-3 pr-5 w-10 text-gray-500 text-theme-sm dark:text-gray-400">
                  <div className="flex justify-between">
                    <button className="text-blue-500 hover:text-blue-700">
                      <Link href={`inventory/preview/collections/${collection.id}`} passHref>
                        <Eye size={16} />
                      </Link>
                    </button>
                    <button
                      className="text-green-500 hover:text-green-700 mx-2"
                      onClick={() => openUpdateModal(collection.id)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => openConfirmationModal(collection.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {collection.displayId}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {collection.name}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {collection.category?.name || "N/A"}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <span className="text-gray-500 dark:text-gray-400">
                    {collection.products?.map((product) => product.name).join(", ") || "N/A"}
                  </span>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {collection.price}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Collection Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        className="w-full h-full fixed top-0 left-0 bg-white dark:bg-gray-900 p-5 lg:p-10 overflow-auto"
      >
        <CollectionFormModal />
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        closeModal={closeConfirmationModal}
        onConfirm={handleDeleteConfirmed}
        actionType="DELETE"
      />

      {/* Update Collection Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        className="w-full h-full fixed top-0 left-0 bg-white dark:bg-gray-900 p-5 lg:p-10 overflow-auto"
      >
        {selectedCollectionId && (
          <CollectionUpdateModal
            onClose={closeUpdateModal}
            initialData={tableData.find((p) => p.id === selectedCollectionId) || defaultCollection}
            onSubmitSuccess={handleCollectionUpdated}
          />
        )}
      </Modal>
    </div>
  );
}