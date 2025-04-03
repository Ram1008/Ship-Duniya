import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Loader2, Package, ReceiptText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { AlertCircle, Download, Upload } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { se } from "date-fns/locale";
import axiosInstance from "@/utils/axios";
const NdrTable = ({
  shipments,
  loading,
  setSelectedShipments,
  selectedShipments,
  setViewTracking,
  setViewDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    from: new Date(2022, 0, 1),
    to: new Date(),
  });
  const [orderType, setOrderType] = useState("");
  const [partnerType, setPartnerType] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isRaising, setIsRaising] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [resetKey, setResetKey] = useState(0); // To reset select component
  const [actionReason, setActionReason] = useState("");

  const handleActionChange = (action, shipment) => {
    setSelectedShipment(shipment);
    setSelectedAction(action);
    setShowDialog(true);
  };

  const confirmAction = async () => {
    if (selectedShipment && selectedAction && actionReason) {
      console.log( selectedShipment);
      console.log(selectedAction);
      console.log(actionReason)

      try{
        const response = await axiosInstance.post("/ndr/ndr-actions", {
          ndrId: selectedShipment._id, action : selectedAction, reasons: actionReason
        })
        console.log( response.data);
      }catch(error){
        console.log(error)
      }
    }
    setShowDialog(false);
  };

  const cancelAction = () => {
    setSelectedShipment(null);
    setSelectedAction(""); // Reset action state
    setResetKey((prevKey) => prevKey + 1); // Force reset Select component
    setShowDialog(false);
  };

  const filteredShippings = shipments?.filter((shipment) => {
    const matchesSearchQuery = searchQuery
      ? shipment.shippingId.consignee?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.shippingId.awbNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.shippingId.orderId?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesDateRange =
      new Date(shipment.shippingId.createdAt) >= new Date(dateRange.from) &&
      new Date(shipment.shippingId.createdAt) <= new Date(dateRange.to);

    const matchesOrderType =
      orderType === "All" || orderType === ""
        ? true
        : shipment.orderType === orderType ||
          ((shipment.orderType === "prepaid" ||
            shipment.orderType === "PREPAID") &&
            orderType === prepaid)
        ? true
        : false;

    const matchesPartnerType =
      partnerType === "" || partnerType === "All"
        ? true
        : shipment.shippingId.PARTNER_Name.includes(partnerType);

    return (
      matchesSearchQuery &&
      matchesDateRange &&
      matchesOrderType &&
      matchesPartnerType
    );
  });

  const viewDetails = (shipment, tracking = false) => {
    setSelectedShipments([shipment]);
    tracking ? setViewTracking(true) : setViewDetails(true);
  };
  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Shipments");
    const headings = [
      "shipmentId",
      "awbNumber",
      "date",
      "consignee",
      "pincode",
      "courierName",
      "orderId",
      "status",
    ];
    worksheet.addRow(headings);
    filteredShippings.forEach((shipment) => {
      worksheet.addRow([
        shipment.SHIPMENT_ID,
        shipment.awbNumber,
        new Date(shipment.createdAt).toLocaleDateString(),
        shipment.consignee,
        shipment.pincode,
        shipment.PARTNER_Name,
        shipment.orderId,
        shipment.status,
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "shipments.xlsx");
  };
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    const tableColumn = [
      "Shipment ID",
      "AWB Number",
      "Date",
      "Consignee",
      "Pincode",
      "Courier Name",
      "Order ID",
      "Status",
    ];

    const tableRows = [];

    // Loop through the selected shipments only
    selectedShipments.forEach((selectedId) => {
      const shipment = shipments.find(
        (shipment) => shipment._id === selectedId // Match by unique ID
      );
      if (shipment) {
        const shipmentData = [
          shipment.SHIPMENT_ID,
          shipment.awbNumber,
          new Date(shipment.createdAt).toLocaleDateString(),
          shipment.consignee,
          shipment.pincode,
          shipment.PARTNER_Name,
          shipment.orderId,
          shipment.status,
        ];
        tableRows.push(shipmentData);
      }
    });

    // Generate PDF only if there are selected rows
    if (tableRows.length > 0) {
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
      });
      doc.save("selected_shipments.pdf");
    } else {
      // Optional: Show message if no rows are selected
      alert("Please select at least one shipment to download.");
    }
  };

  const handleSubmitTicket = async () => {
    try {
      const response = await axiosInstance.post("/ticket/create", {
        subject: data.subject,
        message: data.description,
        issueType: issueType,
      });

      console.log("Ticket created successfully:", response.data);
    } catch (error) {
      console.log("Error submitting ticket:", error);
    }
  };

  const handleGenerateInvoice = () => {
    const doc = new jsPDF();

    selectedShipments.forEach((selectedId, index) => {
      const shipment = shipments.find((s) => s._id === selectedId);
      if (shipment) {
        if (index !== 0) doc.addPage();

        const pageWidth = doc.internal.pageSize.width;

        // Centered Heading
        doc.setFontSize(16);
        const heading = "Shipment Invoice - Ship Duniya";
        const headingWidth = doc.getTextWidth(heading);
        doc.text(heading, (pageWidth - headingWidth) / 2, 20);

        // Left Section: Shipment Information
        doc.setFontSize(12);
        doc.text("Shipment Information", 20, 40);
        doc.text(`Shipment ID: ${shipment.SHIPMENT_ID}`, 20, 50);
        doc.text(`AWB Number: ${shipment.awbNumber}`, 20, 60);

        // Right Section: Invoice Details
        doc.text(`Invoice Number: ${shipment.invoiceNumber}`, 130, 40);
        doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 130, 50);

        // Horizontal Line
        doc.line(20, 70, 190, 70);

        // Left Section: Sold By
        doc.text("Sold By:", 20, 80);
        doc.text("Ship Duniya Logistics", 20, 90);
        doc.text("Address: C 45 sec 10 Noida 201301", 20, 100);
        doc.text("GST: 09AFEFS3189K1ZD", 20, 110);

        // Right Section: Billed To
        doc.text("Billed To:", 130, 80);
        doc.text(`${shipment.consignee}`, 130, 90);
        doc.text(`${shipment.pincode}`, 130, 100);

        // **Set Table Below the Details**
        let startY = 120; // Adjusted to start below the "Billed To" section

        const tableColumn = [
          "Shipment ID",
          "AWB Number",
          "Date",
          "Consignee",
          "Pincode",
          "Courier Name",
          "Order ID",
          "Status",
        ];

        const tableRows = [
          [
            shipment.SHIPMENT_ID,
            shipment.awbNumber,
            new Date(shipment.createdAt).toLocaleDateString(),
            shipment.consignee,
            shipment.pincode,
            shipment.PARTNER_Name,
            shipment.orderId,
            shipment.status,
          ],
        ];

        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY, // Ensure table starts after details
        });
      }
    });

    doc.save("invoice.pdf");
  };

  const whenActionTaken = (value, shipment) => {};

  const actionRequired = shipments?.filter(
    (shipment) => shipment.status === "actionRequired"
  );
  const actionRequested = shipments?.filter(
    (shipment) => shipment.status === "actionRequested"
  );
  const delivered = shipments?.filter(
    (shipment) => shipment.status === "delivered"
  );
  const rto = shipments?.filter((shipment) => shipment.status === "rto");

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between md:flex-wrap items-center">
            <CardTitle className="text-2xl font-bold">
              Non Delivery Request
            </CardTitle>
            <input
              type="text"
              placeholder="Search by order Id or phone number"
              className="border rounded-lg px-4 py-2 text-sm w-[50%] focus:outline-none focus:ring focus:ring-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="export"
              size="lg"
              onClick={() => setIsExporting((prev) => !prev)}
            >
              <span className="text-lg">+ Export </span>
            </Button>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="flex flex-wrap items-center gap-4">
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />

              <div className="w-[120px]">
                <Select
                  value={orderType}
                  onValueChange={(value) => setOrderType(value)}
                >
                  <SelectTrigger className="">
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
              <div className="w-[180px]">
                <Select
                  value={partnerType}
                  onValueChange={(value) => setPartnerType(value)}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Choose courier partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {["All", "Xpressbees", "Ecom", "Delhivery"].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-center flex-wrap pt-2 gap-12 h-auto">
            <Tabs defaultValue="actionRequired" className="mx-auto my-3">
              <TabsList className="p-4 gap-6 flex justify-center mx-auto max-w-max bg-white">
                <TabsTrigger
                  value="actionRequired"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white bg-gray-200"
                >
                  Action Required
                </TabsTrigger>
                <TabsTrigger
                  value="actionRequested"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white bg-gray-200"
                >
                  Action Requested
                </TabsTrigger>
                <TabsTrigger
                  value="delivered"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white bg-gray-200"
                >
                  Delivered
                </TabsTrigger>
                <TabsTrigger
                  value="rto"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white bg-gray-200"
                >
                  RTO
                </TabsTrigger>
              </TabsList>
              {loading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
                </div>
              ) : (
                <>
                  <TabsContent value="actionRequired">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="hidden md:table-cell text-left ">
                            Shipment ID
                          </TableHead>
                          <TableHead className="text-left">
                            AWB Number
                          </TableHead>
                          <TableHead className="text-left">Date</TableHead>
                          <TableHead className="text-left">Consignee</TableHead>
                          <TableHead className="text-left">Pincode</TableHead>
                          <TableHead className="text-left">
                            Courier Name
                          </TableHead>
                          <TableHead className="text-left">Order Details</TableHead>
                          <TableHead className="text-left">
                            Exception Info
                          </TableHead>
                          <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {actionRequired?.map((shipment, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-left font-bold">
                              {shipment.shippingId.SHIPMENT_ID}
                            </TableCell>
                            <TableCell
                              className="text-left text-blue-400 cursor-pointer"
                              onClick={() => viewDetails(shipment, true)}
                            >
                              {shipment.shippingId.awbNumber}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-left">
                              {
                                new Date(shipment.shippingId.createdAt)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </TableCell>
                            <TableCell className="text-left font-medium">
                              {shipment.consignee ? shipment.consignee : "Ram"}
                            </TableCell>
                            <TableCell className="text-left">
                              {shipment.pincode || "201301"}
                            </TableCell>
                            <TableCell className="text-left">
                              {shipment.shippingId.PARTNER_Name}
                            </TableCell>
                            <TableCell
                              className="text-left font-medium text-blue-400"
                              onClick={() => viewDetails(shipment)}
                            >
                              {shipment.shippingId.orderId}
                            </TableCell>
                            <TableCell
                              className="text-left font-medium text-blue-400"
                              onClick={() => viewDetails(shipment)}
                            >
                              {shipment.failureReason || ""}
                            </TableCell>

                            <TableCell className="flex gap-1 text-center space-x">
                              <Select
                                key={resetKey}
                                onValueChange={(value) =>
                                  handleActionChange(value, shipment)
                                }
                                className="bg-green"
                              >
                                <SelectTrigger className="bg-green">
                                  <SelectValue
                                    className="bg-green"
                                    placeholder="Take Action"
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
                                    "RTO",
                                    "Re-Attempt",
                                    "Hold for 24 hours",
                                    "Update Phone Number",
                                    "Update Address",
                                  ].map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="actionRequested">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="hidden md:table-cell text-left ">
                            Shipment ID
                          </TableHead>
                          <TableHead className="text-left">
                            AWB Number
                          </TableHead>
                          <TableHead className="text-left">Date</TableHead>
                          <TableHead className="text-left">Consignee</TableHead>
                          <TableHead className="text-left">Pincode</TableHead>
                          <TableHead className="text-left">
                            Courier Name
                          </TableHead>
                          <TableHead className="text-left">Order ID</TableHead>
                          <TableHead className="text-left">
                            Exception Info
                          </TableHead>
                          </TableRow>
                      </TableHeader>

                      <TableBody>
                        {actionRequested?.map((shipment, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-left font-bold">
                              {shipment.shippingId.SHIPMENT_ID}
                            </TableCell>
                            <TableCell
                              className="text-left text-blue-400 cursor-pointer"
                              onClick={() => viewDetails(shipment, true)}
                            >
                              {shipment.shippingId.awbNumber}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-left">
                              {
                                new Date(shipment.shippingId.createdAt)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </TableCell>
                            <TableCell className="text-left font-medium">
                              {shipment.consignee ? shipment.consignee : "Ram"}
                            </TableCell>
                            <TableCell className="text-left">
                              {shipment.pincode || "201301"}
                            </TableCell>
                            <TableCell className="text-left">
                              {shipment.shippingId.PARTNER_Name}
                            </TableCell>
                            <TableCell
                              className="text-left font-medium text-blue-400"
                              onClick={() => viewDetails(shipment)}
                            >
                              {shipment.shippingId.orderId}
                            </TableCell>
                            <TableCell
                              className="text-left font-medium text-blue-400"
                              onClick={() => viewDetails(shipment)}
                            >
                              {shipment.failureReason || ""}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="delivered">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="hidden md:table-cell text-left ">
                            Shipment ID
                          </TableHead>
                          <TableHead className="text-left">
                            AWB Number
                          </TableHead>
                          <TableHead className="text-left">Date</TableHead>
                          <TableHead className="text-left">Consignee</TableHead>
                          <TableHead className="text-left">Pincode</TableHead>
                          <TableHead className="text-left">
                            Courier Name
                          </TableHead>
                          <TableHead className="text-left">Order ID</TableHead>
                          </TableRow>
                      </TableHeader>

                      <TableBody>
                        {delivered?.map((shipment, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-left font-bold">
                              {shipment.shippingId.SHIPMENT_ID}
                            </TableCell>
                            <TableCell
                              className="text-left text-blue-400 cursor-pointer"
                              onClick={() => viewDetails(shipment, true)}
                            >
                              {shipment.shippingId.awbNumber}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-left">
                              {
                                new Date(shipment.shippingId.createdAt)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </TableCell>
                            <TableCell className="text-left font-medium">
                              {shipment.consignee ? shipment.consignee : "Ram"}
                            </TableCell>
                            <TableCell className="text-left">
                              {shipment.pincode || "201301"}
                            </TableCell>
                            <TableCell className="text-left">
                              {shipment.shippingId.PARTNER_Name}
                            </TableCell>
                            <TableCell
                              className="text-left font-medium text-blue-400"
                              onClick={() => viewDetails(shipment)}
                            >
                              {shipment.shippingId.orderId}
                            </TableCell>
                            
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="rto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="hidden md:table-cell text-left ">
                            Shipment ID
                          </TableHead>
                          <TableHead className="text-left">
                            AWB Number
                          </TableHead>
                          <TableHead className="text-left">Date</TableHead>
                          <TableHead className="text-left">Consignee</TableHead>
                          <TableHead className="text-left">Pincode</TableHead>
                          <TableHead className="text-left">
                            Courier Name
                          </TableHead>
                          <TableHead className="text-left">Order ID</TableHead>
                          </TableRow>
                      </TableHeader>

                      <TableBody>
                        {rto?.map((shipment, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-left font-bold">
                              {shipment.shippingId.SHIPMENT_ID}
                            </TableCell>
                            <TableCell
                              className="text-left text-blue-400 cursor-pointer"
                              onClick={() => viewDetails(shipment, true)}
                            >
                              {shipment.shippingId.awbNumber}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-left">
                              {
                                new Date(shipment.shippingId.createdAt)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </TableCell>
                            <TableCell className="text-left font-medium">
                              {shipment.consignee ? shipment.consignee : "Ram"}
                            </TableCell>
                            <TableCell className="text-left">
                              {shipment.pincode || "201301"}
                            </TableCell>
                            <TableCell className="text-left">
                              {shipment.shippingId.PARTNER_Name}
                            </TableCell>
                            <TableCell
                              className="text-left font-medium text-blue-400"
                              onClick={() => viewDetails(shipment)}
                            >
                              {shipment.shippingId.orderId}
                            </TableCell>
                            
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </CardHeader>
      </Card>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to apply the action:</p>
          <div className="flex flex-col gap-4">
            <p className="font-semibold">
              "{selectedAction}" to Shipment ID
              {selectedShipment?.SHIPMENT_ID}?
            </p>
            <Textarea
              required
              name="description"
              id="description"
              className="px-3 py-2 border border-gray-400 rounded-lg"
              placeholder="Reason for your action..."
              onChange={(e) => setActionReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelAction}>
              No, Cancel
            </Button>
            <Button
              className="border-2 border-primary text-blue-400 hover:text-white  hover:bg-blue-400"
              onClick={confirmAction}
            >
              Yes, Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isRaising} onOpenChange={setIsRaising}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Raise an NDR issue Ticket </DialogTitle>
            <DialogDescription>
              Please write down you issue in detail.
            </DialogDescription>
          </DialogHeader>
          <textarea
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Describe your issue"
          />

          <DialogFooter className="flex justify-around ">
            <Button
              variant="outline"
              onClick={handleSubmitTicket}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Submit ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isExporting} onOpenChange={setIsExporting}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Export </DialogTitle>
            <DialogDescription>
              Download excel or pickup list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-around ">
            <Button
              variant="outline"
              onClick={handleDownloadExcel}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Excel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NdrTable;
