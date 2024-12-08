import { Card } from "@/components/ui/card";
import { Button } from "@/components/button";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { IconTrash, IconGripVertical } from "@tabler/icons-react";
import { PricingConfig, Feature } from "@prisma/client";

type PricingConfigWithFeatures = PricingConfig & {
  features: Feature[];
};

async function getActivePricingConfig() {
  return prisma.pricingConfig.findFirst({
    where: { isActive: true },
    include: {
      features: {
        orderBy: { order: 'asc' }
      }
    }
  });
}

async function initializePricing() {
  'use server'
  
  await prisma.pricingConfig.create({
    data: {
      originalPrice: 9900, // $99.00
      currentPrice: 4900,  // $49.00
      isActive: true,
      features: {
        create: [
          {
            title: "Lifetime Access",
            description: "One-time payment for lifetime access",
            order: 1,
          },
          {
            title: "All Features",
            description: "Access to all current and future features",
            order: 2,
          },
          {
            title: "Premium Support",
            description: "Priority email and chat support",
            order: 3,
          },
        ],
      },
    },
  });

  revalidatePath('/admin/pricing');
}

export default async function PricingConfigPage() {
  const config = await getActivePricingConfig();

  async function updatePricing(formData: FormData) {
    'use server'
    
    const originalPrice = parseInt(formData.get('originalPrice') as string) * 100;
    const currentPrice = parseInt(formData.get('currentPrice') as string) * 100;

    await prisma.pricingConfig.update({
      where: { id: config?.id },
      data: {
        originalPrice,
        currentPrice,
      }
    });

    revalidatePath('/admin/pricing');
  }

  async function addFeature(formData: FormData) {
    'use server'
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    
    await prisma.feature.create({
      data: {
        title,
        description,
        order: (config?.features?.length || 0) + 1,
        pricingConfigId: config?.id as string,
      }
    });

    revalidatePath('/admin/pricing');
  }

  async function deleteFeature(featureId: string) {
    'use server'
    
    await prisma.feature.delete({
      where: { id: featureId }
    });

    revalidatePath('/admin/pricing');
  }

  async function reorderFeatures(featureId: string, newOrder: number) {
    'use server'
    
    // Get all features
    const features = await prisma.feature.findMany({
      where: { pricingConfigId: config?.id },
      orderBy: { order: 'asc' }
    });

    // Update orders
    const updates = features.map((feature: Feature) => {
      let newOrderValue = feature.order;
      
      if (feature.id === featureId) {
        newOrderValue = newOrder;
      } else if (feature.order >= newOrder) {
        newOrderValue = feature.order + 1;
      }

      return prisma.feature.update({
        where: { id: feature.id },
        data: { order: newOrderValue }
      });
    });

    await Promise.all(updates);
    revalidatePath('/admin/pricing');
  }

  if (!config) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">No Pricing Configuration</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            There is no active pricing configuration. Click the button below to initialize with default settings.
          </p>
          <form action={initializePricing}>
            <Button type="submit">Initialize Pricing</Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pricing Configuration</h2>
        <p className="text-muted-foreground">
          Manage your product pricing and features
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Price Settings</h3>
          <form action={updatePricing} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Original Price ($)
                </label>
                <input
                  name="originalPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={(config.originalPrice / 100).toFixed(2)}
                  className="mt-1 block w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black shadow-sm focus:border-[#0aa6fd] focus:ring-[#0aa6fd] sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Current Price ($)
                </label>
                <input
                  name="currentPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={(config.currentPrice / 100).toFixed(2)}
                  className="mt-1 block w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black shadow-sm focus:border-[#0aa6fd] focus:ring-[#0aa6fd] sm:text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Update Pricing</Button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Features</h3>
            <form action={addFeature} className="flex gap-2">
              <input
                name="title"
                type="text"
                placeholder="Feature title"
                required
                className="rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black shadow-sm focus:border-[#0aa6fd] focus:ring-[#0aa6fd] sm:text-sm"
              />
              <input
                name="description"
                type="text"
                placeholder="Feature description"
                required
                className="rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black shadow-sm focus:border-[#0aa6fd] focus:ring-[#0aa6fd] sm:text-sm"
              />
              <Button type="submit">Add Feature</Button>
            </form>
          </div>
          
          <div className="space-y-4">
            {config.features.map((feature: Feature, index: number) => (
              <div
                key={feature.id}
                className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg"
              >
                <button className="cursor-move">
                  <IconGripVertical className="h-5 w-5 text-neutral-400" />
                </button>
                <div className="flex-1">
                  <h4 className="font-medium">{feature.title}</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {feature.description}
                  </p>
                </div>
                <form action={deleteFeature.bind(null, feature.id)}>
                  <Button
                    type="submit"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <IconTrash className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
