import { Card } from "@/components/ui/card";
import { Button } from "@/components/button";
import { revalidatePath } from "next/cache";
import { getSystemSettings, updateSystemSetting, type SystemSettings } from "@/lib/settings";

export default async function SettingsPage() {
  const settings = await getSystemSettings();

  async function saveSettings(formData: FormData) {
    "use server";
    
    const updates = [
      updateSystemSetting("defaultCommissionRate", formData.get("defaultCommissionRate")?.toString() || ""),
      updateSystemSetting("defaultDiscountPercent", formData.get("defaultDiscountPercent")?.toString() || ""),
      updateSystemSetting("maxCommissionRate", formData.get("maxCommissionRate")?.toString() || ""),
      updateSystemSetting("maxDiscountPercent", formData.get("maxDiscountPercent")?.toString() || ""),
      updateSystemSetting("minPurchaseAmount", (parseFloat(formData.get("minPurchaseAmount")?.toString() || "0") * 100).toString()),
      updateSystemSetting("payoutThreshold", (parseFloat(formData.get("payoutThreshold")?.toString() || "0") * 100).toString()),
    ];

    await Promise.all(updates);
    revalidatePath("/admin/settings");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Configure system settings and defaults
        </p>
      </div>

      <form action={saveSettings}>
        <div className="grid gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Commission Settings</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Default Commission Rate
                  </label>
                  <div className="mt-1">
                    <input
                      name="defaultCommissionRate"
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={settings.defaultCommissionRate}
                      className="block w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black shadow-sm focus:border-[#0aa6fd] focus:ring-[#0aa6fd] sm:text-sm"
                    />
                  </div>
                  <p className="mt-2 text-sm text-neutral-500">
                    Default commission rate for new referral codes
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Maximum Commission Rate
                  </label>
                  <div className="mt-1">
                    <input
                      name="maxCommissionRate"
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={settings.maxCommissionRate}
                      className="block w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black shadow-sm focus:border-[#0aa6fd] focus:ring-[#0aa6fd] sm:text-sm"
                    />
                  </div>
                  <p className="mt-2 text-sm text-neutral-500">
                    Maximum allowed commission rate
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Discount Settings</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Default Discount Percent
                  </label>
                  <div className="mt-1">
                    <input
                      name="defaultDiscountPercent"
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={settings.defaultDiscountPercent}
                      className="block w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black shadow-sm focus:border-[#0aa6fd] focus:ring-[#0aa6fd] sm:text-sm"
                    />
                  </div>
                  <p className="mt-2 text-sm text-neutral-500">
                    Default discount for new referral codes
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Maximum Discount Percent
                  </label>
                  <div className="mt-1">
                    <input
                      name="maxDiscountPercent"
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={settings.maxDiscountPercent}
                      className="block w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black shadow-sm focus:border-[#0aa6fd] focus:ring-[#0aa6fd] sm:text-sm"
                    />
                  </div>
                  <p className="mt-2 text-sm text-neutral-500">
                    Maximum allowed discount percentage
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Payment Settings</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Minimum Purchase Amount
                  </label>
                  <div className="mt-1">
                    <div className="relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-neutral-500 sm:text-sm">$</span>
                      </div>
                      <input
                        name="minPurchaseAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={(settings.minPurchaseAmount / 100).toFixed(2)}
                        className="block w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black pl-7 shadow-sm focus:border-[#0aa6fd] focus:ring-[#0aa6fd] sm:text-sm"
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-neutral-500">
                    Minimum amount required for purchase
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Payout Threshold
                  </label>
                  <div className="mt-1">
                    <div className="relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-neutral-500 sm:text-sm">$</span>
                      </div>
                      <input
                        name="payoutThreshold"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={(settings.payoutThreshold / 100).toFixed(2)}
                        className="block w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black pl-7 shadow-sm focus:border-[#0aa6fd] focus:ring-[#0aa6fd] sm:text-sm"
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-neutral-500">
                    Minimum amount required for commission payout
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#0aa6fd] to-[#2a2bdb] text-white border-none hover:from-[#2a2bdb] hover:to-[#0aa6fd] transition-all duration-500"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
} 