"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import axiosInstance from "@/utils/axios";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import Pagination from "@/components/custom/Pagination";

const Ndr = () => {
  const [ndrs, setNdrs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: new Date(2022, 0, 1),
    to: new Date(),
  });
  // State to track expanded rows by seller id
  const [expandedRows, setExpandedRows] = useState({});

  const pageSize = 10;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/ndr/fetchall");
      console.log(response.data.users);
      setNdrs(response.data.users);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalItems = ndrs?.length;
  const lastPageIndex = currentPage * pageSize;
  const firstPageIndex = lastPageIndex - pageSize;
//   const currentNdrs = ndrs?.slice(firstPageIndex, lastPageIndex);
  const currentNdrs = [];
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500 text-white";
      case "failed":
        return "bg-red-500 text-white";
      case "cancelled":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleDownloadExcel = async () => {
    // Implement Excel export logic using order data
  };

  const handleDownloadPDF = () => {
    // Implement PDF export logic using order data
  };

  // Toggle the expanded state for a seller row
  const toggleRow = (sellerId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [sellerId]: !prev[sellerId],
    }));
  };


  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">NDR Orders</CardTitle>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search orders..."
              className="border rounded-lg px-4 py-2 text-sm w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="export" onClick={() => setIsExporting(true)}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center gap-4 py-4">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "failed" ? "default" : "outline"}
              onClick={() => setStatusFilter("inTransit")}
            >
              In-Transit
            </Button>
            <Button
              variant={statusFilter === "failed" ? "default" : "outline"}
              onClick={() => setStatusFilter("delivered")}
            >
              Delivered
            </Button>
            <Button
              variant={statusFilter === "cancelled" ? "default" : "outline"}
              onClick={() => setStatusFilter("rto")}
            >
              RTO
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Seller Id</TableHead>
                  <TableHead>Seller Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Total NDRs</TableHead>
                  <TableHead>View Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentNdrs.map((ndr) => (
                  <React.Fragment key={ndr.user._id}>
                    <TableRow>
                      <TableCell>{ndr.user._id}</TableCell>
                      <TableCell>{ndr.user.name}</TableCell>
                      <TableCell>{ndr.user.address}</TableCell>
                      <TableCell>{ndr.user.phone}</TableCell>
                      <TableCell>{ndr.ndrOrders.length}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          onClick={() => toggleRow(ndr.user._id)}
                        >
                          {expandedRows[ndr.user._id] ? (
                            <ChevronDown />
                          ) : (
                            <ChevronRight />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedRows[ndr.user._id] && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-gray-50">
                          {/* Nested table with order details */}
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>AwB Number</TableHead>
                                <TableHead>Courier</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Shipment ID</TableHead>
                                <TableHead>Consignee</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Reason</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {ndr.ndrOrders.map((order) => (
                                <TableRow key={order.awb}>
                                  <TableCell>{order.awb}</TableCell>
                                  <TableCell>{order.courier}</TableCell>
                                  <TableCell>{order.createdAt}</TableCell>
                                  <TableCell>{order.shippingId.SHIPMENT_ID}</TableCell>
                                  <TableCell>{order.shippingId.consignee}</TableCell>
                                  <TableCell>{order.shippingId.status}</TableCell>
                                  <TableCell>{order.reasons}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </CardContent>
      <Dialog open={isExporting} onOpenChange={setIsExporting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Orders</DialogTitle>
            <DialogDescription>Choose export format</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleDownloadExcel}>
              <Download className="mr-2 h-4 w-4" /> Excel
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" /> PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Ndr;