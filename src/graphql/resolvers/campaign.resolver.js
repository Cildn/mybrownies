import { 
  upsertCampaignUser, 
  validateQRCode, 
  submitClueAnswer, 
  getUserStats,
  getClueOfTheDay,
  attemptBadgeUpgrade
} from '../../utils/campaignHandler.js';
import { sendAgentIdEmail } from '../../utils/campaignEmail.js';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export const campaignResolvers = {
  Query: {
    validateUserCredentials: async (_, { agentId, email }) => {
      try {
        const user = await prisma.campaignUser.findFirst({
          where: {
            agentId,
            email,
          },
        });
        return Boolean(user);
      } catch (err) {
        console.error('Error validating user credentials:', err);
        return false;
      }
    },   
    checkQRCodeByCode: async (_, { code }) => {
      try {
        const qr = await prisma.qRCode.findUnique({
          where: { code },
        });

        if (!qr) return { isValid: false, reason: "Code not found" };
        if (qr.used) return { isValid: false, reason: "Code already used" };
        
        return { isValid: true };
      } catch (err) {
        console.error('Error validating QR code', err);
        return { isValid: false, reason: "QR code validation failed" };
      }
    },
    validateUserByEmail: async (_, { email }) => {
      try {
        const user = await prisma.campaignUser.findFirst({
          where: { email },
        });
        return Boolean(user);
      } catch (err) {
        console.error('Error validating user credentials:', err);
        return false;
      }
    },    
    getClueOfTheDay: async () => {
      try {
        return await getClueOfTheDay();
      } catch (err) {
        console.error('Error fetching clue of the day:', err);
        throw new Error('Failed to fetch clue of the day');
      }
    },
    getUserStats: async (_, { agentId }) => {
      return getUserStats(agentId);
    },
    getUserCoupons: async (_, { agentId }) => {
      const user = await upsertCampaignUser({ agentId });
      return prisma.campaignUser.findUnique({
        where: { agentId },
        include: { coupons: true }
      }).then(user => user.coupons);
    },
    getUserBadgeUpgrades: async (_, { agentId }) => {
      return prisma.badgeUpgrade.findMany({
        where: { agentId },
        orderBy: { createdAt: 'desc' }
      });
    }
  },
  Mutation: {
    createUser: async (_, { input }) => {
      return upsertCampaignUser(input);
    },
    sendAgentEmail: async (_, { input }) => {
      const { agentId, fullName, email } = input;
      // find the user's internal ID
      const user = await prisma.campaignUser.findUnique({
        where: { agentId },
        select: { id: true }
      });
      if (!user) throw new Error('User not found');

      // send the Agent ID email
      const sentAgentId = await sendAgentIdEmail(fullName, email, user.id);

      return { agentId: sentAgentId };
    },
    submitClueAnswer: async (_, { input }) => {
      const { agentId, answer } = input;
      const result = await submitClueAnswer({ agentId, answer });
      return { 
        correct: result.correct, 
        coupon: result.coupon, 
        points: result.correct ? 3 : 0 
      };
    },
    attemptBadgeUpgrade: async (_, { input }) => {
      try {
        return await attemptBadgeUpgrade(input);
      } catch (err){
        console.error('Error attempting badge upgrade:', err);
        throw new Error (err.message || 'Badge upgrade failed');
      }
    },
    validateQRCode: async (_, { input }) => {
      const { code, agentId } = input;
      return validateQRCode(code, agentId);
    }
  },
  CampaignUser: {
    createdAt: (parent) => parent.createdAt.toISOString(),
    updatedAt: (parent) => parent.updatedAt.toISOString()
  },
  Clue: {
    date: (parent) => parent.date.toISOString()
  },
  Coupon: {
    expiry: (parent) => parent.expiry.toISOString()
  },
  BadgeUpgrade: {
    createdAt: (parent) => parent.createdAt.toISOString()
  },
  QRCode: {
    createdAt: (parent) => parent.createdAt.toISOString()
  }
};