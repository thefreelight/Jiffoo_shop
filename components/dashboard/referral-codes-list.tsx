"use client";

import { useState } from "react";
import { Button } from "../button";
import { IconPlus, IconTrash, IconEdit } from "@tabler/icons-react";

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

  const handleCreate = () => {
    setIsCreating(true);
  };

  const handleEdit = (id: string) => {
    setIsEditing(id);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/referral/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete referral code");
      }

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Error deleting referral code:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-black dark:text-white">Your Referral Codes</h2>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <IconPlus className="h-4 w-4" />
          Create New Code
        </Button>
      </div>

      <div className="grid gap-4">
        {referralCodes.map((code) => (
          <div
            key={code.id}
            className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    {code.code}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      code.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {code.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-neutral-600 dark:text-neutral-400">
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
                      {code.maxUses ? `/${code.maxUses}` : ""}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleEdit(code.id)}
                  className="p-2"
                >
                  <IconEdit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(code.id)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 