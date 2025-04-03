"use client";
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import axiosInstance from "@/utils/axios";

const PendingPickups = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partnerType, setPartnerType] = useState("All");
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get("/users/profile");
      setUserDetails(response.data);
    } catch (err) {}
  };

  useEffect(() =>{
    fetchUserData();
  }, [])
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await axiosInstance.get("/admin/all-shipments");
        setShipments(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching shipments:", error);
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  const filteredShipments =
    partnerType === "All"
      ? shipments
      : shipments.filter((shipment) => shipment.PARTNER_Name === partnerType);

  const groupedShipments = filteredShipments.reduce((acc, shipment) => {
    const sellerId = userDetails._id;
    if (!acc[sellerId]) {
      acc[sellerId] = {
        sellerId: sellerId,
        sellerName: userDetails.name,
        address: userDetails.address,
        shipments: [],
      };
    }
    acc[sellerId].shipments.push(shipment);
    return acc;
  }, {});

  // Function to generate the full pending list PDF
  const handleGeneratePendingList = () => {
    const doc = new jsPDF();

    // Define table headers
    const tableColumn = [
      "Seller ID",
      "Seller Name",
      "Address",
      "Shipment Date",
      "AWB Number",
      "Consignee",
      "Pincode",
      "Signature",
    ];
    const tableRows = [];

    // Populate table data from selected shipments
    Object.values(groupedShipments).forEach((group) => {
      group.shipments.forEach((shipment) => {
        const shipmentData = [
          group.sellerId,
          group.sellerName,
          group.address,
          new Date(shipment.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          shipment.awbNumber || "N/A",
          shipment.consignee,
          shipment.PICKUP_PINCODE,
        ];
        tableRows.push(shipmentData);
      });
    });

    // Add the table to the PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    // Save the PDF file
    doc.save("pending_pickups_list.pdf");
  };

  const toggleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      setSelectedRows(new Set(Object.keys(groupedShipments)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const toggleRowSelection = (sellerId) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(sellerId)) {
      newSelected.delete(sellerId);
      setSelectAll(false);
    } else {
      newSelected.add(sellerId);
      if (newSelected.size === Object.keys(groupedShipments).length) {
        setSelectAll(true);
      }
    }
    setSelectedRows(newSelected);
  };

  const handleGenerateList = () => {
    // Handle generate list functionality here
    console.log("Generating pending list for selected rows:", selectedRows);
  };

  const ShipmentDetails = ({ shipments }) => (
    <div className="bg-gray-50 p-4">
      <Table>
        <TableHeader>
          <TableRow className="border-t border-gray-200">
            <TableHead className="text-sm font-semibold text-gray-700">
              Date
            </TableHead>
            <TableHead className="text-sm font-semibold text-gray-700">
              AWB Number
            </TableHead>
            <TableHead className="text-sm font-semibold text-gray-700">
              Consignee
            </TableHead>
            <TableHead className="text-sm font-semibold text-gray-700">
              Pincode
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.map((shipment) => (
            <TableRow key={shipment._id} className="hover:bg-gray-100">
              <TableCell className="text-sm">
                {new Date(shipment.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="text-sm font-medium">
                {shipment.awbNumber || "N/A"}
              </TableCell>
              <TableCell className="text-sm">{shipment.consignee}</TableCell>
              <TableCell className="text-sm">
                {shipment.PICKUP_PINCODE}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (loading) {
    return (
      <Card className="w-full max-w-full mx-auto p-4">
        <div className="text-center py-8">Loading...</div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-full mx-auto">
      <div className="bg-white rounded-lg">
        <div className="p-6 border-b border-gray-200 space-y-4">
          {/* <div className="flex justify-center"> */}
          <CardTitle className="text-2xl font-bold">Pending Pickups</CardTitle>
          {/* </div> */}

          <div className="flex justify-between items-center">
            <Button
              onClick={handleGeneratePendingList}
              variant="export"
              disabled={selectedRows.size === 0}
            >
              <FileText className="h-4 w-4" />
              <span>Generate Pending List</span>
            </Button>

            <div className="w-[220px]">
              <Select
                value={partnerType}
                onValueChange={(value) => setPartnerType(value)}
              >
                <SelectTrigger className="h-9 bg-white">
                  <SelectValue placeholder="Choose courier partner" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "All",
                    "Surface Xpressbees 0.5 K.G",
                    "Air Xpressbees 0.5 K.G",
                    "Xpressbees 2 K.G",
                    "Ecom",
                    "Delhivery",
                  ].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-y border-gray-200">
                <TableHead className="w-40">
                  <div className="flex items-center space-x-2 pl-4">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      Select
                    </span>
                  </div>
                </TableHead>
                <TableHead className="text-sm font-semibold text-gray-700">
                  Seller ID
                </TableHead>
                <TableHead className="text-sm font-semibold text-gray-700">
                  Seller Name
                </TableHead>
                <TableHead className="text-sm font-semibold text-gray-700">
                  Address
                </TableHead>
                <TableHead className="text-sm font-semibold text-gray-700">
                  Total Shipments
                </TableHead>
                <TableHead className="text-sm font-semibold text-gray-700 w-24">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Object.values(groupedShipments).length > 0 ? (
                Object.values(groupedShipments).map((group) => (
                  <React.Fragment key={group.sellerId}>
                    <TableRow className="hover:bg-gray-50 border-b border-gray-200">
                      <TableCell>
                        <div className="flex items-center space-x-2 pl-4">
                          <input
                            type="checkbox"
                            checked={selectedRows.has(group.sellerId)}
                            onChange={() => toggleRowSelection(group.sellerId)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {group.sellerId}
                      </TableCell>
                      <TableCell className="text-sm">
                        {group.sellerName}
                      </TableCell>
                      <TableCell className="text-sm">{group.address}</TableCell>
                      <TableCell className="text-sm">
                        {group.shipments.length}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setExpandedRow(
                              expandedRow === group.sellerId
                                ? null
                                : group.sellerId
                            )
                          }
                          className="hover:bg-gray-100"
                        >
                          {expandedRow === group.sellerId ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedRow === group.sellerId && (
                      <TableRow>
                        <TableCell colSpan="5" className="p-0">
                          <ShipmentDetails shipments={group.shipments} />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan="5"
                    className="text-center py-8 text-gray-500"
                  >
                    No pending pickups found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default PendingPickups;
