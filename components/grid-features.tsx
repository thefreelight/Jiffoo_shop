import { cn } from "@/lib/utils";
import {
  IconTerminal2,
  IconBolt,
  IconCurrencyDollar,
  IconCloud,
  IconUsers,
  IconHeadset,
  IconCode,
  IconRocket
} from "@tabler/icons-react";

export const GridFeatures = () => {
  const features = [
    {
      title: "Built for developers",
      description: "Production-ready AI source code for developers who want to build and ship fast.",
      icon: <IconTerminal2 />,
    },
    {
      title: "Rapid deployment",
      description: "Deploy your AI application in minutes, not months. Just clone, configure, and launch.",
      icon: <IconRocket />,
    },
    {
      title: "Transparent pricing",
      description: "Clear one-time payment for each template. No subscriptions, no hidden fees.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "Cloud-ready",
      description: "All templates are tested and optimized for major cloud platforms.",
      icon: <IconCloud />,
    },
    {
      title: "Modern tech stack",
      description: "Built with the latest AI technologies and frameworks for optimal performance.",
      icon: <IconCode />,
    },
    {
      title: "Developer support",
      description: "Get technical assistance from our experienced AI engineers.",
      icon: <IconHeadset />,
    },
    {
      title: "Active community",
      description: "Join a growing community of developers building amazing AI applications.",
      icon: <IconUsers />,
    },
    {
      title: "Regular updates",
      description: "Continuous improvements and new features to stay ahead in AI development.",
      icon: <IconBolt />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
};

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover:opacity-100 transition duration-200 group absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover:opacity-100 transition duration-200 group absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10">{icon}</div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover:bg-gradient-to-b from-[#0aa6fd] to-[#2a2bdb] transition duration-200" />
        <span className="group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#0aa6fd] group-hover:to-[#2a2bdb] group-hover:bg-clip-text transition duration-200 inline-block">
          {title}
        </span>
      </div>
      <p className="text-sm text-muted dark:text-muted-dark max-w-xs mx-auto relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
