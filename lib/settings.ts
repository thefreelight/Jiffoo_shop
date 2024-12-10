import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
  // Get all settings from database
  const dbSettings = await prisma.settings.findMany();
  console.log('Raw DB Settings:', dbSettings);

  // Convert array to key-value object
  const settings: { [key: string]: string } = {};
  dbSettings.forEach(setting => {
    settings[setting.key] = setting.value;
  });
  console.log('Parsed Settings:', settings);

  // Get specific settings with fallbacks to defaults
  const defaultCommissionRate = settings['defaultCommissionRate'] 
    ? parseInt(settings['defaultCommissionRate']) 
    : DEFAULT_SETTINGS.defaultCommissionRate;

  const defaultDiscountPercent = settings['defaultDiscountPercent']
    ? parseInt(settings['defaultDiscountPercent'])
    : DEFAULT_SETTINGS.defaultDiscountPercent;

  const maxCommissionRate = settings['maxCommissionRate']
    ? parseInt(settings['maxCommissionRate'])
    : DEFAULT_SETTINGS.maxCommissionRate;

  const maxDiscountPercent = settings['maxDiscountPercent']
    ? parseInt(settings['maxDiscountPercent'])
    : DEFAULT_SETTINGS.maxDiscountPercent;

  const minPurchaseAmount = settings['minPurchaseAmount']
    ? parseInt(settings['minPurchaseAmount'])
    : DEFAULT_SETTINGS.minPurchaseAmount;

  const payoutThreshold = settings['payoutThreshold']
    ? parseInt(settings['payoutThreshold'])
    : DEFAULT_SETTINGS.payoutThreshold;

  const result = {
    defaultCommissionRate,
    defaultDiscountPercent,
    maxCommissionRate,
    maxDiscountPercent,
    minPurchaseAmount,
    payoutThreshold,
  };

  console.log('Final Settings:', result);
  return result;
}

export async function updateSystemSetting(key: string, value: string) {
  console.log(`Updating setting: ${key} = ${value}`);
  
  // Start a transaction to ensure all updates are atomic
  await prisma.$transaction(async (tx) => {
    // Update the setting
    await tx.settings.upsert({
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

    // If updating default commission rate or discount percent, update all referral codes
    if (key === 'defaultCommissionRate') {
      console.log(`Updating all referral codes with new commission rate: ${value}`);
      await tx.referralCode.updateMany({
        data: {
          commissionRate: parseInt(value),
        },
      });
    } else if (key === 'defaultDiscountPercent') {
      console.log(`Updating all referral codes with new discount percent: ${value}`);
      await tx.referralCode.updateMany({
        data: {
          discountPercent: parseInt(value),
        },
      });
    }
  });

  // Revalidate the dashboard page to reflect the changes
  revalidatePath('/dashboard');
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