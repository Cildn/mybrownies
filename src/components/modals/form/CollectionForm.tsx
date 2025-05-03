"use client";
import React, { useState } from "react";
import { debounce } from 'lodash';
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/select/SelectField";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_COLLECTION } from "@/lib/graphql/mutations/collections";
import { GET_CATEGORIES } from "@/lib/graphql/queries/categories";
import { SEARCH_QUERY } from "@/lib/graphql/queries/search";
import { Product, Category } from "@/types";

export default function CollectionFormModal() {
  const [state, setState] = useState({
    collectionName: "",
    collectionDescription: "",
    additionalInfo: "",
    categoryId: "",
    selectedProducts: [] as { 
      id: string; 
      name: string; 
      size: string; 
      color: string; 
      price: number 
    }[],
    images: [] as string[],
    videos: [] as string[],
    discountRate: 0,
    status: "Active",
  });

  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const categories = categoriesData?.categories || [];

  const [searchTerm, setSearchTerm] = useState("");
  const { data: searchData } = useQuery(SEARCH_QUERY, {
    variables: { query: searchTerm },
    skip: !searchTerm,
  });
  const searchResults = searchData?.search.products || [] as Product[];

  const [createCollection, { loading }] = useMutation(CREATE_COLLECTION);

  // Track selected size for each product during selection
  const [selectedSize, setSelectedSize] = useState<{ [key: string]: number }>({});

  const handleChange = (key: keyof typeof state, value: string | number | string[]) => {
    setState((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleProductSelect = (productId: string, sizeIndex: number, colorIndex: number) => {
    const selectedProduct = searchResults.find((p: Product) => p.id === productId);
    if (!selectedProduct || !selectedProduct.prices || isNaN(selectedProduct.prices[sizeIndex])) {
      alert("Invalid product price. Please check the product details.");
      return;
    }

    const size = selectedProduct.sizes?.[sizeIndex] || "Unknown size";
    const color = selectedProduct.colors?.[colorIndex] || "No color specified";

    const isAlreadySelected = state.selectedProducts.some(
      (product) => product.id === productId && product.size === size && product.color === color
    );

    if (isAlreadySelected) {
      alert("This product, size, and color combination is already selected.");
      return;
    }

    setState((prevState) => ({
      ...prevState,
      selectedProducts: [
        ...prevState.selectedProducts,
        {
          id: selectedProduct.id,
          name: selectedProduct.name,
          size,
          color,
          price: selectedProduct.prices[sizeIndex],
        },
      ],
    }));
    setSearchTerm("");
    setSelectedSize(prev => ({ ...prev, [productId]: -1 })); // Reset selected size
  };

  const handleSizeSelect = (productId: string, sizeIndex: number) => {
    setSelectedSize(prev => ({ ...prev, [productId]: sizeIndex }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounce((term: string) => {
      setSearchTerm(term);
    }, 300)(e.target.value);
  };

  const removeProduct = (productId: string, size: string, color: string) => {
    setState((prevState) => ({
      ...prevState,
      selectedProducts: prevState.selectedProducts.filter(
        (product) => !(product.id === productId && product.size === size && product.color === color)
      ),
    }));
  };

  const calculateTotalPrice = () => {
    const total = state.selectedProducts.reduce((sum, product) => sum + product.price, 0);
    const discountedPrice = total * (1 - state.discountRate / 100);
    return parseFloat(discountedPrice.toFixed(2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imagePaths = state.images.map(filename => `/uploads/collections/images/${filename}`);
    const videoPaths = state.videos.map(filename => `/uploads/collections/videos/${filename}`);
    
    // Validate required fields
    if (
      !state.collectionName ||
      !state.categoryId ||
      state.selectedProducts.length === 0 ||
      state.images.length === 0
    ) {
      alert("Please fill all required fields!");
      return;
    }
  
    try {
      // Prepare productIds and productVariants
      const productIds = state.selectedProducts.map((p) => p.id);
      const productVariants = state.selectedProducts.map(
        (p) => `${p.name} - ${p.size} - ${p.color}`
      );
  
      // Log mutation variables for debugging
      console.log("Mutation Variables:", {
        name: state.collectionName,
        description: state.collectionDescription,
        additionalInfo: state.additionalInfo,
        discountRate: state.discountRate,
        categoryId: state.categoryId,
        productIds,
        productVariants,
        images: state.images,
        videos: state.videos,
        price: calculateTotalPrice(),
        status: state.status,
      });
  
      // Perform the mutation
      const { data, errors } = await createCollection({
        variables: {
          name: state.collectionName,
          description: state.collectionDescription,
          additionalInfo: state.additionalInfo,
          discountRate: state.discountRate,
          categoryId: state.categoryId,
          productIds,
          productVariants,
          images: imagePaths,
          videos: videoPaths,
          price: calculateTotalPrice(),
          status: state.status,
        },
      });
  
      // Handle response
      if (errors) {
        console.error("GraphQL errors:", errors);
        alert("Error creating collection: " + errors[0].message);
      } else if (data && data.createCollection) {
        alert("Collection created successfully!");
      } else {
        alert("Unexpected response from the server. Please check the logs.");
      }
    } catch (err) {
      console.error("Error creating collection:", err);
      if (err instanceof Error) {
        alert("Failed to create collection: " + err.message);
      } else {
        alert("Failed to create collection. Check server logs.");
      }
    }
  };

  return (
    <ComponentCard title="Create Collection">
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Collection Details
        </h4>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1 sm:col-span-2">
            <Label>Collection Name</Label>
            <Input
              type="text"
              placeholder="Enter collection name"
              value={state.collectionName}
              onChange={(e) => handleChange("collectionName", e.target.value)}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Collection Description</Label>
            <TextArea
              value={state.collectionDescription}
              onChange={(value) => handleChange("collectionDescription", value)}
              placeholder="Enter collection description"
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Additional Info</Label>
            <TextArea
              value={state.additionalInfo}
              onChange={(value) => handleChange("additionalInfo", value)}
              placeholder="Enter additional info"
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Category</Label>
            <Select
              options={categories.map((cat: Category) => ({
                label: cat.name,
                value: cat.id,
              })) || []}
              placeholder="Select category"
              value={state.categoryId}
              onChange={(val) => handleChange("categoryId", val)}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Search & Select Products</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded mt-1 max-h-60 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((product: Product) => (
                      <div key={product.id} className="px-4 py-2">
                        <div className="font-medium text-sm mb-2">{product.name}</div>
                        
                        <div className="flex gap-2 mb-2">
                          {product.sizes?.map((size: string, sizeIdx: number) => (
                            <button
                              key={sizeIdx}
                              type="button"
                              onClick={() => handleSizeSelect(product.id, sizeIdx)}
                              className={`bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full ${
                                selectedSize[product.id] === sizeIdx ? 'border-2 border-blue-500' : ''
                              }`}
                            >
                              {size} (${product.prices[sizeIdx] || 0})
                            </button>
                          )) || []}
                        </div>

                        {product.colors && product.colors.length > 0 && selectedSize[product.id] !== undefined && (
                          <div className="flex gap-2">
                            {product.colors.map((color: string, colorIdx: number) => (
                              <button
                                key={colorIdx}
                                type="button"
                                onClick={() => handleProductSelect(product.id, selectedSize[product.id], colorIdx)}
                                className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full"
                              >
                                {color}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No results found</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-2 flex flex-wrap gap-2">
              {state.selectedProducts.map((product) => (
                <div
                  key={`${product.id}-${product.size}-${product.color}`}
                  className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  <span>{product.name} - {product.size} - {product.color}</span>
                  <button
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => removeProduct(product.id, product.size, product.color)}
                    type="button"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Images (comma-separated filenames with their extensions)</Label>
            <Input
              type="text"
              placeholder="image1.jpg, image2.png"
              value={state.images.join(", ")}
              onChange={(e) => {
                const filenames = e.target.value.split(",").map((name) => name.trim());
                // Store raw filenames in state (e.g., ["image1.jpg", "image2.png"])
                handleChange("images", filenames); 
              }}
            />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <Label>Videos (comma-separated filenames with their extensions)</Label>
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
          <div className="col-span-1">
            <Label>Discount Rate (%)</Label>
            <Input
              type="number"
              placeholder="10"
              value={state.discountRate}
              onChange={(e) => handleChange("discountRate", parseInt(e.target.value))}
            />
          </div>
          <div className="col-span-1">
            <Label>Total Price</Label>
            <Input
              type="text"
              value={`$${calculateTotalPrice().toFixed(2)}`}
              disabled
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label>Status</Label>
            <Select
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
              placeholder="Select status"
              value={state.status}
              onChange={(val) => handleChange("status", val)}
            />
          </div>
        </div>
        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button size="sm" variant="primary" disabled={loading}>
            {loading ? "Saving..." : "Save Collection"}
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}