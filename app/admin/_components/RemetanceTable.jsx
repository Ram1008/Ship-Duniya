import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import axiosInstance from "@/utils/axios";
import UserDetails from "./UserDetails";

const RemittanceTable = ({ dateRange, shippingPartner, userDetails }) => {
  const [codData, setCodData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedSellers, setExpandedSellers] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/shipping/cod-remittance");
        setCodData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group orders by seller
  const groupedBySeller = codData.reduce((acc, order) => {
    const sellerId = userDetails?._id || 'unknown';
    if (!acc[sellerId]) {
      acc[sellerId] = {
        sellerId: sellerId,
        sellerName: userDetails?.name || "Unknown Seller",
        address: userDetails?.address,
        orders: [],
      };
    }
    acc[sellerId].orders.push(order);
    return acc;
  }, {});

  const toggleSellerExpanded = (sellerId) => {
    const newExpanded = new Set(expandedSellers);
    if (newExpanded.has(sellerId)) {
      newExpanded.delete(sellerId);
    } else {
      newExpanded.add(sellerId);
    }
    setExpandedSellers(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center text-center py-6">
        <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-full mx-auto border-none shadow-none">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <TableHead className="text-left">Seller ID</TableHead>
            <TableHead className="text-left">Seller Name</TableHead>
            <TableHead className="text-left">Address</TableHead>
            <TableHead className="text-left">Total Orders</TableHead>
            <TableHead className="text-left">Total Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(groupedBySeller).map((sellerGroup) => (
            <React.Fragment key={sellerGroup.sellerId}>
              <TableRow className="cursor-pointer hover:bg-gray-50">
                <TableCell className="w-8">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSellerExpanded(sellerGroup.sellerId)}
                    className="p-0 h-8 w-8"
                  >
                    {expandedSellers.has(sellerGroup.sellerId) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell>{sellerGroup.sellerId}</TableCell>
                <TableCell>{sellerGroup.sellerName}</TableCell>
                <TableCell>{sellerGroup.address}</TableCell>
                <TableCell>{sellerGroup.orders.length}</TableCell>
                <TableCell>
                  ₹
                  {sellerGroup.orders
                    .reduce((sum, order) => sum + (order.amount || 0), 0)
                    .toLocaleString()}
                </TableCell>
              </TableRow>
              {expandedSellers.has(sellerGroup.sellerId) && (
                <TableRow className="mx-auto">
                  <TableCell colSpan={5} className="px-0">
                    <div className="bg-gray-50 p-4">
                      <Table>
                        <TableHeader >
                          <TableRow>
                            <TableHead className="text-left">
                              Order ID
                            </TableHead>
                            <TableHead className="text-left">
                              AWB Number
                            </TableHead>
                            <TableHead className="text-left">Date</TableHead>
                            <TableHead className="text-left">
                              Consignee
                            </TableHead>
                            <TableHead className="text-left">Pincode</TableHead>
                            <TableHead className="text-left">
                              Courier Name
                            </TableHead>
                            <TableHead className="text-left">
                              Order Type
                            </TableHead>
                            <TableHead className="text-center">
                              Status
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sellerGroup.orders.map((order, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-semibold">
                                {order.orderId}
                              </TableCell>
                              <TableCell>{order.awbNumber}</TableCell>
                              <TableCell>
                                {new Date(order.updatedAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </TableCell>
                              <TableCell>{order.consignee}</TableCell>
                              <TableCell>{order.pincode}</TableCell>
                              <TableCell>{order.partner}</TableCell>
                              <TableCell>{order.orderType}</TableCell>
                              <TableCell className="text-center text-blue-600 font-semibold">
                                {order.status}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default RemittanceTable;