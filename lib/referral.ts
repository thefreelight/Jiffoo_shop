import prisma from './prisma';

export async function validateReferralCode(code: string, userId: string) {
  const referralCode = await prisma.referralCode.findUnique({
    where: { code },
    include: {
      uses: true,
    },
  });

  if (!referralCode) {
    return { valid: false, error: 'Invalid referral code' };
  }

  if (!referralCode.isActive) {
    return { valid: false, error: 'This referral code is inactive' };
  }

  if (referralCode.expiresAt && referralCode.expiresAt < new Date()) {
    return { valid: false, error: 'This referral code has expired' };
  }

  if (referralCode.maxUses && referralCode.uses.length >= referralCode.maxUses) {
    return { valid: false, error: 'This referral code has reached its maximum uses' };
  }

  if (referralCode.oneTimePerUser) {
    const previousUse = await prisma.referralUse.findFirst({
      where: {
        referralCodeId: referralCode.id,
        userId,
      },
    });

    if (previousUse) {
      return { valid: false, error: 'You have already used this referral code' };
    }
  }

  return {
    valid: true,
    referralCode,
  };
}

export function calculateDiscountedPrice(basePrice: number, discountPercent: number) {
  const discount = Math.round((basePrice * discountPercent) / 100);
  const finalPrice = basePrice - discount;
  
  return {
    originalPrice: 29900, // $299.00 in cents
    basePrice: 9900,      // $99.00 in cents
    discount,
    finalPrice,
    savedAmount: 29900 - finalPrice,
  };
}

export async function createReferralCode(userId: string, data: {
  code?: string;
  discountPercent: number;
  commissionRate: number;
  maxUses?: number;
  expiresAt?: Date;
  oneTimePerUser?: boolean;
}) {
  const code = data.code || generateReferralCode();

  const existingCode = await prisma.referralCode.findUnique({
    where: { code },
  });

  if (existingCode) {
    throw new Error('This referral code already exists');
  }

  return prisma.referralCode.create({
    data: {
      code,
      userId,
      discountPercent: data.discountPercent,
      commissionRate: data.commissionRate,
      maxUses: data.maxUses,
      expiresAt: data.expiresAt,
      oneTimePerUser: data.oneTimePerUser ?? true,
    },
  });
}

export async function recordReferralUse(data: {
  referralCodeId: string;
  userId: string;
  purchaseId: string;
  discountAmount: number;
  finalPrice: number;
}) {
  return prisma.$transaction([
    // Record the referral use
    prisma.referralUse.create({
      data: {
        referralCodeId: data.referralCodeId,
        userId: data.userId,
        purchaseId: data.purchaseId,
        discountAmount: data.discountAmount,
        finalPrice: data.finalPrice,
      },
    }),
    // Create commission record
    prisma.commission.create({
      data: {
        referralCodeId: data.referralCodeId,
        purchaseId: data.purchaseId,
        amount: Math.round((data.finalPrice * 30) / 100), // 30% commission
        status: 'pending',
      },
    }),
  ]);
}

function generateReferralCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
} 