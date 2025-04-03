import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CloneOrder from "./CloneOrder";


const OrderView = ({ order, handleBackToList }) => {
  const [cloneOrder, setCloneOrder] = useState();
  const [isCloning, setIsCloning] = useState();

  const handleCloneClick = () => {
    setCloneOrder({ ...order });
    setIsCloning(true);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"></div>

      <div className="space-y-6">
        {/* Order Details */}
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle className="flex gap-10 text-2xl font-semibold">
                Order Details
                <Button onClick={handleCloneClick}>Clone Order</Button>
              </CardTitle>
              <h2 className="font-semibold text-base">
                Order ID : <span className="">{order.orderId}</span>
              </h2>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleBackToList}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to List
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Name
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order.consignee}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Contact
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order.mobile ? order.mobile : order.telephone}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Payment Type
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order.orderType}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Collectable Value
                </dt>
                <dd className="text-base font-semibold mt-1">
                  INR {order.collectableValue}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Declared Value
                </dt>
                <dd className="text-base font-semibold mt-1">
                  INR {order.declaredValue}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Pincode
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order.pincode}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Address
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order.consigneeAddress1} {order.consigneeAddress2}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  City
                </dt>
                <dd className="text-base font-semibold mt-1">{order.city}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  State
                </dt>
                <dd className="text-base font-semibold mt-1">{order.state}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Package Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Package Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Item Description
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order.itemDescription}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  DG Shipment
                </dt>
                <dd className="mt-1">
                  <Badge
                    variant={order.dgShipment ? "destructive" : "secondary"}
                  >
                    {order.dgShipment ? "Yes" : "No"}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Quantity
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order.quantity}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Dimensions
                </dt>
                <dd className="text-base font-semibold mt-1">{`${order.height} x ${order.breadth} x ${order.length}`}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Volumetric Weight
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order.volumetricWeight}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Actual Weight
                </dt>
                <dd className="text-base font-semibold mt-1">
                  {order.actualWeight}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {isCloning && <CloneOrder cloneOrder={cloneOrder} setCloneOrder={setCloneOrder} isCloneDialogOpen={isCloning} setIsCloneDialogOpen={setIsCloning}/>
        }
      </div>
    </div>
  );
};

export default OrderView;
