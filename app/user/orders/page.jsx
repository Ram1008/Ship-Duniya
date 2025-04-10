"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect, useMemo } from "react";
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
import { useOrders } from "@/context/OrdersContext";
import axiosInstance from "@/utils/axios";

const OrdersPage = () => {
  const [userType, setUserType] = useState(null);
  const [viewDetails, setViewDetails] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(2022, 0, 1),
    to: new Date(),
  });
  const [viewShipped, setViewShipped] = useState(false);
  const [viewNotShipped, setViewNotShipped] = useState(false);
  const [viewCancelled, setViewCancelled] = useState(false);
  const [createForwardSingleOrder, setCreateForwardSingleOrder] =
    useState(false);
  const [createReverseSingleOrder, setCreateReverseSingleOrder] =
    useState(false);
  const [createForwardBulkOrder, setCreateForwardBulkOrder] = useState(false);
  const [createReverseBulkOrder, setCreateReverseBulkOrder] = useState(false);
  const { toast } = useToast();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const router = useRouter();

  // Use the OrdersContext
  const {
    loading,
    searchQuery,
    setSearchQuery,
    orderType,
    setOrderType,
    selectedOrders,
    setSelectedOrders,
    isShipping,
    setIsShipping,
    selectedOrder,
    setSelectedOrder,
    filteredOrders,
    fetchOrders,
    handleForwardBulkOrder,
    handleReverseBulkOrder,
  } = useOrders();

  // Get user type from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserType(userData.userType);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Calculate paginated orders
  const paginatedOrders = useMemo(() => {
    // Start with the full list of filtered orders from the OrdersContext
    let filteredOrdersWithStatus = [...filteredOrders];

    // Apply status filters
    if (viewCancelled) {
      // When viewing cancelled, show orders that are cancelled
      filteredOrdersWithStatus = filteredOrdersWithStatus.filter(
        (order) => order.isCancelled
      );
    } else if (viewShipped) {
      // When viewing shipped, show orders that are booked (shipped)
      filteredOrdersWithStatus = filteredOrdersWithStatus.filter(
        (order) => order.shipped
      );
    } else if (viewNotShipped) {
      // When viewing not shipped, show orders that are not shipped and not cancelled
      filteredOrdersWithStatus = filteredOrdersWithStatus.filter(
        (order) => !order.shipped && !order.isCancelled
      );
    }

    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);

      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);

      filteredOrdersWithStatus = filteredOrdersWithStatus.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= fromDate && orderDate <= toDate;
      });
    }

    // Sort the filtered orders
    // For example, for not shipped orders we sort by weight, and for the rest we sort by date
    const sortedOrders = [...filteredOrdersWithStatus].sort((a, b) => {
      if (!viewCancelled && !a.shipped && !b.shipped) {
        // Only for not shipped orders: sort by weight (calculate volumetric weight first)
        const volWeightA =
          ((a.length || 0) * (a.breadth || 0) * (a.height || 0)) / 5;
        const volWeightB =
          ((b.length || 0) * (b.breadth || 0) * (b.height || 0)) / 5;
        const weightA = Math.max(a.actualWeight || 0, volWeightA);
        const weightB = Math.max(b.actualWeight || 0, volWeightB);
        return weightA - weightB;
      }
      // Default: sort by date descending
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Apply pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedOrders.slice(startIndex, endIndex);
  }, [
    filteredOrders,
    currentPage,
    pageSize,
    viewShipped,
    viewNotShipped,
    viewCancelled,
    dateRange,
  ]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, orderType, viewShipped, viewNotShipped, dateRange]);

  const handleOrderSelect = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleShipSelected = () => {
    if (selectedOrders.length === 0) {
      toast({
        title: "No orders selected",
        description: "Please select at least one order to ship",
        variant: "destructive",
      });
      return;
    }
    setIsShipping(true);
  };

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
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
          <Dialog
            open={isExportDialogOpen}
            onOpenChange={setIsExportDialogOpen}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Export</DialogTitle>
                <DialogDescription>Download Excel or PDF.</DialogDescription>
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
                  className={`text-sm font-semibold px-4 py-2 rounded-lg border border-green-500 text-green-500`}
                  onClick={() => {
                    setViewShipped(!viewShipped);
                    setViewNotShipped(false);
                    setViewCancelled(false);
                  }}
                >
                  View Booked
                </button>
                <button
                  className={`text-sm font-semibold px-4 py-2 rounded-lg border border-primary text-primary`}
                  onClick={() => {
                    setViewNotShipped(!viewNotShipped);
                    setViewShipped(false);
                    setViewCancelled(false);
                  }}
                >
                  View Not Shipped
                </button>
                <button
                  className={`text-sm font-semibold px-4 py-2 rounded-lg border border-destructive text-destructive`}
                  onClick={() => {
                    setViewCancelled(!viewCancelled);
                    setViewShipped(false);
                    setViewNotShipped(false);
                  }}
                >
                  View Cancelled
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
              setLoading={() => {}}
              setViewDetails={setViewDetails}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
              setIsShipping={setIsShipping}
              fetchOrders={fetchOrders}
            />
            <Pagination
              currentPage={currentPage}
              totalItems={filteredOrders.length}
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
      return <OrderForm />;
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
        />
      );
    }
    return renderOrderList();
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
    setViewDetails(false);
  };

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
