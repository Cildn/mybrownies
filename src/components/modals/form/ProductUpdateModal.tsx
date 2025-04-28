"use client";
import React, { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/select/SelectField";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_PRODUCT } from "@/lib/graphql/mutations/product";
import { GET_CATEGORIES } from "@/lib/graphql/queries/categories";
import { GET_PRODUCT_TYPES } from "@/lib/graphql/queries/productTypes";
import Alert from "@/components/ui/alert/Alert";

interface ProductUpdateModalProps {
  onClose: () => void;
  initialData: Product;
  onSubmitSuccess: () => void;
}

interface Product {
  id: string;
  name: string;
  description: string;
  additionalInfo: string;
  discountRate: number;
  typeId: string;
  brand: string;
  stock: number;
  categoryId: string;
  images: string[];
  videos: string[];
  materials: string[];
  sizes: string[];
  colors: string[];
  isFeatured: boolean;
  prices: number[];
}

export default function ProductUpdateModal({
  onClose,
  initialData,
  onSubmitSuccess,
}: ProductUpdateModalProps) {
  const [state, setState] = useState({
    productName: initialData.name || "",
    productDescription: initialData.description || "",
    additionalInfo: initialData.additionalInfo || "",
    discountRate: initialData.discountRate || 0,
    productType: initialData.typeId || "",
    brand: initialData.brand || "",
    stock: initialData.stock || 0,
    categoryId: initialData.categoryId || "",
    images: initialData.images || [],
    videos: initialData.videos || [],
    materials: initialData.materials || [],
    colors: initialData.colors || [],
    isFeatured: initialData.isFeatured ? "Yes" : "No",
    sizePricePairs: initialData.sizes.map((size, index) => ({
      size,
      price: initialData.prices[index] ?? 0,
    })),
  });

  const [alert, setAlert] = useState<null | {
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  }>(null);

  const { data: productTypesData } = useQuery(GET_PRODUCT_TYPES);
  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  const productTypes = productTypesData?.productTypes || [];
  const categories = categoriesData?.categories || [];

  const [updateProduct] = useMutation(UPDATE_PRODUCT);

  useEffect(() => {
    if (!initialData) return;
    setState({
      productName: initialData.name || "",
      productDescription: initialData.description || "",
      additionalInfo: initialData.additionalInfo || "",
      discountRate: initialData.discountRate || 0,
      productType: initialData.typeId || "",
      brand: initialData.brand || "",
      stock: initialData.stock || 0,
      categoryId: initialData.categoryId || "",
      images: initialData.images || [],
      videos: initialData.videos || [],
      materials: initialData.materials || [],
      colors: initialData.colors || [],
      isFeatured: initialData.isFeatured ? "Yes" : "No",
      sizePricePairs: initialData.sizes.map((size, index) => ({
        size,
        price: initialData.prices[index] ?? 0,
      })),
    });
  }, [initialData]);

  const handleChange = (key: keyof typeof state, value: any) => {
    setState((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleCommaSeparatedInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof typeof state
  ) => {
    const value = e.target.value;
    const items = value.split(",").map((item) => item.trim());
    handleChange(key, items);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Extract sizes and prices from pairs
    const sizes = state.sizePricePairs.map((pair) => pair.size);
    const prices = state.sizePricePairs.map((pair) => pair.price);

    // Construct full paths for images and videos
    const imagePaths = state.images.map((filename) => `/uploads/products/images/${filename}`);
    const videoPaths = state.videos.map((filename) => `/uploads/products/videos/${filename}`);

    // Prepare the input object for the mutation
    const input = {
      name: state.productName || undefined,
      description: state.productDescription || undefined,
      additionalInfo: state.additionalInfo || undefined,
      discountRate: state.discountRate || undefined,
      typeId: state.productType || undefined,
      brand: state.brand || undefined,
      stock: state.stock || undefined,
      categoryId: state.categoryId || undefined,
      images: imagePaths.length > 0 ? imagePaths : undefined,
      videos: videoPaths.length > 0 ? videoPaths : undefined,
      materials: state.materials.length > 0 ? state.materials : undefined,
      sizes: sizes.length > 0 ? sizes : undefined,
      prices: prices.length > 0 ? prices : undefined,
      colors: state.colors.length > 0 ? state.colors : undefined,
      isFeatured: state.isFeatured === "Yes",
    };

    try {
      await updateProduct({
        variables: {
          id: initialData.id,
          input: input,
        },
      });

      setAlert({
        type: "success",
        title: "Success",
        message: "Product updated successfully!",
      });

      // Close the modal after successful update
      setTimeout(() => {
        onClose();
        onSubmitSuccess();
      }, 3000);
    } catch (err) {
      console.error("Error updating product:", err);
      setAlert({
        type: "error",
        title: "Error",
        message: "Failed to update product. Please try again.",
      });
    }
  };

  // Clear alert after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <ComponentCard title="Update Product">
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Product Details
        </h4>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          {/* Product Name */}
          <div className="col-span-1 sm:col-span-2">
            <Label>Product Name ({state.productName})</Label>
            <Input
              type="text"
              placeholder="Enter product name"
              value={state.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
            />
          </div>

          {/* Product Description */}
          <div className="col-span-1 sm:col-span-2">
            <Label>Product Description</Label>
            <TextArea
              value={state.productDescription}
              onChange={(value) => handleChange("productDescription", value)}
              placeholder="Enter product description"
            />
          </div>

          {/* Additional Info */}
          <div className="col-span-1 sm:col-span-2">
            <Label>Additional Info</Label>
            <TextArea
              value={state.additionalInfo}
              onChange={(value) => handleChange("additionalInfo", value)}
              placeholder="Enter any additional information about the product"
            />
          </div>

          {/* Discount Rate */}
          <div className="col-span-1">
            <Label>Discount Rate ({state.discountRate}%)</Label>
            <Input
              type="number"
              placeholder="Enter discount rate (e.g., 10 for 10%)"
              value={state.discountRate}
              onChange={(e) =>
                handleChange("discountRate", parseFloat(e.target.value))
              }
            />
          </div>

          {/* Product Type */}
          <div className="col-span-1 sm:col-span-2">
            <Label>Product Type</Label>
            <Select
              options={productTypes.map((type) => ({
                label: type.name || "N/A",
                value: type.id || "",
              }))}
              placeholder="Select product type"
              value={state.productType}
              onChange={(val) => handleChange("productType", val)}
            />
          </div>

          {/* Category */}
          <div className="col-span-1 sm:col-span-2">
            <Label>Category</Label>
            <Select
              options={categories.map((category) => ({
                label: category.name || "N/A",
                value: category.id || "",
              }))}
              placeholder="Select category"
              value={state.categoryId}
              onChange={(val) => handleChange("categoryId", val)}
            />
          </div>

          {/* Brand */}
          <div className="col-span-1">
            <Label>Brand ({state.brand})</Label>
            <Input
              type="text"
              placeholder="Enter brand"
              value={state.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
            />
          </div>

          {/* Stock */}
          <div className="col-span-1">
            <Label>Stock</Label>
            <Input
              type="number"
              placeholder="Enter stock"
              value={state.stock}
              onChange={(e) => handleChange("stock", parseInt(e.target.value))}
            />
          </div>

          {/* Images */}
          <div className="col-span-1 sm:col-span-2">
            <Label>Images (comma-separated filenames)</Label>
            <Input
              type="text"
              placeholder="Enter image filenames (e.g., image1.jpg, image2.png)"
              value={state.images.join(", ")}
              onChange={(e) => handleCommaSeparatedInput(e, "images")}
            />
          </div>

          {/* Videos */}
          <div className="col-span-1 sm:col-span-2">
            <Label>Videos (comma-separated filenames)</Label>
            <Input
              type="text"
              placeholder="Enter video filenames (e.g., video1.mp4, video2.mp4)"
              value={state.videos.join(", ")}
              onChange={(e) => handleCommaSeparatedInput(e, "videos")}
            />
          </div>

          {/* Materials */}
          <div className="col-span-1 sm:col-span-2">
            <Label>Materials</Label>
            <Input
              type="text"
              placeholder="Enter materials (comma-separated)"
              value={state.materials.join(", ")}
              onChange={(e) => handleCommaSeparatedInput(e, "materials")}
            />
          </div>

          {/* Colors */}
          <div className="col-span-1 sm:col-span-2">
            <Label>Colors</Label>
            <Input
              type="text"
              placeholder="Enter colors (comma-separated)"
              value={state.colors.join(", ")}
              onChange={(e) => handleCommaSeparatedInput(e, "colors")}
            />
          </div>

          {/* Sizes and Prices */}
          <div className="col-span-1 sm:col-span-2">
            <Label>Sizes and Prices</Label>
            {state.sizePricePairs.map((pair, index) => (
              <div key={index} className="flex gap-3 mb-3 items-center">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Size (e.g., S)"
                    value={pair.size}
                    onChange={(e) => {
                      const updatedPairs = [...state.sizePricePairs];
                      updatedPairs[index].size = e.target.value;
                      handleChange("sizePricePairs", updatedPairs);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Price"
                    value={pair.price}
                    onChange={(e) => {
                      const updatedPairs = [...state.sizePricePairs];
                      updatedPairs[index].price = parseFloat(e.target.value);
                      handleChange("sizePricePairs", updatedPairs);
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => {
                  setState((prevState) => ({
                    ...prevState,
                    sizePricePairs: [...prevState.sizePricePairs, { size: "", price: 0 }],
                  }));
                }}
              >
                Add Size and Price
              </Button>
            </div>
          </div>

          {/* Is Featured */}
          <div className="col-span-1 sm:col-span-2">
            <Label>Is Featured</Label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isFeatured"
                  value="Yes"
                  checked={state.isFeatured === "Yes"}
                  onChange={() => handleChange("isFeatured", "Yes")}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isFeatured"
                  value="No"
                  checked={state.isFeatured === "No"}
                  onChange={() => handleChange("isFeatured", "No")}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button size="sm" type="submit">
            Save Product
          </Button>
        </div>
      </form>

      {/* Alert */}
      {alert && (
        <Alert
          variant={alert.type}
          title={alert.title}
          message={alert.message}
          className="mt-4"
        />
      )}
    </ComponentCard>
  );
}