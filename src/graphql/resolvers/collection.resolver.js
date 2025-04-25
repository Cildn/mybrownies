import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const collectionResolvers = {
  Query: {
    // 🔹 Fetch all collections
    collections: async () => {
      return prisma.collection.findMany({
        include: { category: true, products: true, orderItems: true, cartItems: true },
      });
    },

    collectionsCount: (_, { filter }) => {
      // Logic to count collections based on the filter (e.g., category)
      return db.collections.count({ where: filter });
    },

    // 🔹 Fetch a single collection
    collection: async (_, { id }) => {
      return prisma.collection.findUnique({
        where: { id },
        include: { products: true, category: true, orderItems: true, cartItems: true },
      });
    },

    // 🔹 Collection Sales Breakdown
    collectionSalesBreakdown: async () => {
      const sales = await prisma.orderItem.groupBy({
        by: ["collectionId"],
        _sum: { quantity: true, price: true },
        where: { collectionId: { not: null } },
      });

      return Promise.all(sales.map(async (sale) => ({
        collection: await prisma.collection.findUnique({ where: { id: sale.collectionId } }),
        totalSold: sale._sum.quantity,
        totalRevenue: sale._sum.price,
      })));
    },
  },

  Mutation: {
    createCollection: async (_, {
      name,
      description,
      additionalInfo,
      discountRate,
      categoryId, // This will be mapped to the `category` relation
      productIds, // This will be mapped to the `products` relation
      images,
      videos,
      price,
      status,
      productVariants, // New field for product variants
    }) => {
      try {
        // Fetch the category to get its displayId and collectionCounter
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
        });
    
        if (!category) throw new Error("Category not found");
    
        // Generate the displayId
        const newCounter = category.collectionCounter + 1;
        const paddedCounter = String(newCounter).padStart(3, '0');
        const displayId = `COLL-${category.displayId}-${paddedCounter}`;
    
        // Update the category's collectionCounter
        await prisma.category.update({
          where: { id: categoryId },
          data: { collectionCounter: newCounter },
        });
    
        // Create the collection with the displayId
        const collection = await prisma.collection.create({
          data: {
            displayId,
            name,
            description,
            additionalInfo,
            discountRate,
            category: { connect: { id: categoryId } }, // Use `category` with `connect`
            products: {
              connect: productIds.map((id) => ({ id })),
            },
            images,
            videos,
            price,
            status,
            productVariants, // Include product variants
          },
    
          include: {
            products: true, // Include products in the response
            category: true // Include category in the response
          },
        });
        console.log("Received productIds:", productIds);
        return collection;
      } catch (error) {
        console.error("Error creating collection:", error);
        throw new Error("Failed to create collection");
      }
    },

    updateCollection: async (_, { id, input }) => {
      try {
        // Fetch existing collection
        const existingCollection = await prisma.collection.findUnique({
          where: { id },
          include: { category: true, products: true },
        });
    
        if (!existingCollection) {
          throw new Error("Collection not found");
        }
    
        // Prepare updated data
        const updatedData = {
          ...input,
          category: input.categoryId
            ? { connect: { id: input.categoryId } }
            : undefined,
          products: input.productIds
            ? {
                connect: input.productIds.map((id) => ({ id })),
              }
            : undefined,
          productVariants: input.productVariants // Include product variants
        };
    
        // Remove categoryId and productIds from the input since they are handled via connect
        delete updatedData.categoryId;
        delete updatedData.productIds;
    
        // Perform the update
        const updatedCollection = await prisma.collection.update({
          where: { id },
          data: updatedData,
          include: {
            category: true, // Include category in the response
            products: true, // Include products in the response
          },
        });
    
        console.log(`Existing collection:`, existingCollection);
        console.log(`Updated data:`, updatedData);
    
        return updatedCollection;
      } catch (error) {
        console.error("Error updating collection:", error);
        throw new Error("Failed to update collection");
      }
    },

    // 🔹 Delete collection
    deleteCollection: async (_, { id }) => {
      try {
        // Fetch the collection before deletion
        const collectionToDelete = await prisma.collection.findUnique({
          where: { id },
        });

        if (!collectionToDelete) {
          throw new Error("Collection not found");
        }

        // Delete the collection
        await prisma.collection.delete({ where: { id } });

        // Return the deleted collection's ID
        return { id }; // Aligns with the GraphQL schema
      } catch (error) {
        console.error("Error deleting collection:", error);
        throw new Error("Failed to delete collection");
      }
    },
  },
};