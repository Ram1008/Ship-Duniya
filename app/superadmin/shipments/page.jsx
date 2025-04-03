"use client";

import { Card, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/utils/axios";
import { CardContent } from "@mui/material";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Shipment = () => {
  const [loading, setLoading] = useState(false);
  const [shipments, setShipments] = useState(null);
  const [orderType, setOrderType] = useState("");
  const [partnerType, setPartnerType] = useState("");
  const [dateRange, setDateRange] = useState({
    from: new Date(2022, 0, 1),
    to: new Date(),
  });
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/shipping/");
      console.log("fetch NDR: ", response.data);
      setShipments(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const filteredShipments = shipments?.filter(item =>
    partnerType === "All" || partnerType === "" ? true : item.PARTNER_Name === partnerType
  );

  const toggleSelectShipment = (shipment) => {
    setSelectedShipments((prev) =>
      prev.includes(shipment._id)
        ? prev.filter((o) => o !== shipment._id)
        : [...prev, shipment._id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedShipments([]);
    } else {
      setSelectedShipments(filteredShipments.map((shipment) => shipment._id));
    }
    setSelectAll(!selectAll);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center pt-2">
        <div>
  <h1 className="font-bold text-2xl">Shipments</h1>
</div>

          <div className="flex flex-wrap items-center gap-4">
           
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />

            <div className="w-[120px]">
              <Select
                value={orderType}
                onValueChange={(value) => setOrderType(value)}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Order type" />
                </SelectTrigger>
                <SelectContent>
                  {["All", "prepaid", "COD"].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[180px]">
              <Select
                value={partnerType}
                onValueChange={(value) => setPartnerType(value)}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Choose courier partner" />
                </SelectTrigger>
                <SelectContent>
                  {["All", "Xpressbees", "Air Xpressbees 0.5 K.G", "Surface Xpressbees 0.5 K.G"].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden md:table-cell text-left ">
                  Shipment ID
                </TableHead>
                <TableHead className="text-left">AWB Number</TableHead>
                <TableHead className="text-left">Date</TableHead>
                <TableHead className="text-left">Consignee</TableHead>
                <TableHead className="text-left">Pincode</TableHead>
                <TableHead className="text-left">Courier Name</TableHead>
                <TableHead className="text-left">Order ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments?.map((shipment, idx) => (
                <TableRow key={idx}>
                  <TableCell className="hidden md:table-cell text-left font-semibold">
                    {shipment.SHIPMENT_ID}
                  </TableCell>
                  <TableCell className="text-left text-blue-500 font-semibold">
                    {shipment.awbNumber}
                  </TableCell>
                  <TableCell className="text-left">{shipment.createdAt}</TableCell>
                  <TableCell className="text-left">{shipment.consignee}</TableCell>
                  <TableCell className="text-left">
                    {shipment.RETURN_PINCODE}
                  </TableCell>
                  <TableCell className="text-left">
                    {shipment.PARTNER_Name}
                  </TableCell>
                  <TableCell className="text-left">{shipment.orderId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default Shipment;

