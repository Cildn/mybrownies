import { PrismaClient } from "@prisma/client";
import { getDateRange } from "../../utils/dateRange.js"; // Util to calculate period ranges

const prisma = new PrismaClient();

export const analyticsResolvers = {
  Query: {
    // 🔹 Total Revenue (Completed Orders)
    totalRevenue: async () => {
      const orders = await prisma.order.findMany({ where: { status: "Completed" } });
      return orders.reduce((sum, order) => sum + order.total, 0);
    },

    // 🔹 Orders by period (daily, weekly, monthly, yearly)
    ordersByPeriod: async (_, { period }) => {
      const { start, end } = getDateRange(period);
      return prisma.order.findMany({
        where: {
          completedAt: { gte: start, lte: end },
          status: "Completed",
        },
        orderBy: { completedAt: 'desc' },
        include: { orderItems: true },
      });
    },

    totalOrdersForTwoPeriods: async (_, { period }) => {
      const { start: currentStart, end: currentEnd } = getDateRange(period);
      const { start: previousStart, end: previousEnd } = getDateRange(`previous-${period}`);

      // Fetch orders for the current period
      const currentOrders = await prisma.order.count({
        where: {
          completedAt: { gte: new Date(currentStart), lte: new Date(currentEnd) },
          status: "Completed",
        },
      });

      // Fetch orders for the previous period
      const previousOrders = await prisma.order.count({
        where: {
          completedAt: { gte: new Date(previousStart), lte: new Date(previousEnd) },
          status: "Completed",
        },
      });

      return {
        currentOrders,
        previousOrders,
      };
    },

    // 🔹 Revenue by period
    revenueByPeriod: async (_, { period }) => {
      console.time("RevenueByPeriod");
      const { start, end } = getDateRange(period);
    
      // Use Prisma aggregation to calculate total revenue and group by period
      const groupedRevenue = await prisma.order.groupBy({
        by: ["completedAt"],
        _sum: { total: true },
        _count: { _all: true }, // Count the number of orders per period
        where: {
          completedAt: { gte: new Date(start), lte: new Date(end) },
          status: "Completed",
        },
      });
    
      // Generate period labels
      const periodLabels = generatePeriodLabels(new Date(start), new Date(end), period);
    
      // Aggregate revenue and sales data for each label
      const revenueData = periodLabels.map((label) => {
        const matchingOrders = groupedRevenue.filter((item) => {
          const orderDate = new Date(item.completedAt);
          return label === orderDate.toLocaleString("default", { month: "short" });
        });
        return matchingOrders.reduce((sum, order) => sum + (order._sum.total || 0), 0);
      });
    
      const salesData = periodLabels.map((label) => {
        const matchingOrders = groupedRevenue.filter((item) => {
          const orderDate = new Date(item.completedAt);
          return label === orderDate.toLocaleString("default", { month: "short" });
        });
        return matchingOrders.reduce((sum, order) => sum + (order._count._all || 0), 0);
      });
    
      // Calculate total revenue and total sales
      const totalRevenue = groupedRevenue.reduce(
        (sum, item) => sum + (item._sum.total || 0),
        0
      );
      const totalSales = groupedRevenue.reduce(
        (sum, item) => sum + (item._count._all || 0),
        0
      );
    
      console.timeEnd("RevenueByPeriod");
      return {
        totalRevenue,
        totalSales, // Add this field
        periodLabels,
        revenueData,
        salesData, // Add this field
      };
    },

    // 🔹 Product Sales Breakdown (quantity & revenue per product)
    productSalesBreakdown: async () => {
      const productSales = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true, price: true },
        where: { productId: { not: null } },
      });

      return Promise.all(productSales.map(async (item) => ({
        product: await prisma.product.findUnique({ where: { id: item.productId } }),
        totalSold: item._sum.quantity,
        totalRevenue: item._sum.price,
      })));
    },

    // 🔹 Collection Sales Breakdown (quantity & revenue per collection)
    collectionSalesBreakdown: async () => {
      const collectionSales = await prisma.orderItem.groupBy({
        by: ['collectionId'],
        _sum: { quantity: true, price: true },
        where: { collectionId: { not: null } },
      });

      return Promise.all(collectionSales.map(async (item) => ({
        collection: await prisma.collection.findUnique({ where: { id: item.collectionId } }),
        totalSold: item._sum.quantity,
        totalRevenue: item._sum.price,
      })));
    },

    // 🔹 Monthly Target Fetch (For frontend progress tracking)
    monthlyTarget: async () => {
      const config = await prisma.siteConfig.findFirst();
      const monthlyTarget = config?.monthlyTarget || 0;
    
      // Fetch completed orders for the current month
      const { start, end } = getDateRange("Monthly");
      const orders = await prisma.order.findMany({
        where: {
          completedAt: { gte: new Date(start), lte: new Date(end) },
          status: "Completed",
        },
      });
    
      // Calculate metrics
      const actualRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const numberOfSales = orders.length; // Total number of completed orders
    
      // Fetch today's revenue and orders
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      const todayOrders = await prisma.order.findMany({
        where: {
          completedAt: { gte: todayStart, lte: todayEnd },
          status: "Completed",
        },
      });
      const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
      const todaySales = todayOrders.length; // Number of sales today
    
      // Calculate daily progress percentage
      const dailyProgress = monthlyTarget > 0 ? (todayRevenue / monthlyTarget) * 100 : 0;
    
      return {
        monthlyTarget,
        actualRevenue,
        numberOfSales, // Add this field
        todayRevenue,
        todaySales, // Add this field
        dailyProgress,
      };
    },

    orderStatusDistribution: async (_, { period }) => {
      const { start, end } = getDateRange(period);

      // Fetch orders grouped by status
      const statusCounts = await prisma.order.groupBy({
        by: ["status"],
        _count: { id: true },
        where: {
          createdAt: { gte: new Date(start), lte: new Date(end) },
        },
      });

      // Map status counts to an array [Pending, Completed, Cancelled, Refunded]
      const pending = statusCounts.find((s) => s.status === "Pending")?._count.id || 0;
      const completed = statusCounts.find((s) => s.status === "Completed")?._count.id || 0;
      const cancelled = statusCounts.find((s) => s.status === "Cancelled")?._count.id || 0;
      const refunded = statusCounts.find((s) => s.status === "Refunded")?._count.id || 0;

      return {
        pending,
        completed,
        cancelled,
        refunded,
      };
    },

    // 🔹 Total Completed Orders
    totalCompletedOrders: async () => {
      const orders = await prisma.order.count({
        where: { status: "Completed" },
      });
      return orders;
    },

    bestSellingProducts: async (_, { period }) => {
      const { start, end } = getDateRange(period);

      // Fetch top products by total quantity sold
      const bestSellers = await prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        where: {
          order: {
            completedAt: { gte: new Date(start), lte: new Date(end) },
            status: "Completed",
          },
        },
        orderBy: {
          _sum: { quantity: "desc" }, // Sort by total quantity sold (descending)
        },
        take: 5, // Limit to top 5 products
      });

      // Enrich each product with its details
      const enrichedBestSellers = await Promise.all(
        bestSellers.map(async (item) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
          });

          // Skip products that don't exist
          if (!product) return null;

          return {
            product,
            totalSold: item._sum.quantity || 0, // Use totalSold only
          };
        })
      );

      // Filter out null values
      return enrichedBestSellers.filter(Boolean);
    },

    bestSellingCollections: async (_, { period }) => {
      const { start, end } = getDateRange(period);

      // Fetch top collections by total quantity sold
      const bestSellers = await prisma.orderItem.groupBy({
        by: ["collectionId"],
        _sum: { quantity: true },
        where: {
          collectionId: { not: null }, // Exclude items with null collectionId
          order: {
            completedAt: { gte: new Date(start), lte: new Date(end) },
            status: "Completed",
          },
        },
        orderBy: {
          _sum: { quantity: "desc" }, // Sort by total quantity sold (descending)
        },
        take: 5, // Limit to top 5 collections
      });

      // Enrich each collection with its details
      const enrichedBestSellers = await Promise.all(
        bestSellers.map(async (item) => {
          const collection = await prisma.collection.findUnique({
            where: { id: item.collectionId },
          });

          // Skip collections that don't exist
          if (!collection) return null;

          return {
            collection,
            totalSold: item._sum.quantity || 0, // Use totalSold only
          };
        })
      );

      // Filter out null values
      return enrichedBestSellers.filter(Boolean);
    },

  },
};

// Helper function to generate period labels
function generatePeriodLabels(start, end, period) {
  const labels = [];
  let currentDate = new Date(start);

  while (currentDate <= end) {
    if (period === "Monthly") {
      labels.push(new Date(currentDate).toLocaleString("default", { month: "short" }));
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else if (period === "Weekly") {
      labels.push(`Week ${labels.length + 1}`);
      currentDate.setDate(currentDate.getDate() + 7);
    } else if (period === "Daily") {
      labels.push(new Date(currentDate).toLocaleDateString());
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (period === "Quarterly") {
      labels.push(`Q${Math.ceil((currentDate.getMonth() + 1) / 3)}`);
      currentDate.setMonth(currentDate.getMonth() + 3);
    } else if (period === "Yearly") {
      labels.push(new Date(currentDate).getFullYear().toString());
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    }
  }

  return labels;
}

// Helper function to aggregate revenue by period
