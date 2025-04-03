"use client";

import axiosInstance from "@/utils/axios";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  const [tickets, setTickets] = useState(null);
  const [ndrs, setNdrs] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });
  const [error, setError] = useState(null);

  // Fetch dashboard data from the API
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/support/matrics");
      console.log("Dashboard res:", response.data);
      setTickets(response.data.tickets);
      setNdrs(response.data.ndrs);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError("Failed to load dashboard!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Filter and sum values based on the selected date range
  const filteredData = useMemo(() => {
    const filterByDate = (data) => {
      return data?.filter((item) => {
        // Assumes date is in "DD-MM-YYYY" format
        const [day, month, year] = item.date.split("-").map(Number);
        const itemDate = new Date(year, month - 1, day);
        return (
          dateRange?.from &&
          dateRange?.to &&
          itemDate >= dateRange.from &&
          itemDate <= dateRange.to
        );
      }) || [];
    };

    const sumValues = (data) =>
      data.reduce((sum, item) => sum + item.value, 0);

    return {
      openTickets: sumValues(filterByDate(tickets?.openTickets || [])),
      inProgressTickets: sumValues(filterByDate(tickets?.inProgressTickets || [])),
      resolvedTickets: sumValues(filterByDate(tickets?.resolvedTickets || [])),
      openNdrs: sumValues(filterByDate(ndrs?.openNdrs || [])),
      rtoNdrs: sumValues(filterByDate(ndrs?.rtoNdrs || [])),
      deliveredNdrs: sumValues(filterByDate(ndrs?.deliveredNdrs || [])),
    };
  }, [tickets, ndrs, dateRange]);

  // Use memoized values for chart data to avoid recalculation
  const ticketsData = useMemo(() => [
    { name: "Open Tickets", value: filteredData.openTickets, color: "#0088FE" },
    {
      name: "In Progress Tickets",
      value: filteredData.inProgressTickets,
      color: "#00C49F",
    },
    {
      name: "Resolved Tickets",
      value: filteredData.resolvedTickets,
      color: "#FFBB28",
    },
  ], [filteredData]);

  const ndrsData = useMemo(() => [
    { name: "Open NDR", value: filteredData.openNdrs, color: "#00CED1" },
    { name: "Delivered NDR", value: filteredData.deliveredNdrs, color: "#800080" },
    { name: "RTO NDR", value: filteredData.rtoNdrs, color: "#FFA500" },
  ], [filteredData]);

  const COLORS = useMemo(() => ["#28A745", "#FF6347", "#FFD700", "#007BFF", "#DC3545"], []);

  if (loading) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <div>Loading...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full overflow-hidden">
      <div className="p-4 h-full overflow-auto">
        <CardContent className="mt-4">
          {/* Date Picker for selecting date range */}
          <div className="flex flex-wrap items-center justify-between mb-3">
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>

          {/* Ticket Summary Cards */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-3">Ticket Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DashboardCard title="Pending" value={filteredData.openTickets} />
              <DashboardCard title="In Progress" value={filteredData.inProgressTickets} />
              <DashboardCard title="Resolved" value={filteredData.resolvedTickets} />
            </div>
          </div>

          {/* NDR Summary Cards */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-3">NDR Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DashboardCard title="Open NDR" value={filteredData.openNdrs} />
              <DashboardCard title="Delivered NDR" value={filteredData.deliveredNdrs} />
              <DashboardCard title="RTO NDR" value={filteredData.rtoNdrs} />
            </div>
          </div>

          {/* Charts Section */}
          <div className="h-[400px] flex flex-wrap justify-around items-center mt-8 border-t-2 pt-4 pb-4">
            <div className="w-[40%] h-full">
              <h2 className="text-xl font-semibold text-center mb-4">Ticket Chart</h2>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ticketsData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                    {ticketsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-[40%] h-full">
              <h2 className="text-xl font-semibold text-center mb-4">NDR Chart</h2>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ndrsData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                    {ndrsData.map((entry, index) => (
                      <Cell key={`cell2-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default Dashboard;
