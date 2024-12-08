"use client";

import { useState } from "react";
import { Button } from "../button";
import { IconEdit, IconX, IconCopy, IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";

interface ReferralCode {
  id: string;
  code: string;
  discountPercent: number;
  commissionRate: number;
  isActive: boolean;
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
  const [isEditing, setIsEditing] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleUpdateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/referral/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: newCode,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast.success('Referral code updated successfully');
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating referral code:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update referral code');
    }
  };

  const copyInviteLink = async (code: string) => {
    const inviteLink = `${window.location.origin}/signup?referralCode=${code}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success('Invite link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy invite link');
    }
  };

  const code = referralCodes[0]; // We know there's only one code per user

  return (
    <div>
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Customize Your Referral Code</h3>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="p-2"
              >
                <IconX className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleUpdateCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">New Code</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="Enter new code (minimum 4 characters)"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-[#0aa6fd]"
                  minLength={4}
                  required
                />
                <p className="mt-2 text-sm text-neutral-500">
                  Your referral code must be at least 4 characters long and can only contain letters and numbers.
                </p>
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-white border-none hover:from-[#2a2bdb] hover:to-[#0aa6fd] transition-all duration-500"
                >
                  Update Code
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {code && (
        <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  {code.code}
                </h3>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  Active
                </span>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="p-2"
                >
                  <IconEdit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyInviteLink(code.code)}
                  className="p-2"
                >
                  {copied ? (
                    <IconCheck className="h-4 w-4 text-green-500" />
                  ) : (
                    <IconCopy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Share your invite link:
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <code className="px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-sm flex-1 overflow-x-auto">
                    {`${typeof window !== 'undefined' ? window.location.origin : ''}/signup?referralCode=${code.code}`}
                  </code>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                <div>
                  <p>Discount</p>
                  <p className="font-medium text-black dark:text-white">
                    {code.discountPercent}%
                  </p>
                </div>
                <div>
                  <p>Commission Rate</p>
                  <p className="font-medium text-black dark:text-white">
                    {code.commissionRate}%
                  </p>
                </div>
                <div>
                  <p>Uses</p>
                  <p className="font-medium text-black dark:text-white">
                    {code.uses.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 