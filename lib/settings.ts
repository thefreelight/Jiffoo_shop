import prisma from "@/lib/prisma";

export interface SystemSettings {
  defaultCommissionRate: number;
  defaultDiscountPercent: number;
  maxCommissionRate: number;
  maxDiscountPercent: number;
  minPurchaseAmount: number;
  payoutThreshold: number;
}

const DEFAULT_SETTINGS: SystemSettings = {
  defaultCommissionRate: 30,
  defaultDiscountPercent: 20,
  maxCommissionRate: 50,
  maxDiscountPercent: 40,
  minPurchaseAmount: 9900, // $99.00
  payoutThreshold: 5000,   // $50.00
};

export async function getSystemSettings(): Promise<SystemSettings> {
  const dbSettings = await prisma.settings.findMany();
  const settings: { [key: string]: string } = {};
  
  dbSettings.forEach(setting => {
    settings[setting.key] = setting.value;
  });

  return {
    defaultCommissionRate: parseInt(settings.defaultCommissionRate || DEFAULT_SETTINGS.defaultCommissionRate.toString()),
    defaultDiscountPercent: parseInt(settings.defaultDiscountPercent || DEFAULT_SETTINGS.defaultDiscountPercent.toString()),
    maxCommissionRate: parseInt(settings.maxCommissionRate || DEFAULT_SETTINGS.maxCommissionRate.toString()),
    maxDiscountPercent: parseInt(settings.maxDiscountPercent || DEFAULT_SETTINGS.maxDiscountPercent.toString()),
    minPurchaseAmount: parseInt(settings.minPurchaseAmount || DEFAULT_SETTINGS.minPurchaseAmount.toString()),
    payoutThreshold: parseInt(settings.payoutThreshold || DEFAULT_SETTINGS.payoutThreshold.toString()),
  };
}

export async function updateSystemSetting(key: string, value: string) {
  await prisma.settings.upsert({
    where: { key },
    create: {
      key,
      value,
      description: `System setting for ${key}`,
    },
    update: {
      value,
      updatedAt: new Date(),
    },
  });
}

export function validateCommissionRate(rate: number, maxRate?: number): boolean {
  if (rate < 0) return false;
  if (maxRate && rate > maxRate) return false;
  return true;
}

export function validateDiscountPercent(percent: number, maxPercent?: number): boolean {
  if (percent < 0) return false;
  if (maxPercent && percent > maxPercent) return false;
  return true;
}

export function validatePurchaseAmount(amount: number, minAmount?: number): boolean {
  if (amount < 0) return false;
  if (minAmount && amount < minAmount) return false;
  return true;
} 