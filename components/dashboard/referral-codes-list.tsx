"use client";

import { useState } from "react";
import { Button } from "../button";
import { IconPlus, IconTrash, IconEdit, IconCopy } from "@tabler/icons-react";
import { calculateDiscountedPrice } from "@/lib/referral";

interface ReferralCode {
  id: string;
  code: string;
  discountPercent: number;
  commissionRate: number;
  isActive: boolean;
  maxUses: number | null;
  expiresAt: Date | null;
  uses: Array<any>;
  commissions: Array<{
    status: string;
    amount: number;
  }>;
}

interface ReferralCodesListProps {
  referralCodes: ReferralCode[];
  basePrice: number;
}

export function ReferralCodesList({ referralCodes, basePrice }: ReferralCodesListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    // TODO: Add toast notification
  };

  const handleCreateCode = async () => {
    setIsCreating(true);
    // TODO: Implement create code modal
  };

  const handleEditCode = (id: string) => {
    setIsEditing(id);
    // TODO: Implement edit code modal
  };

  const handleDeleteCode = async (id: string) => {
    // TODO: Add confirmation dialog
    try {
      const response = await fetch(`/api/referral/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete referral code');
      }

      // TODO: Refresh data
    } catch (error) {
      console.error('Error deleting referral code:', error);
      // TODO: Add error toast
    }
  };

  return (
    <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Referral Codes</h2>
          <Button
            onClick={handleCreateCode}
            className="bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-white border-none hover:from-[#2a2bdb] hover:to-[#0aa6fd] transition-all duration-500"
          >
            <IconPlus className="h-4 w-4 mr-2" />
            Create Code
          </Button>
        </div>
      </div>
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {referralCodes.map((code) => {
          const priceData = calculateDiscountedPrice(basePrice, code.discountPercent);
          return (
            <div key={code.id} className="p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-lg font-semibold">{code.code}</p>
                  <button
                    onClick={() => handleCopyCode(code.code)}
                    className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    <IconCopy className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {code.discountPercent}% off • ${(priceData.finalPrice / 100).toFixed(2)} final price
                </div>
                <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {code.uses.length} uses • ${((code.commissions.reduce((sum, commission) => 
                    sum + (commission.status === 'paid' ? commission.amount : 0), 0)) / 100).toFixed(2)} earned
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="simple"
                  onClick={() => handleEditCode(code.id)}
                  className="text-neutral-700 dark:text-neutral-300"
                >
                  <IconEdit className="h-4 w-4" />
                </Button>
                <Button
                  variant="simple"
                  onClick={() => handleDeleteCode(code.id)}
                  className="text-red-500 hover:text-red-600 dark:hover:text-red-400"
                >
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
        {referralCodes.length === 0 && (
          <div className="p-6 text-center text-neutral-600 dark:text-neutral-400">
            No referral codes yet. Create one to start earning commissions!
          </div>
        )}
      </div>
    </div>
  );
} 