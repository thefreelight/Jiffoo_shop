import prisma from './prisma';

export function generateReferralCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function validateCustomCode(code: string): Promise<{ valid: boolean; error?: string }> {
  // Check minimum length
  if (code.length < 4) {
    return { valid: false, error: 'Code must be at least 4 characters long' };
  }

  // Check if code already exists
  const existingCode = await prisma.referralCode.findUnique({
    where: { code },
  });

  if (existingCode) {
    return { valid: false, error: 'This code is already taken' };
  }

  return { valid: true };
}

export async function updateReferralCode(userId: string, newCode: string) {
  // Validate the new code
  const validation = await validateCustomCode(newCode);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Find the user's current referral code
  const currentCode = await prisma.referralCode.findFirst({
    where: { userId },
  });

  if (!currentCode) {
    throw new Error('No referral code found for this user');
  }

  // Update the code
  return prisma.referralCode.update({
    where: {
      id: currentCode.id,
    },
    data: {
      code: newCode.toUpperCase(),
    },
  });
}

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

  if (referralCode.userId === userId) {
    return { valid: false, error: 'You cannot use your own referral code' };
  }

  return {
    valid: true,
    referralCode,
  };
}

export async function getReferralRates(userRole: string = 'user'): Promise<{
  discountPercent: number;
  commissionRate: number;
}> {
  // Get rates from settings based on user role
  const [discountSetting, commissionSetting] = await Promise.all([
    prisma.settings.findUnique({
      where: { key: `${userRole}_discount_percent` },
    }),
    prisma.settings.findUnique({
      where: { key: `${userRole}_commission_rate` },
    }),
  ]);

  // Default values if settings are not found
  return {
    discountPercent: discountSetting ? parseInt(discountSetting.value) : 20,
    commissionRate: commissionSetting ? parseInt(commissionSetting.value) : 30,
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