import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chevron } from "react-day-picker";


const RtoTable = ({
  rtoRtcData,
  setRtoRtcData,
  setLoading,
  loading,
}) => {

  console.log(rtoRtcData)


  const handleMoveToRtc = (shipmentId) => {
    const shipmentToMove = rtoShipments.find(
      (shipment) => shipment._id === shipmentId
    );

    // Remove the shipment from RTO
    const updatedRtoShipments = rtoShipments.filter(
      (shipment) => shipment._id !== shipmentId
    );

    // setRtoRtcData
  };

  if(loading) return <Loader2 className="w-10 h-10 mx-auto" />

  return (
    <CardContent className="">
      <Tabs defaultValue="rto" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="rto">RTO ({rtoRtcData.length})</TabsTrigger>
          <TabsTrigger value="rtc">RTC </TabsTrigger>
        </TabsList>
        <TabsContent value="rto">
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead className="">Shipment ID</TableHead> */}
                <TableHead className="">View Details</TableHead>
                <TableHead className="">Seller ID</TableHead>
                <TableHead className="">Seller Name</TableHead>
                <TableHead className="">Address</TableHead>
                <TableHead className="">Phone</TableHead>
                <TableHead className="">Total RTO</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rtoRtcData.map((shipment) => (
                <TableRow key={shipment._id}>
                  <TableCell className="font-medium">
                   <ChevronRight className="w-6 h-6" />
                  </TableCell>
                  <TableCell className="font-medium">
                    {shipment?.userId || "User Id"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {shipment?.userName}
                  </TableCell>
                  <TableCell className="font-medium">
                    {shipment?.userAddress || ""}
                  </TableCell>
                  <TableCell className="font-medium">
                    {shipment.phoneNumber}
                  </TableCell>
                  <TableCell className="font-medium text-blue-400">
                    {shipment.deliveredOrders.length || "0"}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    <Button onClick={() => handleMoveToRtc(shipment)}>
                      Move to RTC
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* <TabsContent value="rtc">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Order ID</TableHead>
                <TableHead className="">Consignee</TableHead>
                <TableHead className="">Partner</TableHead>
                <TableHead className="">Exception Info</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rtcData.map((shipment) => (
                <TableRow key={shipment._id}>
                  <TableCell className="font-medium">
                    {shipment.orderId}
                  </TableCell>
                  <TableCell className="font-medium">
                    {shipment.consignee}
                  </TableCell>
                  <TableCell className="font-medium">
                    {shipment.partner}
                  </TableCell>
                  <TableCell className="font-medium text-blue-400">
                    {shipment.exceptionInfo || "Exception Info"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent> */}
      </Tabs>
    </CardContent>
  );
};
export default RtoTable;
