"use client";

import axiosInstance from '@/utils/axios';
import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import DashboardCard from '../_components/DashboardCard';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(2023, 0, 1),
    to: new Date(),
  });
  const [shippingPartner, setShippingPartner] = useState("All");

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/users/matrics");
      setDashboard(response.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const filterAndCount = (data = []) => {
    const filteredByDate = data.filter((item) => {
      if (!item.date) return false;
      const [day, month, year] = item.date.split("-").map(Number);
      const itemDate = new Date(year, month - 1, day);
      return (
        dateRange?.from &&
        dateRange?.to &&
        itemDate >= dateRange.from &&
        itemDate <= dateRange.to
      );
    });
    const filteredByPartner =
      shippingPartner === "All"
        ? filteredByDate
        : filteredByDate.filter(
            (item) =>
              item.partner?.toLowerCase() === shippingPartner.toLowerCase()
          );
    return filteredByPartner.length;
  };
  
  const counts = useMemo(() => {
    if (!dashboard) {
      return {
        totalDeliveredCount: 0,
        totalInTransitCount: 0,
        totalLostCount: 0,
        totalParcelsCount: 0,
        totalPendingPickupCount: 0,
        totalRTOCount: 0,
      };
    }
    return {
      totalDeliveredCount: filterAndCount(dashboard.totaldelivered),
      totalInTransitCount: filterAndCount(dashboard.totalIntransit),
      totalLostCount: filterAndCount(dashboard.totallost),
      totalParcelsCount: filterAndCount(dashboard.totalparcels),
      totalPendingPickupCount: filterAndCount(dashboard.totalpendingpickup),
      totalRTOCount: filterAndCount(dashboard.totalrto),
    };
  }, [dashboard, dateRange, shippingPartner]);

  
  const pieData = [
    { name: "Delivered", value: counts.totalDeliveredCount },
    { name: "RTO", value: counts.totalRTOCount },
    { name: "Pending-Pickup", value: counts.totalPendingPickupCount },
    { name: "In-Transit", value: counts.totalInTransitCount },
    { name: "Lost", value: counts.totalLostCount },
  ];

  const percentageData = pieData.map((item) => ({
    name: item.name,
    value:
      counts.totalParcelsCount > 0
        ? parseFloat(((item.value / counts.totalParcelsCount) * 100).toFixed(1))
        : 0, // Avoid division by zero
  }));

  const COLORS = ["#28A745", "#FF6347", "#FFD700", "#007BFF", "#DC3545"];

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="mt-4">
          <div className="text-center py-10">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="mt-4">
          <div className="text-center py-10 text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="mt-4">
        <div className="flex flex-wrap items-center justify-between mb-3">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <div className="w-[228px]">
            <Select value={shippingPartner} onValueChange={setShippingPartner}>
              <SelectTrigger>
                <SelectValue placeholder="Select shipping partner" />
              </SelectTrigger>
              <SelectContent>
                {["All", "Xpressbees", "Ecom", "Delhivery"].map((partner) => (
                  <SelectItem key={partner} value={partner}>
                    {partner}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard title="Total Parcels" value={counts.totalParcelsCount} />
          <DashboardCard title="Total Delivered" value={counts.totalDeliveredCount} />
          <DashboardCard title="Total RTO" value={counts.totalRTOCount} />
          <DashboardCard title="Total Pending Pickup" value={counts.totalPendingPickupCount} />
          <DashboardCard title="Total In-Transit" value={counts.totalInTransitCount} />
          <DashboardCard title="Total Lost" value={counts.totalLostCount} />
        </div>
        <div className="h-[400px] w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={percentageData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {percentageData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
