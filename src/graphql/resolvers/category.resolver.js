import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const categoryResolvers = {
  Query: {
    // Fetch all categories with their products and collections
    categories: async () =>
      prisma.category.findMany({
        include: { products: true, collections: true },
      }),

    // Fetch specific category by ID
    categoryDetails: async (_, { categoryId }) =>
      prisma.category.findUnique({
        where: { id: categoryId },
        include: { products: true, collections: true },
      }),
    
    category: async (_, { name }) =>
      prisma.category.findFirst({
        where: { name: name },
        include: { products: true, collections: true },
      }),
  },

  Mutation: {
    // Create a new category
    createCategory: async (_, { name, image, video }, { prisma }) => {
      if (!name || !image) throw new Error("Name and Image are required");

      // Fetch the current category counter
      const siteConfig = await prisma.siteConfig.findUnique({
        where: { id: "site-settings" },
      });

      if (!siteConfig) throw new Error("Site configuration not found");

      const newCounter = siteConfig.categoryCounter + 1;
      const paddedCounter = String(newCounter).padStart(3, '0');
      const displayId = `CAT-${paddedCounter}`;

      // Update the global counter
      await prisma.siteConfig.update({
        where: { id: "site-settings" },
        data: { categoryCounter: newCounter },
      });

      // Create the category with the displayId
      return prisma.category.create({
        data: {
          displayId,
          name,
          image,
          video,
        },
      });
    },

    // Update category by ID
    updateCategory: async (_, { id, name, image, video }) => {
      return prisma.category.update({
        where: { id },
        data: { name, image, video },
      });
    },

    // Delete category by ID
    deleteCategory: async (_, { id }) => {
      await prisma.category.delete({ where: { id } });
      return true;
    },
  },
};

