import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/utils/axios";

const ShipmentDetails = ({ details, isTracking = false, handleBackToList }) => {
  console.log(details);
  const [tracking, setTracking] = useState(null);
  const [order, setOrder] = useState(null);

  const fetchTracking = async () => {
    try {
      const response = await axiosInstance.get(
        `/track/${details[0].awbNumber}`
      );
      console.log(response.data);
      setTracking(response.data);
    } catch (error) {
      console.error("Error fetching shipments:", error);
    }
  };
  const fetchOrder = async () => {
    try {
      const response = await axiosInstance.get("/shipping/userShipments");
      setOrder(response.data);
      console.log("user shipment : ", response.data);
    } catch (error) {
      console.error("Error fetching shipments:", error);
    }
  };

  useEffect(() => {
    if (isTracking) {
      fetchTracking();
    } else {
      fetchOrder();
    }
  }, []);

  return (
    <div className="space-y-6 mx-5">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {isTracking
            ? `AWB Number: ${details[0].awbNumber}`
            : `Order Id: ${details[0].orderIds[0].orderId}`}
        </h2>
        <Button variant="outline" onClick={() => handleBackToList()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>
      </div>
      {isTracking ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Shipping Details
            </CardTitle>
          </CardHeader>
          {tracking ? (
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt>AWB Number</dt>
                  <dd>{tracking.awbNumber}</dd>
                </div>
                <div>
                  <dt>Shipping Status</dt>
                  <dd>{tracking.shippingStatus}</dd>
                </div>
                <div>
                  <dt>Shipping Date</dt>
                  <dd>{tracking.shippingDate}</dd>
                </div>
                <div>
                  <dt>Shipping Time</dt>
                  <dd>{tracking.shippingTime}</dd>
                </div>
                <div>
                  <dt>Delivery Date</dt>
                  <dd>{tracking.deliveryDate}</dd>
                </div>
                <div>
                  <dt>Delivery Time</dt>
                  <dd>{tracking.deliveryTime}</dd>
                </div>
              </dl>
            </CardContent>
          ) : (
            <CardContent>
              <p className="text-center font-semibold text-xl">
                No tracking data available
              </p>
            </CardContent>
          )}
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              {/* Add all required fields here */}
              {/* <div>
                <dt>Order ID</dt>
                <dd>{details[0].orderId}</dd>
              </div> */}
              <div>
                <dt>Consignee Name</dt>
                <dd>{details[0].orderIds[0].consignee}</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>{details[0].orderIds[0].consigneeAddress1 || "N/A"}</dd>
              </div>
              <div>
                <dt>Pincode</dt>
                <dd>{details[0].orderIds[0].pincode || "N/A"}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{details[0].orderIds[0].mobile || "N/A"}</dd>
              </div>
              <div>
                <dt>Order Type</dt>
                <dd>{details[0].orderIds[0].orderType || "N/A"}</dd>
              </div>
              <div>
                <dt>AWB Number</dt>
                <dd>{details[0].awbNumber || "N/A"}</dd>
              </div>
              <div>
                <dt>Warehouse Address</dt>
                <dd>{details[0].pickupAddress.addressLine1 || "N/A"}</dd>
              </div>
              <div>
                <dt>Warehouse Pincode</dt>
                <dd>{details[0].pickupAddress.pincode|| "N/A"}</dd>
              </div>
              <div>
                <dt>Invoice Number</dt>
                <dd>{details[0].orderIds[0].invoiceNumber || "N/A"}</dd>
              </div>
              <div>
                <dt>Courier Partner Name</dt>
                <dd>{details[0].partnerDetails.name || "N/A"}</dd>
              </div>
              <div>
                <dt>Item Description</dt>
                <dd>{details[0].orderIds[0].itemDescription|| "N/A"}</dd>
              </div>
              <div>
                <dt>Quantity</dt>
                <dd>{details[0].orderIds[0].quantity || "N/A"}</dd>
              </div>
              <div>
                <dt>Per product price</dt>
                <dd>{details[0].orderIds[0].declaredValue / details[0].orderIds[0].quantity || "N/A"}</dd>
              </div>
              <div>
                <dt>Total price</dt>
                <dd>{details[0].orderIds[0].declaredValue || "N/A"}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{details[0].status}</dd>
              </div>
              <div>
                <dt>Dangerous Goods Shipment</dt>
                <dd>{details[0].dgShipment ? "Yes" : "No"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShipmentDetails;
