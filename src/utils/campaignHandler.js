import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

const badgeOrder = ['BROWN', 'BLUE', 'GREEN', 'YELLOW', 'RED', 'NEON'];

function getNextBadge(currentBadge) {
  const idx = badgeOrder.indexOf(currentBadge);
  return idx >= 0 && idx < badgeOrder.length - 1 ? badgeOrder[idx + 1]: null;
}

function calculateMintChance(currentBadge, points) {
  const baseMap = {
    BROWN: 40,
    BLUE: 30,
    GREEN: 20,
    YELLOW: 10,
    RED: 5,
  };
  const base = baseMap[currentBadge] || 0;
  const bonus = Math.min(Math.floor(points/10), 30);
  return base + bonus;
}

function initials(fullName) {
  return fullName
    .split(/\s+/)
    .map(n => n[0].toUpperCase())
    .join('');
}

// 1. Create or Get Campaign User
export const upsertCampaignUser = async ({ email, fullName }) => {
  const user = await prisma.campaignUser.create({
    data: { email, fullName, agentId: 'null' },
  });

  const agentId = `${initials(fullName)}-${user.id.slice(-4)}`;

  // 3) save it back on the same record
  return prisma.campaignUser.update({
    where: { id: user.id },
    data: { agentId },
  });
};

// 2. Validate Physical QR Code
export const validateQRCode = async (code, agentId) => {
  const qr = await prisma.qRCode.findUnique({
    where: { code },
  });

  if (!qr || qr.used) {
    throw new Error('Invalid or already used QR code');
  }

  await prisma.qRCode.update({
    where: { code },
    data: {
      used: true,
      usedBy: agentId,
      usedAt: new Date(),
    },
  });

  return true;
};

// 3. Submit Daily Clue Answer
import { verifyAnswer } from './answerHandler.js'; // Import the verifyAnswer function

export const submitClueAnswer = async ({ agentId, answer }) => {
  const { start, end } = getTodayRange();
  const clue = await prisma.clue.findFirst({
    where: { date: { gte: start, lt: end } }
  });
  if (!clue) {
    throw new Error('No clue for today');
  }

  const user = await prisma.campaignUser.findUnique({
    where: { agentId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Check if user already answered this clue
  const alreadyAnswered = await prisma.clue.findFirst({
    where: {
      id: clue.id,
      userAnswers: { some: { agentId } },
    },
  });

  if (alreadyAnswered) {
    throw new Error('Already answered today');
  }

  let correct = false;
  let coupon = null;

  // Verify the answer against the stored hash
  try {
    correct = await verifyAnswer(answer, clue.answer);
  } catch (error) {
    console.error('Error verifying answer:', error);
    throw new Error('Answer verification failed');
  }

  if (correct) {
    // Add points
    await prisma.campaignUser.update({
      where: { agentId },
      data: { points: { increment: 10 } },
    });

    // Generate coupon
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 2);

    coupon = await prisma.coupon.create({
      data: {
        code: `${agentId}-${clue.id}`,
        discount: 5,
        expiry,
        agentId: user.id,
        usageCount: 0,
        maxUses: 2
      },
    });

    // Link user to clue
    await prisma.clue.update({
      where: { id: clue.id },
      data: { userAnswers: { connect: { agentId } } },
    });
  }

  return { correct: correct, points: correct ? 3 : 0, coupon };

};

export const attemptBadgeUpgrade = async ({ agentId, couponCode }) => {
  const user = await prisma.campaignUser.findUnique({ where: {agentId } });
  if (!user) throw new Error('User not found');

  // Validate coupon
  const coupon = await prisma.coupon.findUnique({ where: {code: couponCode } });
  if (!coupon) throw new Error ('Coupon not found');
  if (new Date(coupon.expiry) < new Date()) throw new Error('Coupon expired');
  if (coupon.usageCount >= coupon.maxUses) throw new Error ('Coupon usage limit reached');

  if (coupon.usageCount >= coupon.maxUses) throw new Error('Coupon usage limit reached');

// Determine next badge 
  const nextBadge = getNextBadge(user.badge); 
  if (!nextBadge) throw new Error('Already at highest badge');

// Calculate chance and perform mint 
  const chancePct = calculateMintChance(user.badge, user.points); 
  const success = Math.random() * 100 < chancePct;

// Record attempt 
  const attempt = await prisma.mintAttempt.create({ data: 
    { agentId, badgeFrom: user.badge, badgeTo: nextBadge, chance: chancePct, success, }, });

// On success: update badge and log BadgeUpgrade 
  if (success) 
    { await prisma.campaignUser.update({ where: { agentId }, data: { badge: nextBadge } }); 
    await prisma.badgeUpgrade.create({ data: { agentId, badgeType: nextBadge } }); }

// Increment coupon usage 
  await prisma.coupon.update({ where: { code: couponCode }, data: { usageCount: { increment: 1 } } });

  return { success, newBadge: success ? nextBadge : user.badge, attempt }; 
};

// 5. Get User Stats
export const getUserStats = async (agentId) => {
  const user = await prisma.campaignUser.findUnique({
    where: { agentId },
    include: {
      clues: true,
      coupons: true,
      badgeUpgrades: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return {
    ...user,
    clues: user.clues.map((clue) => ({
      id: clue.id,
      date: clue.date.toISOString(),
      question: clue.question,
    })),
    coupons: user.coupons.map((coupon) => ({
      id: coupon.id,
      code: coupon.code,
      discount: coupon.discount,
      expiry: coupon.expiry.toISOString(),
    })),
    badgeUpgrades: user.badgeUpgrades.map((upgrade) => ({
      id: upgrade.id,
      badgeType: upgrade.badgeType,
      createdAt: upgrade.createdAt.toISOString(),
    })),
  };
};

// 6. Get Clue of the Day
export const getClueOfTheDay = async () => {
  const { start, end } = getTodayRange();
  const clue = await prisma.clue.findFirst({
    where: {
      date: {
        gte: start,
        lt: end
      }
    }
  });

  if (!clue) {
    throw new Error('No clue for today');
  }

  return {
    id: clue.id,
    date: clue.date.toISOString(),
    question: clue.question,
  };
};

export function generateAgentId(fullName, id) {
  const initialsPart = initials(fullName);
  return `${initialsPart}-${id.slice(-4)}`;
}