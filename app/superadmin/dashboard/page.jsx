"use client";
import axiosInstance from "@/utils/axios";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DashboardCard from "@/components/custom/DashboardCard";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31),
  });
  const [shippingPartner, setShippingPartner] = useState("All");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/users");
      console.log("All users", response.data);
      const data = response.data;
      setDashboard(data);
    } catch (err) {
      setError("Failed to load dashboard!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dashboard === null) {
      fetchDashboard();
    }
  }, [dashboard]);

  const filteredData = ( ) => {
    if (!dashboard) {
      console.log("Data is undefined or null");
      return [];
    }
    const filterByDate = () => {
      // console.log("data", data);
      return dashboard?.filter((item) => {
        const data = new Date(item.createdAt);
        const date = new Date(data.getFullYear(), data.getMonth(), data.getDate());
        return date >= dateRange.from && date <= dateRange.to;
      });
    };

    const filterByPartner = () => {
      if (shippingPartner === "All") {
        return dashboard;
      }
      return dashboard.filter((item) => item.partner === shippingPartner);

    };

    const filterAndCount = () => {
      let filtered = filterByDate(dashboard);
      filtered = filterByPartner(filtered);
      // console.log("filtered", filtered);
      return filtered?.length;
    };

    const dashboardData = dashboard;
    console.log("dashboardData : ", dashboardData);

    const totalUsersCount = filterAndCount(dashboardData?.TotalUsers);
    console.log("totalUsersCount", totalUsersCount);
    const totalDeliveredCount = filterAndCount(dashboardData?.TotalDelivered);
    const totalInTransitCount = filterAndCount(dashboardData?.TotalInTransit);
    const totalLostCount = filterAndCount(dashboardData?.TotalLost);
    const totalParcelsCount = filterAndCount(dashboardData?.TotalParcels);
    const totalPendingPickupCount = filterAndCount(
      dashboardData?.TotalPendingPickup
    );
    const totalRTOCount = filterAndCount(dashboardData?.TotalRTO);

    return {
      totalUsersCount,
      totalDeliveredCount,
      totalInTransitCount,
      totalLostCount,
      totalParcelsCount,
      totalPendingPickupCount,
      totalRTOCount,
    };
  };

  const counts = filteredData();
  // console.log("counts", counts);

  const data = [
    { name: "Users", value: counts.totalUsersCount },
    { name: "Delivered", value: counts.totalDeliveredCount },
    { name: "RTO", value: counts.totalRTOCount },
    { name: "Pending-Pickup", value: counts.totalPendingPickupCount },
    { name: "In-Transit", value: counts.totalInTransitCount },
    { name: "Lost", value: counts.totalLostCount },
  ];

  const COLORS = ["#28A745", "#FF6347", "#FFD700", "#007BFF", "#DC3545"];

  return (
    <Card className="w-full">
      <CardContent className="mt-4">
        <div className="flex flex-wrap align-center justify-between mb-3">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <div className="w-[228px]">
            <Select
              value={shippingPartner}
              onValueChange={(value) => setShippingPartner(value)}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Select shipping partner" />
              </SelectTrigger>
              <SelectContent>
                {["All", "Expressbeez", "ECom", "Delhivery"].map((partner) => (
                  <SelectItem key={partner} value={partner}>
                    {partner}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Users"
            value={counts.totalUsersCount}
          />
          <DashboardCard
            title="Active Parcels"
            value={counts.totalDeliveredCount}
          />
          <DashboardCard title="Total RTO" value={counts.totalRTOCount} />
          <DashboardCard
            title="Total Pending Pickup"
            value={counts.totalPendingPickupCount}
          />
          <DashboardCard
            title="Total In-Transit"
            value={counts.totalInTransitCount}
          />
          <DashboardCard title="Total Lost" value={counts.totalLostCount} />
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
