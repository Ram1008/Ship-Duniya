"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "@/utils/axios";
import { useToast } from "@/hooks/use-toast";

// Create the context
const OrdersContext = createContext();

// Custom hook to use the orders context
export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
};

// Provider component
export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderType, setOrderType] = useState("All");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isShipping, setIsShipping] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    pickUp: "",
    rto: "",
  });
  const [shippingPartners, setShippingPartners] = useState([]);
  const [wareHouses, setWareHouses] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const { toast } = useToast();

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/orders");
      setOrders(response.data);
      console.log("Orders fetched:", response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error fetching orders",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch warehouses
  const fetchWarehouses = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/warehouses");
      setWareHouses(response.data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      toast({
        title: "Error fetching warehouses",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Fetch shipping partners
  const fetchShippingPartners = useCallback(async (pickup, rto) => {
    if (!pickup || !rto) return;
    
    setShippingLoading(true);
    try {
      const response = await axiosInstance.post("/shipping/partners", {
        pickup,
        rto,
      });
      setShippingPartners(response.data);
    } catch (error) {
      console.error("Error fetching shipping partners:", error);
      toast({
        title: "Error fetching shipping partners",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setShippingLoading(false);
    }
  }, [toast]);

  // Book shipment
  const handleBookShipment = useCallback(async (selectedPartner, shippingInfo) => {
    if (!selectedPartner) return;
    
    setShippingLoading(true);
    try {
      const response = await axiosInstance.post(
        "/shipping/create-forward-shipping",
        {
          orderIds: selectedOrders,
          pickup: shippingInfo.pickUp,
          rto: shippingInfo.rto,
          selectedPartner: selectedPartner.carrierName + " " + selectedPartner.serviceType,
        }
      );

      if (response.status === 200) {
        toast({
          title: "Shipment booked successfully!",
          variant: "success",
        });
        fetchOrders();
        setIsShipping(false);
        setSelectedOrders([]);
      }
    } catch (error) {
      console.error("Error booking shipment:", error);
      toast({
        title: "Failed to book shipment",
        description: error.response?.data?.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setShippingLoading(false);
    }
  }, [selectedOrders, toast, fetchOrders]);

  // Filter orders based on search query and order type
  const filteredOrders = useCallback(() => {
    return orders.filter((order) => {
      const matchesSearchQuery =
        searchQuery === "" ||
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.consignee &&
          order.consignee.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesOrderType =
        orderType === "All" || order.orderType?.toLowerCase() === orderType.toLowerCase();

      return matchesSearchQuery && matchesOrderType;
    });
  }, [orders, searchQuery, orderType]);

  const handleForwardBulkOrder = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post("/orders/create-forward-order", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast({
          title: "Bulk upload successful",
          description: `${response.data.message}`,
          variant: "success",
        });
        fetchOrders();
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "Bulk upload failed",
        description: error.response?.data?.details.join(", ") ,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReverseBulkOrder = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post("/orders/bulk-upload-reverse", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast({
          title: "Bulk upload successful",
          description: `${response.data.count} reverse orders have been created`,
          variant: "success",
        });
        fetchOrders();
      }
    } catch (error) {
      console.error("Bulk upload failed:", error);
      toast({
        title: "Bulk upload failed",
        description: error.response?.data?.message || "Please check your file and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Fetch shipping partners when shipping info changes
  useEffect(() => {
    if (shippingInfo.pickUp && shippingInfo.rto) {
      fetchShippingPartners(shippingInfo.pickUp, shippingInfo.rto);
    }
  }, [shippingInfo, fetchShippingPartners]);

  // Context value
  const value = {
    orders,
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
    shippingInfo,
    setShippingInfo,
    shippingPartners,
    wareHouses,
    selectedPartner,
    setSelectedPartner,
    shippingLoading,
    fetchOrders,
    fetchWarehouses,
    handleBookShipment,
    filteredOrders: filteredOrders(),
    handleForwardBulkOrder,
    handleReverseBulkOrder,
  };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}; 