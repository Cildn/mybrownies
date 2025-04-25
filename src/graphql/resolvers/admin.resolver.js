import { PrismaClient } from "@prisma/client";
import {
  generateTokens,
  comparePassword,
  generateSecureOTP,
  hashOTP,
  verifyHashedOTP,
  sendOTP,
} from "../../utils/auth.js";

const prisma = new PrismaClient();
const MAX_OTP_REQUESTS = 3; // Adjustable limit
const OTP_RESET_TIME = 10 * 60 * 1000; // 10 minutes

export const adminResolvers = {
  Query: {
    siteConfig: async () => {
      return prisma.siteConfig.findFirst();
    },

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
  },

  Mutation: {
    requestAdminOTP: async (_, { email, password }) => {
      const admin = await prisma.admin.findUnique({ where: { email } });
      if (!admin) throw new Error("Admin not found");

      const valid = await comparePassword(password, admin.password);
      if (!valid) throw new Error("Invalid credentials");

      const now = Date.now();
      const lastRequestTime = admin.otpExpiry ? new Date(admin.otpExpiry).getTime() : 0;

      if (now - lastRequestTime > OTP_RESET_TIME) {
        await prisma.admin.update({ where: { email }, data: { otpRequestCount: 1 } });
      } else if (admin.otpRequestCount >= MAX_OTP_REQUESTS) {
        throw new Error("Too many OTP requests. Please try again later.");
      }

      const otp = generateSecureOTP();
      const hashedOtp = await hashOTP(otp);
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.admin.update({
        where: { email },
        data: { otp: hashedOtp, otpExpiry, otpRequestCount: { increment: 1 } },
      });

      await sendOTP(email, otp);
      console.log(`OTP sent to ${email}`);
      return { message: "OTP sent to your email" };
    },

    verifyAdmin: async (_, { email, otp, rememberMe }) => {
      const admin = await prisma.admin.findUnique({ where: { email } });
      if (!admin || !admin.otp || !admin.otpExpiry) {
        throw new Error("No OTP found. Please request one.");
      }

      const isOtpValid = await verifyHashedOTP(otp, admin.otp);
      if (!isOtpValid) throw new Error("The OTP you entered is incorrect. Please try again.");
      if (new Date() > admin.otpExpiry) {
        throw new Error("This OTP has expired. Please request a new one.");
      }

      await prisma.admin.update({
        where: { email },
        data: { otp: null, otpExpiry: null, otpRequestCount: 0 },
      });

      const { shortLivedToken, longLivedToken } = generateTokens(admin, rememberMe);

      console.log("Admin verified. Tokens generated.");
      return {
        shortLivedToken,
        longLivedToken: rememberMe ? longLivedToken : null,
        admin,
      };
    },

    updateSiteConfig: async (_, { maintenanceMode, liveMode, heroVideo, monthlyTarget }, { admin }) => {
      if (!admin || admin.role !== "admin") throw new Error("Unauthorized");
    
      if (typeof maintenanceMode !== "boolean") throw new Error("Invalid value for maintenanceMode");
      if (typeof liveMode !== "boolean") throw new Error("Invalid value for liveMode");
      if (typeof monthlyTarget !== "number" || monthlyTarget < 0) throw new Error("Invalid value for monthlyTarget");
    
      return prisma.siteConfig.upsert({
        where: { id: "site-settings" },
        update: {
          maintenanceMode,
          liveMode,
          heroVideo,
          monthlyTarget,
        },
        create: {
          id: "site-settings",
          maintenanceMode,
          liveMode,
          heroVideo,
          monthlyTarget,
          categoryCounter: 0, // Initialize category counter on create
          orderCounter: 0,
        },
      });
    },    
  },
};