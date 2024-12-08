"use client";

import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  parseISO,
  subMonths,
} from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { DateRangePicker } from "@/components/admin/date-range-picker";
import { useState, useEffect } from "react";
import { exportToCSV } from "@/lib/export";
import { Button } from "@/components/button";
import { IconDownload } from "@tabler/icons-react";

interface DailyStats {
  date: string;
  revenue: number;
  orders: number;
  users: number;
  commissions: number;
}

interface Order {
  createdAt: Date;
  amount: number;
}

interface User {
  createdAt: Date;
}

interface Commission {
  createdAt: Date;
  amount: number;
}

async function getStats(startDate: Date, endDate: Date): Promise<DailyStats[]> {
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const orders = await prisma.purchase.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: "completed",
    },
    select: {
      createdAt: true,
      amount: true,
    },
  });

  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      createdAt: true,
    },
  });

  const commissions = await prisma.commission.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      createdAt: true,
      amount: true,
    },
  });

  return days.map(day => {
    const dayStart = startOfMonth(day);
    const dayEnd = endOfMonth(day);

    const dayOrders = orders.filter((order: Order) => 
      order.createdAt >= dayStart && order.createdAt <= dayEnd
    );
    const dayUsers = users.filter((user: User) => 
      user.createdAt >= dayStart && user.createdAt <= dayEnd
    );
    const dayCommissions = commissions.filter((commission: Commission) => 
      commission.createdAt >= dayStart && commission.createdAt <= dayEnd
    );

    return {
      date: format(day, 'MMM d'),
      revenue: dayOrders.reduce((sum: number, order: Order) => sum + order.amount, 0),
      orders: dayOrders.length,
      users: dayUsers.length,
      commissions: dayCommissions.reduce((sum: number, commission: Commission) => sum + commission.amount, 0),
    };
  });
}

export default function AnalyticsPage() {
  const [startDate, setStartDate] = useState(() => startOfMonth(subMonths(new Date(), 1)));
  const [endDate, setEndDate] = useState(() => endOfMonth(new Date()));
  const [stats, setStats] = useState<DailyStats[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getStats(startDate, endDate);
      setStats(data);
    };
    fetchStats();
  }, [startDate, endDate]);

  const totalRevenue = stats.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = stats.reduce((sum, day) => sum + day.orders, 0);
  const totalUsers = stats.reduce((sum, day) => sum + day.users, 0);
  const totalCommissions = stats.reduce((sum, day) => sum + day.commissions, 0);

  const handleExport = () => {
    const exportData = stats.map(day => ({
      Date: day.date,
      Revenue: `$${(day.revenue / 100).toFixed(2)}`,
      Orders: day.orders,
      "New Users": day.users,
      Commissions: `$${(day.commissions / 100).toFixed(2)}`,
    }));

    exportToCSV(exportData, `analytics-${format(startDate, 'yyyy-MM-dd')}-to-${format(endDate, 'yyyy-MM-dd')}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Performance overview
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <IconDownload className="h-4 w-4" />
            Export Data
          </Button>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onRangeChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-neutral-500">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold">${(totalRevenue / 100).toFixed(2)}</p>
          <div className="mt-4">
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats}>
                  <defs>
                    <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0aa6fd" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0aa6fd" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0aa6fd"
                    fillOpacity={1}
                    fill="url(#revenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-neutral-500">Total Orders</h3>
          <p className="mt-2 text-3xl font-bold">{totalOrders}</p>
          <div className="mt-4">
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats}>
                  <defs>
                    <linearGradient id="orders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2a2bdb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2a2bdb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#2a2bdb"
                    fillOpacity={1}
                    fill="url(#orders)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-neutral-500">New Users</h3>
          <p className="mt-2 text-3xl font-bold">{totalUsers}</p>
          <div className="mt-4">
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats}>
                  <defs>
                    <linearGradient id="users" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0aa6fd" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0aa6fd" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#0aa6fd"
                    fillOpacity={1}
                    fill="url(#users)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-neutral-500">Total Commissions</h3>
          <p className="mt-2 text-3xl font-bold">${(totalCommissions / 100).toFixed(2)}</p>
          <div className="mt-4">
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats}>
                  <defs>
                    <linearGradient id="commissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2a2bdb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2a2bdb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="commissions"
                    stroke="#2a2bdb"
                    fillOpacity={1}
                    fill="url(#commissions)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-6">Detailed Analytics</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#0aa6fd"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="orders"
                name="Orders"
                stroke="#2a2bdb"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="users"
                name="Users"
                stroke="#10b981"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="commissions"
                name="Commissions"
                stroke="#f59e0b"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium">Daily Breakdown</h3>
        <div className="mt-6">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-neutral-500">
                <th className="text-left font-medium">Date</th>
                <th className="text-right font-medium">Revenue</th>
                <th className="text-right font-medium">Orders</th>
                <th className="text-right font-medium">Users</th>
                <th className="text-right font-medium">Commissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {stats.map((day) => (
                <tr key={day.date}>
                  <td className="py-4">{day.date}</td>
                  <td className="py-4 text-right">${(day.revenue / 100).toFixed(2)}</td>
                  <td className="py-4 text-right">{day.orders}</td>
                  <td className="py-4 text-right">{day.users}</td>
                  <td className="py-4 text-right">${(day.commissions / 100).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
} 