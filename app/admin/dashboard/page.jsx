"use client";

import axiosInstance from "@/utils/axios";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DashboardCard from "@/components/custom/DashboardCard";
import {
  Calendar,
  Users,
  Package2,
  CheckCircle2,
  AlertCircle,
  Receipt,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/matrics");
      console.log("dashboard response : ", response.data);
      setDashboard(response.data);
    } catch (err) {
      setError("Failed to load dashboard!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // if (dashboard === null) {
      fetchDashboard();
    // }
  }, []);

  console.log("dashboard : ", dashboard);

  const calculatePercentageIncrease = (current, previous) => {
    if (previous === 0) return "N/A";
    return (((current - previous) / previous) * 100).toFixed(2) + "% increase";
  };

  const filteredData = () => {
    if (
      !dashboard ||
      !dashboard.formattedResponse ||
      !Array.isArray(dashboard.formattedResponse)
    )
      return {
        totalUserCount: dashboard?.TotalUser || 0,
        totalPendingOrders: 0,
        totalDeliveredOrders: 0,
        totalResolvedTickets: 0,
        totalOpenTickets: 0,
        totalTransactions: 0,
        newUsers: 0,
        previousMonthData: {},
      };

    const currentMonth = dashboard.formattedResponse.filter(
      (item) => item.Date && item.Date !== "null"
    );
    const previousMonth = dashboard.previousMonthData || {};

    return currentMonth.reduce(
      (acc, item) => ({
        totalUserCount: dashboard.TotalUser,
        totalPendingOrders: acc.totalPendingOrders + item.PendingOrders,
        totalDeliveredOrders: acc.totalDeliveredOrders + item.DeliveredOrders,
        totalResolvedTickets: acc.totalResolvedTickets + item.ResolvedTickets,
        totalOpenTickets: acc.totalOpenTickets + item.UnresolvedTickets,
        totalTransactions: acc.totalTransactions + item.TotalTransactions,
        newUsers: acc.newUsers + item.NewUsers,
        previousMonthData: previousMonth,
      }),
      {
        totalUserCount: dashboard.TotalUser,
        totalPendingOrders: 0,
        totalDeliveredOrders: 0,
        totalResolvedTickets: 0,
        totalOpenTickets: 0,
        totalTransactions: 0,
        newUsers: 0,
        previousMonthData: previousMonth,
      }
    );
  };

  const counts = filteredData();
  const prevCounts = counts.previousMonthData;

  const stats = [
    {
      label: "Total Users",
      value: counts.totalUserCount,
      previousValue: prevCounts?.TotalUser || 0,
      icon: Users,
      color: "bg-blue-500",
      link: "/admin/users"
    },
    {
      label: "New Users",
      value: counts.newUsers,
      previousValue: prevCounts?.NewUsers || 0,
      icon: UserPlus,
      color: "bg-indigo-500",
      link: "/admin/users"
    },
    {
      label: "Pending Pickups",
      value: counts.totalPendingOrders,
      previousValue: prevCounts?.PendingOrders || 0,
      icon: Package2,
      color: "bg-amber-500",
      link: "/admin/pending-pickups"
    },
    {
      label: "Delivered Orders",
      value: counts.totalDeliveredOrders,
      previousValue: prevCounts?.DeliveredOrders || 0,
      icon: CheckCircle2,
      color: "bg-green-500",
      link: "/admin/shipments"
    },
    {
      label: "Open Tickets",
      value: counts.totalOpenTickets,
      previousValue: prevCounts?.UnresolvedTickets || 0,
      icon: AlertCircle,
      color: "bg-red-500",
    },
    {
      label: "Resolved Tickets",
      value: counts.totalResolvedTickets,
      previousValue: prevCounts?.ResolvedTickets || 0,
      icon: CheckCircle2,
      color: "bg-teal-500",
    },
    {
      label: "Transactions",
      value: counts.totalTransactions,
      previousValue: prevCounts?.TotalTransactions || 0,
      icon: Receipt,
      color: "bg-purple-500",
      link: "/admin/transactions"
    },
  ];

  const router = useRouter();

  return (
    <Card className="w-full bg-gray-50 p-6">
      <CardContent>
        <div className="flex flex-wrap align-center justify-between mb-3">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
        <div className="grid grid-cols-3 gap-6 mt-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md"
              onClick={() => router.push(stat.link || "")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </h3>
                </div>
                <div
                  className={`hidden md:flex p-1.5 rounded-lg ${stat.color}`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">
                  {calculatePercentageIncrease(stat.value, stat.previousValue)}
                </span>
                {/* <span className="text-gray-600 ml-1">from last month</span> */}
                {/* <Tooltip2 id="month-tooltip" place="top" effect="solid">
                  from last month
                </Tooltip2> */}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 h-[400px] bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activity Overview
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
