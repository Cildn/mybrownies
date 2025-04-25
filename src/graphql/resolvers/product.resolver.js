import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const productResolvers = {
  Query: {
    // Fetch all products with relations
    products: async () =>
      prisma.product.findMany({
        include: { category: true, collections: true, type: true },
      }),

    productsCount: (_, { filter }) => {
      // Logic to count products based on the filter (e.g., category)
      return db.products.count({ where: filter });
    },

    // Fetch a single product by ID
    product: async (_, { id }) =>
      prisma.product.findUnique({
        where: { id },
        include: { category: true, collections: true, type: true },
      }),

    // Fetch all product types
    productTypes: async () => prisma.productType.findMany(),

    // Fetch all categories
    categories: async () => prisma.category.findMany(),
  },

  Mutation: {
    createProduct: async (_, {
      name,
      description,
      additionalInfo,
      discountRate,
      typeId,
      brand,
      stock,
      categoryId,
      images,
      videos,
      materials,
      sizes,
      prices,
      colors,
      isFeatured,
    }) => {
      try {
        // Validate that sizes and prices have the same length
        if (sizes.length !== prices.length) {
          throw new Error("Sizes and prices must have the same number of elements.");
        }
    
        // Fetch the category to get its displayId and productCounter
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
        });
    
        if (!category) throw new Error("Category not found");
    
        // Generate the displayId
        const newCounter = category.productCounter + 1;
        const paddedCounter = String(newCounter).padStart(3, '0');
        const displayId = `PROD-${category.displayId}-${paddedCounter}`;
    
        // Update the category's productCounter
        await prisma.category.update({
          where: { id: categoryId },
          data: { productCounter: newCounter },
        });
    
        // Create the product with sizes and prices
        const product = await prisma.product.create({
          data: {
            displayId,
            name,
            description,
            additionalInfo,
            discountRate,
            typeId,
            brand,
            stock,
            categoryId,
            images,
            videos,
            materials,
            sizes,
            prices,
            colors,
            isFeatured,
          },
          include: { // Include the category in the response
            category: true,
          },
        });
    
        return product;
      } catch (error) {
        console.error("Error creating product:", error);
        throw new Error("Failed to create product");
      }
    },

    // Update product by ID
    updateProduct: async (_, { id, input }) => {
      try {
        // Fetch existing product
        const existingProduct = await prisma.product.findUnique({
          where: { id },
          include: { type: true, category: true },
        });

        if (!existingProduct) {
          throw new Error("Product not found");
        }

        // Prepare updated data
        const updatedData = {
          ...input,
          type: input.typeId
            ? { connect: { id: input.typeId } }
            : undefined,
          category: input.categoryId
            ? { connect: { id: input.categoryId } }
            : undefined,
        };

        // Remove typeId and categoryId from the input since they are handled via connect
        delete updatedData.typeId;
        delete updatedData.categoryId;

        // Perform the update
        const updatedProduct = await prisma.product.update({
          where: { id },
          data: updatedData,
          include: {
            category: true, // Include category in the response
            type: true, // Include type in the response
          },
        });

        return updatedProduct;
      } catch (error) {
        console.error("Error updating product:", error);
        throw new Error("Failed to update product");
      }
    },

    // Delete product by ID
    deleteProduct: async (_, { id }) => {
      try {
        // Fetch the product before deletion
        const productToDelete = await prisma.product.findUnique({
          where: { id },
        });

        if (!productToDelete) {
          throw new Error("Product not found");
        }

        // Delete the product
        await prisma.product.delete({ where: { id } });

        // Return the deleted product's ID
        return { id }; // Aligns with the GraphQL schema
      } catch (error) {
        console.error("Error deleting product:", error);
        throw new Error("Failed to delete product");
      }
    },

    // Create a new product type
    createProductType: async (_, { name, percentageRate }) => {
      try {
        const productType = await prisma.productType.create({
          data: { name, percentageRate },
        });
        return productType;
      } catch (error) {
        console.error("Create Product Type Error:", error);
        throw new Error("Failed to create product type");
      }
    },

    // Update product type by ID
    updateProductType: async (_, { id, name, percentageRate }) => {
      return prisma.productType.update({
        where: { id },
        data: {
          name,
          percentageRate,
        },
      });
    },

    // Delete product type by ID
    deleteProductType: async (_, { id }) => {
      await prisma.productType.delete({ where: { id } });
      return true;
    },
  },
};