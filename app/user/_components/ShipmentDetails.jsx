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
                <dt><strong>Consignee Name</strong></dt>
                <dd>{details[0].orderIds[0].consignee}</dd>
              </div>
              <div>
                <dt><strong>Address</strong></dt>
                <dd>{details[0].orderIds[0].consigneeAddress1 || "N/A"}</dd>
              </div>
              <div>
                <dt><strong>Pincode</strong></dt>
                <dd>{details[0].orderIds[0].pincode || "N/A"}</dd>
              </div>
              <div>
                <dt><strong>Phone</strong></dt>
                <dd>{details[0].orderIds[0].mobile || "N/A"}</dd>
              </div>
              <div>
                <dt><strong>Order Type</strong></dt>
                <dd>{details[0].orderIds[0].orderType || "N/A"}</dd>
              </div>
              <div>
                <dt><strong>Warehouse Address</strong></dt>
                <dd>{details[0].pickupAddress.addressLine1 || "N/A"}</dd>
              </div>
              <div>
                <dt><strong>Warehouse Pincode</strong></dt>
                <dd>{details[0].pickupAddress.pincode|| "N/A"}</dd>
              </div>
              <div>
                <dt><strong>Invoice Number</strong></dt>
                <dd>{details[0].orderIds[0].invoiceNumber || "N/A"}</dd>
              </div>
              <div>
                <dt><strong>Courier Partner Name</strong></dt>
                <dd>{details[0].partnerDetails.name || "N/A"}</dd>
              </div>
              <div>
                <dt><strong>Quantity</strong></dt>
                <dd>{details[0].orderIds[0].quantity || "N/A"}</dd>
              </div>
              <div>
                <dt><strong>Status</strong></dt>
                <dd>{details[0].status}</dd>
              </div>
              <div>
                <dt><strong>Label</strong></dt>
                <dd>
                  {details[0].label ? (
                    <Link
                      href={details[0].label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Label
                    </Link>
                  ) : (
                    <span>No Label Available</span>
                  )}
                </dd>
              </div>
              <div>
                <dt><strong>Manifest</strong></dt>
                <dd>
                  {details[0].manifest? (<Link
                    href={details[0].manifest}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Manifest
                  </Link>) :(
                    <span>No Manifest Available</span>
                  )}
                </dd>
              </div>
              <div>
                <dt><strong>Dangerous Goods Shipment</strong></dt>
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
