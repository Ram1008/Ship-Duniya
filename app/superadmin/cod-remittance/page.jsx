"use client"
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/utils/axios";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Remetance = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31),
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [shippingPartner, setShippingPartner] = useState("All");
  const [dashboard, setDashboard] = useState(null);
  const [approved, setApproved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRemetance = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/shipping/cod-remittance");
      console.log("admin remittance res : ", response.data.data);
      const data = response.data.data;
      setDashboard(data);
    } catch (err) {
      setError("Failed to fetch table!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemetance();
  }, []);

  console.log("dashboard :", dashboard);

  // const approvedRemetance = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axiosInstance.patch(
  //       "/shipping/approve-remittance/${orderId}"
  //     );
  //     console.log("approve res : ", response.data);
  //     setApproved(response.data);
  //   } catch (error) {
  //     setError("Failed to fetch table!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const approvedRemetance = async (orderId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.patch(
        `/shipping/approve-remittance/${orderId}`
      );
      console.log("Approve response:", response.data);

      // Update UI optimistically
      setDashboard((prev) =>
        prev.map((item) =>
          item.orderId === orderId ? { ...item, status: "Approved" } : item
        )
      );
    } catch (error) {
      setError("Failed to approve remittance!");
    } finally {
      setLoading(false);
      setOpenDialog(false); // Close the dialog after approval
    }
  };

  useEffect(() => {
    approvedRemetance();
  }, []);

  const handleApprove = (orderId) => {
    approvedRemetance(orderId);
    console.log("Approved remittance for order ID:", orderId);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="mb-4 font-bold text-2xl">COD Remittance</CardTitle>
        <div className="flex flex-wrap align-center justify-between ">
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
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div>
          {loading ? (
            <Loader2 />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Select</TableHead>
                  <TableHead className="text-left">Order ID</TableHead>
                  {/* <TableHead className="hidden md:table-cell text-left ">
                    Shipment ID
                  </TableHead> */}
                  {/* <TableHead className="text-left">AWB Number</TableHead> */}
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-left">Consignee</TableHead>
                  {/* <TableHead className="text-left">Pincode</TableHead> */}
                  <TableHead className="text-left">Courier Name</TableHead>
                  <TableHead className="text-left">Remittance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboard &&
                  dashboard?.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="font-medium">
                        <input type="checkbox" />
                      </TableCell>
                      <TableCell className="font-medium text-blue-500">
                        {item.orderId}
                      </TableCell>
                      {/* <TableCell className="font-medium hidden md:table-cell">{item.shipmentId}</TableCell> */}
                      {/* <TableCell className="font-medium">{item.awbNumber}</TableCell> */}
                      {/* <TableCell className="font-medium">{item.updatedAt}</TableCell> */}
                      <TableCell className="font-medium">
                        {new Date(item.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })}
                      </TableCell>

                      <TableCell className="font-medium">
                        {item.consignee}
                      </TableCell>
                      {/* <TableCell className="font-medium">{item.pincode}</TableCell> */}
                      <TableCell className="font-medium">
                        {item.courierName}
                      </TableCell>
                      <TableCell className="font-medium">
                        <Button onClick={() => setOpenDialog(true)}>
                          {item.remetance}Action
                        </Button>
                      </TableCell>
                      {/* Dialog box */}
                      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Approve Remittance</DialogTitle>
                          </DialogHeader>
                          <span className="text-gray-600 text-base">
                            Are you sure you want to approve this remittance?
                          </span>
                          <div className="flex flex-col">
                            <h2>Order ID : {item.orderId}</h2>
                            <h3>{item.remetance}</h3>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button
                                className="bg-blue-500"
                                onClick={() => handleApprove(item.orderId)}
                              >
                                {loading ? "Approving..." : "Approve"}
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Remetance;
