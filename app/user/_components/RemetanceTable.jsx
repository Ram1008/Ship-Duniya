import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Clock } from "lucide-react"; // Added Clock icon
import { Button } from "@/components/ui/button";

const RemetanceTable = ({
  shipments,
  viewDetails,
  dateRange,
  shippingPartner,
}) => {
  const filteredShippings = shipments?.filter((shipment) => {
    const matchesDateRange =
      new Date(shipment.createdAt) >= new Date(dateRange.from) &&
      new Date(shipment.createdAt) <= new Date(dateRange.to);

    const matchesPartnerType = shippingPartner === "All" 
      ? true
      : shipment.PARTNER_Name.includes(shippingPartner);

    return matchesDateRange && matchesPartnerType;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden md:table-cell text-left">
            Shipment ID
          </TableHead>
          <TableHead className="text-left">AWB Number</TableHead>
          <TableHead className="text-left">Date</TableHead>
          <TableHead className="text-left">Consignee</TableHead>
          <TableHead className="text-left">Pincode</TableHead>
          <TableHead className="text-left">Courier Name</TableHead>
          <TableHead className="text-left">Order ID</TableHead>
          <TableHead className="text-left">Remittance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredShippings.map((shipment) => (
          <TableRow key={shipment._id}>
            <TableCell className="text-left font-bold">
              {shipment.SHIPMENT_ID}
            </TableCell>
            <TableCell
              className="text-left text-blue-400 cursor-pointer"
              onClick={() => viewDetails(shipment)}
            >
              {shipment.awbNumber}
            </TableCell>
            <TableCell className="hidden md:table-cell text-left">
              {new Date(shipment.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-left font-medium">
              {shipment.consignee || "N/A"}
            </TableCell>
            <TableCell className="text-left">
              {shipment.pincode || "N/A"}
            </TableCell>
            <TableCell className="text-left">
              {shipment.partner}
            </TableCell>
            <TableCell
              className="text-left font-medium text-blue-400 cursor-pointer"
              onClick={() => viewDetails(shipment)}
            >
              {shipment.orderId}
            </TableCell>
            <TableCell className="text-left">
              <Button
                className="bg-gradient-to-tr from-indigo-600 via-blue-400 to-cyan-400 text-black"
              >
                <Clock className="mr-2 h-4 w-4" />
                {shipment.status || "Pending"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RemetanceTable;