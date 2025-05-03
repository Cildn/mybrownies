"use client";
import React, { useState, useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Tabs, Tab } from "@/components/ui/tabs/Tabs";
import { Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client";
import {
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "@/lib/graphql/mutations/categories";
import { GET_PRODUCT_TYPES } from "@/lib/graphql/queries/productTypes";
import { GET_CATEGORIES } from "@/lib/graphql/queries/categories";
import {
  CREATE_PRODUCT_TYPE,
  UPDATE_PRODUCT_TYPE,
  DELETE_PRODUCT_TYPE,
} from "@/lib/graphql/mutations/productTypes";
import { useModal } from "@/lib/hooks/useModal";
import SharedUpdateModal from "@/components/modals/SharedUpdateModal";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import type { ProductType, Category } from "@/types";
import Image from "next/image";

const settingsCategories = ["Product Types & Pricing", "Product Categories"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(settingsCategories[0]);
  const { isOpen, openModal, closeModal } = useModal();
  const [editingItem, setEditingItem] = useState<ProductType | Category | null>(null);
  const [mutationType, setMutationType] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<"UPDATE" | "DELETE" | null>(null);
  const [itemId, setItemId] = useState<string>("");
  const [itemType, setItemType] = useState<"productType" | "category">("productType");

  // Product Types State
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [newType, setNewType] = useState("");
  const [newRate, setNewRate] = useState("");

  // Categories State
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState("");
  const [newCategoryVideo, setNewCategoryVideo] = useState("");

  // Queries and Mutations
  const { data: productTypesData } = useQuery(GET_PRODUCT_TYPES);
  const [createProductType] = useMutation(CREATE_PRODUCT_TYPE);
  const [deleteProductType] = useMutation(DELETE_PRODUCT_TYPE);

  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const [createCategory] = useMutation(CREATE_CATEGORY);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);

  useEffect(() => {
    if (productTypesData) {
      setProductTypes(productTypesData.productTypes);
    }
  }, [productTypesData]);

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData.categories);
    }
  }, [categoriesData]);

  // Confirmation handler
  const confirmAction = (
    action: "UPDATE" | "DELETE",
    itemId: string,
    itemType: "productType" | "category"
  ) => {
    setCurrentAction(action);
    setItemId(itemId);
    setItemType(itemType);
    setConfirmationOpen(true);
  };

  // Trigger Update Modal after confirmation
  const triggerUpdateModal = (item: ProductType | Category, type: "productType" | "category") => {
    setEditingItem(item);
    setMutationType(type);
    openModal();
  };

  // Product Type Operations
  const addProductType = async () => {
    if (newType.trim() && newRate.trim()) {
      try {
        const { data } = await createProductType({
          variables: {
            name: newType,
            percentageRate: parseFloat(newRate),
          },
        });
        setProductTypes((prev) => [...prev, data.createProductType as ProductType]);
        setNewType("");
        setNewRate("");
      } catch (err) {
        console.error("Error creating product type:", err);
        alert("Failed to create product type. Please try again.");
      }
    }
  };

  const removeProductType = (id: string) => {
    confirmAction("DELETE", id, "productType");
  };

  // Category Operations
  const addCategory = async () => {
    if (!newCategory.trim()) {
      alert("Category name cannot be empty!");
      return;
    }

    // Construct the full image and video paths
    const basePath = "/uploads/categories";
    const categoryName = newCategory.toLowerCase().replace(/\s+/g, '-');
    const fullImagePath = `${basePath}/${categoryName}/images/${newCategoryImage}`;
    const fullVideoPath = `${basePath}/${categoryName}/videos/${newCategoryVideo}`;

    try {
      const { data } = await createCategory({
        variables: {
          name: newCategory,
          image: fullImagePath,
          video: fullVideoPath,
        },
      });

      setCategories((prev) => [...prev, data.createCategory as Category]);
      setNewCategory("");
      setNewCategoryImage("");
      setNewCategoryVideo("");
    } catch (err) {
      console.error("Error creating category:", err);
      alert("Failed to create category. Please try again.");
    }
  };

  const removeCategory = (id: string) => {
    confirmAction("DELETE", id, "category");
  };

  const openEditModal = (
    item: ProductType | Category,
    type: "productType" | "category"
  ) => {
    confirmAction("UPDATE", item.id, type);
  };

  const handleConfirmedAction = async () => {
    try {
      if (currentAction === "DELETE") {
        if (itemType === "productType") {
          await deleteProductType({ variables: { id: itemId } });
          setProductTypes((prev) => prev.filter((type: ProductType) => type.id !== itemId));
        } else if (itemType === "category") {
          await deleteCategory({ variables: { id: itemId } });
          setCategories((prev) => prev.filter((cat: Category) => cat.id !== itemId));
        }
      } else if (currentAction === "UPDATE") {
        const itemToUpdate = itemType === "productType"
          ? productTypes.find((type: ProductType) => type.id === itemId)
          : categories.find((cat: Category) => cat.id === itemId);
        triggerUpdateModal(itemToUpdate!, itemType); // Added non-null assertion
      }
    } catch (err) {
      console.error("Error during action:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setConfirmationOpen(false);
    }
  };

  const renderTabContent = () => {
    if (activeTab === "Product Types & Pricing") {
      return (
        <ProductSettings
          items={productTypes}
          newType={newType}
          setNewType={setNewType}
          newRate={newRate}
          setNewRate={setNewRate}
          addProductType={addProductType}
          removeProductType={removeProductType}
          openEditModal={openEditModal as (item: { id: string; name: string; percentageRate: number }, type: "productType" | "category") => void}
        />
      );
    }
    return (
      <CategorySettings
        items={categories}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        newCategoryImage={newCategoryImage}
        setNewCategoryImage={setNewCategoryImage}
        newCategoryVideo={newCategoryVideo}
        setNewCategoryVideo={setNewCategoryVideo}
        addCategory={addCategory}
        removeCategory={removeCategory}
        openEditModal={openEditModal}
      />
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Settings
      </h2>
      <Tabs value={activeTab} onChange={setActiveTab}>
        {settingsCategories.map((category) => (
          <Tab key={category} value={category}>
            {category}
          </Tab>
        ))}
      </Tabs>
      <div className="mt-6">{renderTabContent()}</div>

      {/* Shared Update Modal */}
      {isOpen && editingItem && (
        <SharedUpdateModal
          closeModal={closeModal}
          item={editingItem}
          mutation={mutationType === "productType" ? UPDATE_PRODUCT_TYPE : UPDATE_CATEGORY}
          fields={
            mutationType === "productType"
              ? {
                  name: {
                    label: "Product Type",
                    type: "text",
                    placeholder: "Enter type (e.g., Premium)",
                  },
                  percentageRate: {
                    label: "Percentage Rate (%)",
                    type: "number",
                    placeholder: "Enter rate",
                  },
                }
              : {
                  name: {
                    label: "Category Name",
                    type: "text",
                    placeholder: "Enter category name",
                  },
                  image: {
                    label: "Category Image URL",
                    type: "text",
                    placeholder: "Enter image URL",
                  },
                  video: {
                    label: "Category Video URL",
                    type: "text",
                    placeholder: "Enter video URL",
                  },
                }
          }
          onSubmitSuccess={() => {
            if (mutationType === "productType") {
              setProductTypes((prev) =>
                prev.map((type: ProductType) => 
                  type.id === editingItem?.id ? (editingItem as ProductType) : type
                )
              );
            } else {
              setCategories((prev) =>
                prev.map((cat: Category) => 
                  cat.id === editingItem?.id ? (editingItem as Category) : cat
                )
              );
            }
          }}
        />
      )}

      {/* Confirmation Modal */}
      {confirmationOpen && currentAction && (
        <ConfirmationModal
          isOpen={confirmationOpen}
          closeModalAction={() => setConfirmationOpen(false)}
          onConfirmAction={handleConfirmedAction}
          actionType={currentAction}
        />
      )}
    </div>
  );
}

// Subcomponent: ProductSettings
interface SettingsProps<T> {
  items: T[];
  newType: string;
  setNewType: (value: string) => void;
  newRate: string;
  setNewRate: (value: string) => void;
  addProductType: () => Promise<void>;
  removeProductType: (id: string) => void;
  openEditModal: (item: T, type: "productType" | "category") => void;
}

function ProductSettings({
  items,
  newType,
  setNewType,
  newRate,
  setNewRate,
  addProductType,
  removeProductType,
  openEditModal,
}: SettingsProps<{ id: string; name: string; percentageRate: number }>) {
  return (
    <ComponentCard title="Product Types & Pricing">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Product Type</Label>
          <Input
            type="text"
            placeholder="Enter type (e.g., Premium)"
            defaultValue={newType}
            onChange={(e) => setNewType(e.target.value)}
          />
        </div>
        <div>
          <Label>Percentage Rate (%)</Label>
          <Input
            type="number"
            placeholder="Enter rate"
            defaultValue={newRate}
            onChange={(e) => setNewRate(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-4">
        <Button size="sm" onClick={addProductType}>Add Type</Button>
      </div>
      <div className="mt-6">
        <h4 className="text-lg font-medium">Existing Product Types</h4>
        <ul className="mt-2">
          {items.map((type) => (
            <li
              key={type.id}
              className="flex justify-between bg-gray-100 px-4 py-2 rounded-lg mt-2 items-center"
            >
              <span>{type.name} - {type.percentageRate}%</span>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(type, "productType")}
                  className="text-green-500 hover:text-green-700"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => removeProductType(type.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ComponentCard>
  );
}

// Subcomponent: CategorySettings
interface CategorySettingsProps {
  items: { id: string; name: string; image: string; video: string }[];
  newCategory: string;
  setNewCategory: (value: string) => void;
  newCategoryImage: string;
  setNewCategoryImage: (value: string) => void;
  newCategoryVideo: string;
  setNewCategoryVideo: (value: string) => void;
  addCategory: () => Promise<void>;
  removeCategory: (id: string) => void;
  openEditModal: (item: { id: string; name: string; image: string; video: string }, type: "category") => void;
}

function CategorySettings({
  items,
  newCategory,
  setNewCategory,
  newCategoryImage,
  setNewCategoryImage,
  newCategoryVideo,
  setNewCategoryVideo,
  addCategory,
  removeCategory,
  openEditModal,
}: CategorySettingsProps) {
  return (
    <ComponentCard title="Product Categories">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>New Category</Label>
          <Input
            type="text"
            placeholder="Enter category (e.g., Footwear)"
            defaultValue={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </div>
        <div>
          <Label>Category Image Filename</Label>
          <Input
            type="text"
            placeholder="Enter image filename"
            defaultValue={newCategoryImage}
            onChange={(e) => setNewCategoryImage(e.target.value)}
          />
        </div>
        <div>
          <Label>Category Video Filename</Label>
          <Input
            type="text"
            placeholder="Enter video filename"
            defaultValue={newCategoryVideo}
            onChange={(e) => setNewCategoryVideo(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-4">
        <Button size="sm" onClick={addCategory}>Add Category</Button>
      </div>
      <div className="mt-6">
        <h4 className="text-lg font-medium">Existing Categories</h4>
        <ul className="mt-2">
          {items.map((category) => (
            <li
              key={category.id}
              className="flex justify-between bg-gray-100 px-4 py-2 rounded-lg mt-2 items-center"
            >
              <div>
                <span>{category.name}</span>
                <div>
                  {category.image && <Image src={category.image} alt={category.name} width={500} height={300} className="w-10 h-10 rounded" />}
                  {category.video && (
                    <a href={category.video} target="_blank" rel="noopener noreferrer">
                      View Video
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(category as Category, "category")}
                  className="text-green-500 hover:text-green-700"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => removeCategory(category.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ComponentCard>
  );
}