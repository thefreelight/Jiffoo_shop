"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { Card } from "@/components/ui/card";
import { IconCalendar } from "@tabler/icons-react";
import { format } from "date-fns";

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onRangeChange: (startDate: Date, endDate: Date) => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  onRangeChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const presetRanges = [
    {
      label: "Last 7 days",
      onClick: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);
        onRangeChange(start, end);
      },
    },
    {
      label: "Last 30 days",
      onClick: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        onRangeChange(start, end);
      },
    },
    {
      label: "This month",
      onClick: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        onRangeChange(start, end);
      },
    },
    {
      label: "Last month",
      onClick: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        onRangeChange(start, end);
      },
    },
    {
      label: "Last 3 months",
      onClick: () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(end.getMonth() - 3);
        onRangeChange(start, end);
      },
    },
    {
      label: "This year",
      onClick: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const end = new Date(now.getFullYear(), 11, 31);
        onRangeChange(start, end);
      },
    },
  ];

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <IconCalendar className="h-4 w-4" />
        <span>
          {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
        </span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 top-full mt-2 z-50 p-4 w-64">
            <div className="space-y-2">
              {presetRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => {
                    range.onClick();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
} 