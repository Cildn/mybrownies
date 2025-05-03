import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/select/SelectField";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_PRODUCT } from "@/lib/graphql/mutations/product";
import { GET_PRODUCT_TYPES } from "@/lib/graphql/queries/productTypes";
import { GET_CATEGORIES } from "@/lib/graphql/queries/categories";
import Alert from "@/components/ui/alert/Alert";
import { ProductType, Category } from "@/types";

interface ProductFormModalProps {
  onClose: () => void; // Renamed from onClose
}

export default function ProductFormModal({ onClose }: ProductFormModalProps) {
  // State for form data
  const [state, setState] = useState({
    productName: "",
    productDescription: "",
    additionalInfo: "",
    discountRate: 0,
    productType: "",
    brand: "",
    stock: 0,
    categoryId: "",
    images: [] as string[],
    videos: [] as string[],
    materials: [] as string[],
    sizes: [] as string[],
    prices: [] as number[],
    colors: [] as string[],
    isFeatured: "No",
    sizePricePairs: [] as { size: string; price: number }[],
  });

  // State for alerts
  const [alert, setAlert] = useState<null | {
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  }>(null);

  // Fetch Product Types
  const { data: productTypesData } = useQuery(GET_PRODUCT_TYPES);
  const productTypes = productTypesData?.productTypes || [];

  // Fetch Categories
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const categories = categoriesData?.categories || [];

  // Mutation for creating a product
  const [createProduct, { loading }] = useMutation(CREATE_PRODUCT);

  // Handle input changes
  const handleChange = (key: keyof typeof state, value: string | number | string[]) => {
    setState((prevState) => ({ ...prevState, [key]: value }));
  };

  // Helper function to split comma-separated strings into arrays
  const handleCommaSeparatedInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof typeof state
  ) => {
    const value = e.target.value;
    const items = value.split(",").map((item) => item.trim());
    handleChange(key, items);
  };

  // Add a new size and price pair dynamically
  const addSizePricePair = () => {
    setState((prevState) => ({
      ...prevState,
      sizePricePairs: [...prevState.sizePricePairs, { size: "", price: 0 }],
    }));
  };

  // Update size in sizePricePairs
  const handleSizeChange = (index: number, size: string) => {
    setState((prevState) => ({
      ...prevState,
      sizePricePairs: prevState.sizePricePairs.map((pair, i) =>
        i === index ? { ...pair, size } : pair
      ),
    }));
  };

  // Update price in sizePricePairs
  const handlePriceChange = (index: number, price: number) => {
    setState((prevState) => ({
      ...prevState,
      sizePricePairs: prevState.sizePricePairs.map((pair, i) =>
        i === index ? { ...pair, price } : pair
      ),
    }));
  };

  // Remove sizePricePair
  const removeSizePricePair = (index: number) => {
    setState((prevState) => ({
      ...prevState,
      sizePricePairs: prevState.sizePricePairs.filter((_, i) => i !== index),
    }));
  };

  // Handle saving the product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imagePaths = state.images.map((filename) => `/uploads/products/images/${filename}`);
    const videoPaths = state.videos.map((filename) => `/uploads/products/videos/${filename}`);

    // Validate required fields
    if (!state.productName || !state.stock || !state.categoryId || state.images.length === 0) {
      setAlert({
        type: "error",
        title: "Validation Error",
        message: "Please fill all required fields!",
      });
      return;
    }

    try {
      await createProduct({
        variables: {
          name: state.productName,
          description: state.productDescription,
          additionalInfo: state.additionalInfo,
          discountRate: state.discountRate,
          typeId: state.productType,
          brand: state.brand,
          stock: state.stock,
          categoryId: state.categoryId,
          images: imagePaths,
          videos: videoPaths,
          materials: state.materials,
          sizes: state.sizePricePairs.map((pair) => pair.size),
          prices: state.sizePricePairs.map((pair) => pair.price),
          colors: state.colors,
          isFeatured: state.isFeatured === "Yes",
        },
      });

      setAlert({
        type: "success",
        title: "Success",
        message: "Product created successfully!",
      });

      // Close the modal after successful creation
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error("Error creating product:", err);
      setAlert({
        type: "error",
        title: "Error",
        message: "Failed to create product. Please try again.",
      });
    }
  };

  // Clear alert after 5 seconds
  const handleAlertClose = () => {
    setAlert(null);
  };

  React.useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        handleAlertClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <ComponentCard title="Create Product">
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Product Details
        </h4>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          {/* Product Name */}
          <div className="col-span-1 sm:col-span-2">
            <Label>Product Name</Label>
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
            <Label>Discount Rate (%)</Label>
            <Input
              type="number"
              placeholder="Enter discount rate (e.g., 10 for 10%)"
              value={isNaN(state.discountRate) ? "" : state.discountRate}
              onChange={(e) => {
                const value = e.target.value;
                handleChange("discountRate", value === "" ? 0 : parseFloat(value));
              }}
            />
          </div>

          {/* Brand */}
          <div className="col-span-1">
            <Label>Brand</Label>
            <Input
              type="text"
              placeholder="Enter brand"
              value={state.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
            />
          </div>

          {/* Product Type */}
          <div className="col-span-1 sm:col-span-2">
            <Label>Product Type</Label>
            <Select
              options={productTypes.map((type: ProductType) => ({
                label: type.name,
                value: type.id,
              }))}
              placeholder="Select product type"
              onChange={(val) => handleChange("productType", val)}
            />
          </div>

          {/* Category */}
          <div className="col-span-1 sm:col-span-2">
            <Label>Category</Label>
            <Select
              options={categories.map((category: Category) => ({
                label: category.name,
                value: category.id,
              }))}
              placeholder="Select category"
              onChange={(val) => handleChange("categoryId", val)}
            />
          </div>

          {/* Stock */}
          <div className="col-span-1">
            <Label>Stock</Label>
            <Input
              type="number"
              placeholder="Enter stock"
              value={isNaN(state.stock) ? "" : state.stock}
              onChange={(e) => {
                const value = e.target.value;
                handleChange("stock", value === "" ? 0 : parseInt(value, 10));
              }}
            />
          </div>

          {/* Images */}
          <div className="col-span-1 sm:col-span-2">
            <Label>Images (comma-separated filenames)</Label>
            <Input
              type="text"
              placeholder="image1.jpg, image2.png"
              value={state.images.join(", ")}
              onChange={(e) => {
                const filenames = e.target.value.split(",").map((name) => name.trim());
                handleChange("images", filenames);
              }}
            />
          </div>

          {/* Videos */}
          <div className="col-span-1 sm:col-span-2">
            <Label>Videos (comma-separated filenames)</Label>
            <Input
              type="text"
              placeholder="video1.mp4"
              value={state.videos.join(", ")}
              onChange={(e) => {
                const filenames = e.target.value.split(",").map((name) => name.trim());
                handleChange("videos", filenames);
              }}
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
                    onChange={(e) => handleSizeChange(index, e.target.value)}
                  />
                </div>
                <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Price"
                  value={isNaN(pair.price) ? "" : pair.price}
                  onChange={(e) => {
                    const value = e.target.value;
                    handlePriceChange(index, value === "" ? 0 : parseFloat(value));
                  }}
                />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeSizePricePair(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={addSizePricePair}
                type = "button"
              >
                Add Size and Price
              </button>
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
          <Button size="sm" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>

      {/* Alert */}
      {alert && (
        <Alert
          variant={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={handleAlertClose}
        />
      )}
    </ComponentCard>
  );
}