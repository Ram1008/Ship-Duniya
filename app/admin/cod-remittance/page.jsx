"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Loader2, Package } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ShipmentTable from "../_components/ShipmentTable";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RemetanceTable from "../_components/RemetanceTable";

function RemetanceCard({ title, value }) {
  return (
   <div className="rounded-lg bg-white p-6 shadow hover:shadow-md transition-shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-700">{value}</p>
    </div>
  );
}

const Remetences = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31),
  });
  const [shippingPartner, setShippingPartner] = useState("All");
  const [dashboard, setDashboard] = useState(null);
const [userDetails, setUserDetails] = useState(null);
  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get("/users/profile");
      setUserDetails(response.data);
    } catch (err) {}
  };

  useEffect(() =>{
    fetchUserData();
  }, [])

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        "/shipping/cod-admin-remittance-summary"
      );
      console.log("admin remittance res : ", response.data.data);
      setDashboard(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

 const filteredData = () => {
   if (!dashboard || !dashboard.codRemittance) {
     return {
       TotalRemetence: 0,
       PaidRemetence: 0,
       NextExpectedRemetence: 0,
       RemainingRemetence: 0,
       previousMonthData: {},
     };
   }

   // Extracting values from backend response
   const totalRemittance = dashboard.totalRemittance || 0;
   const paidRemittance = dashboard.paidRemittance || 0;
   const nextExpectedRemittance = dashboard.nextExpectedRemittance || 0;
   const codRemittance = dashboard.codRemittance || 0;

   // Calculate remaining remittance
   const remainingRemittance = totalRemittance - paidRemittance;

   return {
     TotalRemetence: totalRemittance,
     PaidRemetence: paidRemittance,
     NextExpectedRemetence: nextExpectedRemittance,
     RemainingRemetence: remainingRemittance,
     previousMonthData: dashboard.previousMonthData || {},
   };
 };

  const counts = filteredData();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="mb-4 font-bold text-2xl">COD Remittance</CardTitle>
        <div className="flex flex-wrap align-center justify-between">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <div className="w-[228px]">
            <Select
              value={shippingPartner}
              onValueChange={(value) => setShippingPartner(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select shipping partner" />
              </SelectTrigger>
              <SelectContent>
                {["All", "xpressbees", "ECom", "Delhivery"].map((partner) => (
                  <SelectItem key={partner} value={partner}>
                    {partner}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <RemetanceCard
            title="Total Remittance"
            value={counts.TotalRemetence}
          />
          <RemetanceCard title="Paid Remittance" value={counts.PaidRemetence} />
          <RemetanceCard
            title="Next Expected Remittance"
            value={counts.NextExpectedRemetence}
          />
          <RemetanceCard
            title="Remaining Remittance"
            value={counts.RemainingRemetence}
          />
        </div>
        <div>
          <RemetanceTable dateRange={dateRange} shippingPartner={shippingPartner} userDetails={userDetails} />
        </div>
      </CardContent>
    </Card>
  );
};

export default Remetences;
