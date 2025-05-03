import { PrismaClient } from "@prisma/client";
import { generateInvoice } from "../../utils/generateInvoice.js";
import { generateOrdersCSV } from "../../utils/generateOrdersCSV.js";

const prisma = new PrismaClient();

export const orderResolvers = {
  Query: {
    orders: async (_, __, { admin }) => {
      if (!admin) throw new Error("Unauthorized");
      return prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          orderItems: {
            include: { product: true, collection: true },
          },
        },
      });
    },
    order: async (_, { id }, { admin }) => {
      if (!admin) throw new Error("Unauthorized");
      return prisma.order.findUnique({
        where: { id },
        include: { orderItems: { include: { product: true, collection: true } } },
      });
    },
    totalRevenue: async () => {
      const orders = await prisma.order.findMany({ where: { status: "Completed" } });
      return orders.reduce((sum, order) => sum + order.total, 0);
    },

    recentOrders: async (_, { hoursAgo }, { admin }) => {
      if (!admin) throw new Error("Unauthorized");
      const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
      return prisma.order.findMany({
        where: {
          createdAt: { gte: cutoff },
        },
        orderBy: { createdAt: "desc" },
        include: {
          orderItems: {
            include: { product: true, collection: true },
          },
        },
      });
    },
  },

  Mutation: {
    checkout: async (_, { sessionId, total }) => {
      const cartItems = await prisma.cartItem.findMany({
        where: { sessionId },
        include: { product: true },
      });
      if (!cartItems.length) throw new Error("Cart is empty");
  
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + (item.product.prices[item.selectedSizeIndex] * item.quantity),
        0
      );
  
      // Generate the displayId
      const today = new Date();
      const formattedDate = today.toISOString().slice(0, 10).replace(/-/g, '');
  
      // Fetch the current order counter from SiteConfig
      const siteConfig = await prisma.siteConfig.findUnique({
        where: { id: "site-settings" },
      });
  
      if (!siteConfig) throw new Error("Site configuration not found");
  
      const newCounter = siteConfig.orderCounter + 1;
      const paddedCounter = String(newCounter).padStart(3, '0');
      const displayId = `ORD-${formattedDate}-${paddedCounter}`;
  
      // Update the order counter
      await prisma.siteConfig.update({
        where: { id: "site-settings" },
        data: { orderCounter: newCounter },
      });
  
      // Create the order with the displayId and total
      const order = await prisma.order.create({
        data: {
          status: "Pending",
          total: total || totalAmount,
          displayId,
          orderItems: {
            create: cartItems.map((item) => {
              if (!item.productId) {
                throw new Error("Product ID is missing in cart item");
              }
  
              const productVariant = `${item.product.name} - ${item.product.sizes[item.selectedSizeIndex]} - ${item.product.colors[item.selectedColorIndex]}`;
  
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.prices[item.selectedSizeIndex] || 0,
                productVariants: productVariant,
              };
            }),
          },
        },
        include: { orderItems: { include: { product: true } } },
      });
  
      generateInvoice(order); // Generate invoice PDF
      await prisma.cartItem.deleteMany({ where: { sessionId } });
  
      return order;
    },

    markOrderAsComplete: async (_, { orderId }, { admin }) => {
      if (!admin) throw new Error("Unauthorized");
    
      // Update the order status and set the completedAt timestamp
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "Completed",
          completedAt: new Date(), // Set the current timestamp
        },
      });
    
      return order;
    },

    markOrderAsPaid: async (_, { orderId }, { admin }) => {
      if (!admin) throw new Error("Unauthorized");
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: "Paid",
          updatedAt: new Date() // Set the current timestamp
         },
        include: { orderItems: { include: { product: true, collection: true } } },
      });
      generateInvoice(order, "receipt"); // Receipt generation
      return order;
    },

    markOrderAsRefunded: async (_, { orderId }, { admin }) => {
      if (!admin) throw new Error("Unauthorized");
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: "Refunded",
          updatedAt: new Date() // Set the current timestamp
         },
        include: { orderItems: { include: { product: true, collection: true } } },
      });
      return order;
    },

    markOrderAsCancelled: async (_, { orderId }, { admin }) => {
      if (!admin) throw new Error("Unauthorized");
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: "Cancelled",
          updatedAt: new Date() // Set the current timestamp
         },
        include: { orderItems: { include: { product: true, collection: true } } },
      });
      return order;
    },

    exportOrdersCSV: async (_, __, { admin }) => {
      if (!admin) throw new Error("Unauthorized");
      const orders = await prisma.order.findMany({
        include: { orderItems: { include: { product: true, collection: true } } },
      });
      const csvUrl = await generateOrdersCSV(orders);
      return { message: "Orders exported", csvUrl };
    },

    refundOrder: async (_, { orderId }, { admin }) => {
      if (!admin) throw new Error("Unauthorized");
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "Refunded" },
      });
      return { message: "Order refunded" };
    },
  },
};