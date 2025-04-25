import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const cartResolvers = {
  Query: {
    // 🔹 Fetch cart items for a session
    cartItems: async (_, { sessionId }) => {
      return prisma.cartItem.findMany({
        where: { sessionId },
        include: { product: true, collection: true },
      });
    },
  },

  Mutation: {
    // 🔹 Add product or collection to cart
    addToCart: async (_, { sessionId, productId, collectionId, quantity, selectedColorIndex, selectedSizeIndex }) => {
      if (quantity < 1) throw new Error("Quantity must be at least 1");

      await prisma.cartItem.create({
        data: {
          sessionId,
          productId,
          collectionId,
          quantity,
          selectedColorIndex,
          selectedSizeIndex,
        },
      });
      return true;
    },

    // 🔹 Remove specific cart item
    removeFromCart: async (_, { sessionId, itemId }) => {
      const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
      if (!item || item.sessionId !== sessionId) throw new Error("Item not found or unauthorized");

      await prisma.cartItem.delete({ where: { id: itemId } });
      return true;
    },

    // 🔹 Clear entire cart for session
    clearCart: async (_, { sessionId }) => {
      await prisma.cartItem.deleteMany({ where: { sessionId } });
      return true;
    },
  },
};
