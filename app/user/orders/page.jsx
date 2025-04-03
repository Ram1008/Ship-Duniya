"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect, useMemo, useCallback } from "react";
import axiosInstance from "@/utils/axios";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2 } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/custom/Pagination";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import ShipOrders from "../_components/ShipOrders";
import BulkOrder from "../_components/BulkOrder";
import OrdersTable from "../_components/OrdersTable";
import OrderView from "../_components/OrderView";
import OrderForm from "./create/page";
import { useRouter } from "next/navigation";

const OrdersPage = () => {
  const [userType, setUserType] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [isShipping, setIsShipping] = useState(false);
  const [viewDetails, setViewDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    from: new Date(2022, 0, 1),
    to: new Date(),
  });
  const [orderType, setOrderType] = useState("All");
  const [viewShipped, setViewShipped] = useState(false);
  const [viewNotShipped, setViewNotShipped] = useState(false);
  const [createForwardSingleOrder, setCreateForwardSingleOrder] = useState(false);
  const [createReverseSingleOrder, setCreateReverseSingleOrder] = useState(false);
  const [createForwardBulkOrder, setCreateForwardBulkOrder] = useState(false);
  const [createReverseBulkOrder, setCreateReverseBulkOrder] = useState(false);
  const { toast } = useToast();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/users/profile", {
          signal: controller.signal,
        });
        setUserType(response.data.userType)
      } catch (err) {
        if (err.name === "CanceledError") {
          // Request was canceled – no further action needed.
        } else {
          console.error("Error fetching user data:", err);
          setError("Failed to fetch user data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    return () => {
      controller.abort();
    };
  }, []);
  
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/orders");
      setOrders(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const matchesDateRange =
        (!dateRange.from || orderDate >= dateRange.from) &&
        (!dateRange.to || orderDate <= dateRange.to);
      const matchesOrderType =
        orderType && orderType !== "All"
          ? order.orderType?.toLowerCase() === orderType.toLowerCase()
          : true;
      const matchesShippedStatus =
        (viewShipped && order.shipped) ||
        (viewNotShipped && !order.shipped) ||
        (!viewShipped && !viewNotShipped);
      const matchesSearchQuery =
        searchQuery === "" ||
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.telephone &&
          order.telephone.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.mobile &&
          order.mobile.toLowerCase().includes(searchQuery.toLowerCase()));

      return (
        matchesDateRange &&
        matchesOrderType &&
        matchesShippedStatus &&
        matchesSearchQuery
      );
    });
  }, [orders, dateRange, orderType, viewShipped, viewNotShipped, searchQuery]);

  // Separate not shipped and shipped orders
  const notShippedOrders = useMemo(() => {
    return filteredOrders.filter(order => !order.shipped && !order.isCancelled).sort((a, b) => {
      const weightA = Math.max(a.actualWeight || 0, a.volumetricWeight || 0);
      const weightB = Math.max(b.actualWeight || 0, b.volumetricWeight || 0);
      return weightA - weightB;
    });
  }, [filteredOrders]);

  const shippedOrders = useMemo(() => {
    return filteredOrders.filter(order => order.shipped && !order.isCancelled);
  }, [filteredOrders]);

  const cancelledOrders = useMemo(() => {
    return filteredOrders.filter(order => order.isCancelled);
  }, [filteredOrders]);

  // Calculate pagination for not shipped orders
  const notShippedPages = Math.ceil(notShippedOrders.length / pageSize);
  const shippedPages = Math.ceil(shippedOrders.length / pageSize);
  
  // Combine orders with not shipped first, maintaining page size
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    
    // If we're within the not shipped orders pages
    if (currentPage <= notShippedPages) {
      return notShippedOrders.slice(start, start + pageSize);
    }
    
    // If we're within the shipped orders pages
    if (currentPage <= notShippedPages + shippedPages) {
      const shippedStart = start - notShippedOrders.length;
      return shippedOrders.slice(shippedStart, shippedStart + pageSize);
    }
    
    // If we're past both not shipped and shipped orders, show cancelled orders
    const cancelledStart = start - notShippedOrders.length - shippedOrders.length;
    return cancelledOrders.slice(cancelledStart, cancelledStart + pageSize);
  }, [currentPage, pageSize, notShippedOrders, shippedOrders, cancelledOrders, notShippedPages, shippedPages]);

  // Update total items for pagination
  const totalItems = notShippedOrders.length + shippedOrders.length + cancelledOrders.length;

  const handleBackToList = useCallback(() => {
    setSelectedOrder([]);
    setViewDetails(false);
  }, []);

  const handleDownloadExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Orders");
      const headings = [
        "Order ID",
        "Date",
        "Method",
        "Consignee",
        "Pincode",
        "Description",
        "Phone",
        "Weight",
        "Quantity",
      ];
      worksheet.addRow(headings);
      filteredOrders.forEach((order) => {
        worksheet.addRow([
          order.orderId,
          new Date(order.createdAt).toLocaleDateString(),
          order.orderType || order.PRODUCT,
          order.consignee,
          order.pincode,
          order.itemDescription || order.ITEM_DESCRIPTION,
          order.mobile || order.MOBILE,
          Math.max(order.actualWeight || 0, order.volumetricWeight || 0),
          order.quantity,
        ]);
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "orders.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export Excel");
    }
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      const tableColumn = [
        "Order ID",
        "Date",
        "Method",
        "Consignee",
        "Pincode",
        "Description",
        "Phone",
        "Weight",
        "Quantity",
      ];
      const tableRows = filteredOrders.map((order) => [
        order.orderId,
        new Date(order.createdAt).toLocaleDateString(),
        order.orderType || order.PRODUCT,
        order.consignee,
        order.pincode,
        order.itemDescription || order.ITEM_DESCRIPTION,
        order.mobile || order.MOBILE,
        Math.max(order.actualWeight || 0, order.volumetricWeight || 0),
        order.quantity,
      ]);
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
      });
      doc.save("orders.pdf");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  

  const createReverseOrder = async (values) => {
    try {
      const response = await axiosInstance.post(
        "/orders/create-reverse-order",
        { order: values }
      );
      if (response.data.success) {
        setCreateReverseSingleOrder(false);
        fetchOrders();
        toast.success("Order added successfully!");
      }
    } catch (e) {
      console.error(e);
      console.error("Unable to create order, try again.");
    }
  };

  const handleForwardBulkOrder = async (formData) => {
    try {
      const response = await axiosInstance.post(
        "/orders/create-forward-order",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.status === 200) {
        toast({
          title: "Bulk order processed successfully!",
          variant: "success",
        });
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Error processing bulk order",
        description: e.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReverseBulkOrder = async (file) => {
    try {
      // Add API call or processing for reverse bulk order if needed
      console.log(file);
      toast.success("Reverse bulk order processed successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Error processing reverse bulk order.");
    }
  };

  const renderOrderList = () => (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Orders</CardTitle>
          <input
            type="text"
            placeholder="Search by order Id or consignee name"
            className="border rounded-lg px-4 py-2 text-sm w-[50%] focus:outline-none focus:ring focus:ring-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="export"
            size="lg"
            className="h-10"
            onClick={() => setIsExportDialogOpen((prev) => !prev)}
          >
            <span className="text-lg">+ Export </span>
          </Button>
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Export</DialogTitle>
                <DialogDescription>
                  Download Excel or PDF.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-around">
                <Button
                  variant="outline"
                  onClick={handleDownloadExcel}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Excel
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadPDF}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                <div className="w-[120px]">
                  <Select
                    value={orderType}
                    onValueChange={(value) => setOrderType(value)}
                  >
                    <SelectTrigger>
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
                <button
                  className={`text-sm font-semibold px-4 py-2 rounded-lg ${
                    viewShipped ? "bg-primary shadow-lg" : "bg-primary"
                  } text-primary-foreground`}
                  onClick={() => {
                    setViewShipped(!viewShipped);
                    setViewNotShipped(false);
                  }}
                >
                  View Shipped
                </button>
                <button
                  className={`text-sm font-semibold px-4 py-2 rounded-lg ${
                    viewNotShipped ? "bg-primary shadow-lg" : "bg-primary"
                  } text-primary-foreground`}
                  onClick={() => {
                    setViewNotShipped(!viewNotShipped);
                    setViewShipped(false);
                  }}
                >
                  View Not Shipped
                </button>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="export"
                  className="h-8"
                    onClick={() => {
                      setCreateForwardSingleOrder(true);
                      router.push("/user/orders/create");
                    }}
                >
                  <span>+ Create Order </span>
                </Button>
                <Button
                  variant="export"
                  className="h-8"
                  onClick={() => setCreateForwardBulkOrder(true)}
                >
                  <span>+ Bulk Upload </span>
                </Button>
              </div>
            </div>
            <OrdersTable
              orders={paginatedOrders}
              loading={loading}
              setLoading={setLoading}
              setViewDetails={setViewDetails}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
              setIsShipping={setIsShipping}
              fetchOrders={fetchOrders}
            />
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderView = () => {
    if (createForwardSingleOrder) {
      return (
        <OrderForm/>
      );
    }
    if (createReverseSingleOrder) {
      return (
        <OrderForm
          onSubmit={createReverseOrder}
          setIsAddingOrder={setCreateReverseSingleOrder}
        />
      );
    }
    if (viewDetails) {
      return (
        <OrderView order={selectedOrder} handleBackToList={handleBackToList} />
      );
    }
    if (isShipping) {
      return (
        <ShipOrders
          setIsShipping={setIsShipping}
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          userType={userType}
          handleBookShipment={handleBookShipment}
        />
      );
    }
    return renderOrderList();
  };

  const goBack = () => {
    setSelectedOrder([]);
    setIsShipping(false);
  };
  
  const handleBookShipment = async (selectedPartner, shippingInfo) => {
    if (!selectedPartner) return;
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/shipping/create-forward-shipping",
        {
          orderIds: selectedOrder,
          pickup: shippingInfo.pickUp,
          rto: shippingInfo.rto,
          selectedPartner: selectedPartner.carrierName +" " +selectedPartner.serviceType,
          userType: userType,
        }
      );

      if (response.status === 200) {
        toast({ title: "Shipment booked successfully!", variant: "success" });
        fetchOrders();
      }
    } catch (error) {
      toast({ title: "Failed to book shipment", variant: "destructive" });
    } finally {
      setLoading(false);
      goBack();
    }
  }

  return (
    <div className="space-y-6">
      {renderView()}
      <BulkOrder
        isOpen={createForwardBulkOrder}
        setIsOpen={setCreateForwardBulkOrder}
        onUpload={handleForwardBulkOrder}
      />
      <BulkOrder
        isOpen={createReverseBulkOrder}
        setIsOpen={setCreateReverseBulkOrder}
        onUpload={handleReverseBulkOrder}
      />
    </div>
  );
};

export default OrdersPage;
