import React, { useState, useEffect } from "react";
import { debounce } from 'lodash';
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/select/SelectField";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_COLLECTION } from "@/lib/graphql/mutations/collections";
import { GET_CATEGORIES } from "@/lib/graphql/queries/categories";
import { SEARCH_QUERY } from "@/lib/graphql/queries/search";

interface CollectionUpdateModalProps {
  onClose: () => void;
  initialData: Collection;
  onSubmitSuccess: () => void;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  additionalInfo: string;
  discountRate: number;
  categoryId: string;
  productIds: string[];
  images: string[];
  videos: string[];
  price: number;
  status: string;
}

interface Product {
  id: string;
  name: string;
  prices: number[];
  sizes: string[] | null;
  colors: string[] | null;
}

interface Category {
  id: string;
  name: string;
}

export default function CollectionUpdateModal({
  onClose,
  initialData,
  onSubmitSuccess,
}: CollectionUpdateModalProps) {
  const [state, setState] = useState({
    collectionName: initialData.name || "",
    collectionDescription: initialData.description || "",
    additionalInfo: initialData.additionalInfo || "",
    categoryId: initialData.categoryId || "",
    selectedProducts: (initialData.productIds || []).map(id => ({ id, name: "", size: "", color: "", price: 0 })),
    images: initialData.images || [],
    videos: initialData.videos || [],
    discountRate: initialData.discountRate || 0,
    status: initialData.status || "Active",
  });

  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const categories = categoriesData?.categories || [];

  const [searchTerm, setSearchTerm] = useState("");
  const { data: searchData } = useQuery(SEARCH_QUERY, {
    variables: { query: searchTerm },
    skip: !searchTerm,
  });
  const searchResults = searchData?.search.products || [];

  const [updateCollection, { loading }] = useMutation(UPDATE_COLLECTION);

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

  useEffect(() => {
    if (!searchTerm) {
      setSearchTerm("");
    }
  }, [searchTerm]);

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

    try {
      const { data, errors } = await updateCollection({
        variables: {
          id: initialData.id,
          input: {
            name: state.collectionName,
            description: state.collectionDescription,
            additionalInfo: state.additionalInfo,
            categoryId: state.categoryId,
            productIds: state.selectedProducts.map((p) => p.id),
            images: imagePaths,
            videos: videoPaths,
            price: calculateTotalPrice(),
            discountRate: state.discountRate,
            status: state.status,
          },
        },
      });

      if (errors) {
        console.error("GraphQL errors:", errors);
        alert("Error updating collection: " + errors[0].message);
      } else if (data && data.updateCollection) {
        alert("Collection updated successfully!");
        if (typeof onClose === "function") {
          onClose(); // Call only if it's a function
        } else {
          console.error("onClose is not a function");
        }
      
        onSubmitSuccess();
      } else {
        console.error("Unexpected response from GraphQL mutation:", data);
        alert("Unexpected response from the server. Please check the logs.");
      }
    } catch (err) {
      console.error("Error updating collection:", err);
      if (err instanceof Error) {
        alert("Failed to update collection: " + err.message);
      } else {
        alert("Failed to update collection. Check server logs.");
      }
    }
  };

  return (
    <ComponentCard title="Update Collection">
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
              }))}
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
                  <span>{product.name} - {product.size}</span>
                  <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {product.color}
                  </span>
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
            <Label>Images (comma-separated filenames, e.g., &quot;image1.jpg, image2.png&quot;)</Label>
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

          <div className="col-span-1 sm:col-span-2">
            <Label>Videos (comma-separated filenames, e.g., &quot;video1.mp4&quot;)</Label>
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
              onChange={(e) => {
                const parsedValue = parseInt(e.target.value) || 0; // Parse and handle NaN
                handleChange("discountRate", parsedValue);
              }}
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
              options={[{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]}
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