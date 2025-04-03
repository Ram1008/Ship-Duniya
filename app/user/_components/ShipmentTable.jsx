import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock4,
  Download,
  Eye,
  Loader2,
  Package,
  ReceiptText,
} from "lucide-react";
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
import JsBarcode from "jsbarcode";
import "jspdf-autotable";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import Pagination from "@/components/custom/Pagination";
import axiosInstance from "@/utils/axios";

const ShipmentTable = ({
  userData,
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
  const [shipmentStatus, setShipmentStatus] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [open, setOpen] = useState(false);

  console.log("shipment:", shipments);

  const handleSelect = (type) => {
    setShipmentStatus(type); // Set status
    setOpen(false); // Close dropdown
  };

  const filteredShippings = shipments.filter((shipment) => {
    const matchesSearchQuery = searchQuery
      ? shipment.consignee?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.awbNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.orderId?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesDateRange =
      new Date(shipment.createdAt) >= new Date(dateRange.from) &&
      new Date(shipment.createdAt) <= new Date(dateRange.to);

    const matchesOrderType =
      orderType === "All" || orderType === ""
        ? true
        : shipment.orderIds[0]?.orderType?.toLowerCase() === orderType.toLowerCase();

    const matchesPartnerType =
      partnerType === "" || partnerType === "All"
        ? true
        : shipment.partnerDetails?.name?.toLowerCase().includes(partnerType.toLowerCase());

    const matchesShipmentStatus =
      shipmentStatus === "" ? true : shipment.status === shipmentStatus;

    return (
      matchesSearchQuery &&
      matchesDateRange &&
      matchesOrderType &&
      matchesPartnerType &&
      matchesShipmentStatus
    );
  });

  // Function to toggle selection of a single shipment
  const toggleSelectShipment = (shipment) => {
    setSelectedShipments((prev) =>
      prev.includes(shipment._id) // Assuming _id is the unique identifier
        ? prev.filter((o) => o !== shipment._id)
        : [...prev, shipment._id]
    );
  };

  // Function to toggle selection of all shipments
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedShipments([]); // Deselect all
    } else {
      setSelectedShipments(shipments.map((shipment) => shipment._id)); // Select all
    }
    setSelectAll(!selectAll);
  };

  const viewDetails = (shipment, tracking = false) => {
    console.log(shipment);
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
        shipment.partnerDetails.name,
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
  // Function to download selected shipments as PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    console.log(userData);
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    doc.setFont("times", "normal");

    doc.setFontSize(16);
    doc.setFont("times", "bold");
    doc.text("PICKUP LIST", 105, 20, { align: "center" });

    const { name = "", code = "", phone = [], address = "" } = userData;
    const selectedOrderCount = selectedShipments.length;

    const mobileText = Array.isArray(phone) ? phone.join(", ") : phone;

    doc.setFontSize(11);
    doc.setFont("times", "bold");
    doc.text(`USER NAME (CODE):- ${name} ${code}`, margin, 35);
    doc.text(`PHONE NO.:- ${mobileText}`, margin, 43);
    doc.text(`ADDRESS:- ${address}`, margin, 51);
    doc.text(`Parcels:- ${selectedOrderCount}`, margin, 59);

    const tableColumn = [
      "Sno",
      "Awb number",
      "Consignee name",
      "Pincode",
      "Courier",
      "Sign",
    ];

    const tableRows = [];
    selectedShipments.forEach((selectedId, index) => {
      const shipment = shipments.find(
        (shipment) => shipment._id === selectedId
      );
      if (shipment) {
        tableRows.push([
          index + 1,
          shipment.awbNumber,
          shipment.consignee,
          shipment.orderIds[0].pincode,
          shipment.partnerDetails.name,
        ]);
      }
    });

    const colWidthTotal = 200;
    const scaleFactor = contentWidth / colWidthTotal;

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 65,
      margin: { left: margin, right: margin },
      styles: {
        font: "times",
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 20 * scaleFactor },
        1: { halign: "left", cellWidth: 30 * scaleFactor },
        2: { halign: "left", cellWidth: 45 * scaleFactor },
        3: { halign: "left", cellWidth: 40 * scaleFactor },
        4: { halign: "left", cellWidth: 40 * scaleFactor },
        5: { halign: "center", cellWidth: 25 * scaleFactor },
      },
      didDrawCell: (data) => {
        const { row, column } = data;
        const { x, y, width, height } = data.cell;
        // Draw lines for each cell
        doc.line(x, y, x + width, y); // Top
        doc.line(x, y + height, x + width, y + height); // Bottom
        doc.line(x, y, x, y + height); // Left
        doc.line(x + width, y, x + width, y + height); // Right
      },
    });

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB");
    const formattedTime = now.toLocaleTimeString();

    const yPosition = doc.lastAutoTable.finalY + 30;
    doc.setFontSize(10);
    doc.text(
      `Generated At: ${formattedDate}\n             ${formattedTime}`,
      pageWidth - margin - 30,
      yPosition
    );

    doc.setFontSize(11);
    doc.setFont("times", "bold");
    doc.text("SIGNATURE / STAMP", pageWidth - margin - 30, yPosition + 40);

    doc.save("shipment_pick_list.pdf");
  };

  // Helper function to convert Blob to Data URL
  // Helper function: Convert blob to a cleaned Data URL using a canvas
  const blobToCleanDataURL = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        const img = new Image();
        // Setting crossOrigin can help avoid CORS issues
        img.crossOrigin = "Anonymous";
        img.onload = function () {
          // Create a canvas with the same dimensions as the image
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          // Generate a new, clean Data URL from the canvas
          const cleanDataUrl = canvas.toDataURL("image/png");
          resolve(cleanDataUrl);
        };
        img.onerror = () =>
          reject(new Error("Image failed to load for canvas conversion."));
        img.src = dataUrl;
      };
      reader.onerror = () =>
        reject(new Error("Failed to convert blob to Data URL."));
      reader.readAsDataURL(blob);
    });
  };

  const handleGenerateInvoice = async () => {
    const ts = [];
    selectedShipments.forEach((id) => {
      const shipment = shipments.find((s) => s._id === id);
      ts.push(shipment);
    });

    const doc = new jsPDF();

    selectedShipments.forEach((selectedId, index) => {
      const shipment = shipments.find((s) => s._id === selectedId);
      console.log(shipment);
      if (!shipment) return;
      if (index !== 0) doc.addPage();

      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Title - centered, bold
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("TAX INVOICE", pageWidth / 2, 20, { align: "center" });

      // Order Information section
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Order Information", 20, 35);

      doc.setFont("helvetica", "normal");
      doc.text(`Shipment Reference : ${shipment.shipmentId}`, 20, 40);
      doc.text(`AWB Number : ${shipment.awbNumber}`, 20, 45);

      // Invoice section (right aligned)
      doc.setFont("helvetica", "bold");
      doc.text("Invoice", pageWidth - 10, 35, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.text(
        `Invoice Number : ${shipment.orderIds[0].invoiceNumber}`,
        pageWidth - 10,
        40,
        { align: "right" }
      );
      doc.text(
        `Invoice Date : ${new Date().toLocaleDateString() || "Mar 18, 2025"}`,
        pageWidth - 10,
        45,
        { align: "right" }
      );

      doc.line(15, 50, 200, 50);
      // Sold By and Billed To sections in the same row with proper spacing
      const leftColumnX = 20;
      const rightColumnX = pageWidth / 2 + 20; // Start the right column after halfway point plus some margin

      // Sold By section (left side)
      doc.setFont("helvetica", "bold");
      doc.text("Send By:", leftColumnX, 60);

      doc.setFont("helvetica", "normal");
      doc.text(shipment.pickupAddress.name, leftColumnX, 65);
      doc.text(`${shipment?.pickupAddress.addressLine1}`, leftColumnX, 70);
      doc.text(`${shipment?.pickupAddress.addressLine2}`, leftColumnX, 75);
      doc.text(`${shipment?.pickupAddress.pincode}`, leftColumnX, 80);

      // Billed To section (right side, aligned left)
      doc.setFont("helvetica", "bold");
      doc.text("Send To:", rightColumnX, 60);

      doc.setFont("helvetica", "normal");
      doc.text(`${shipment.orderIds[0].consignee}`, rightColumnX, 65);
      doc.text(`${shipment.orderIds[0].consigneeAddress1}`, rightColumnX, 70);
      doc.text(
        `${
          shipment.orderIds[0].city + shipment.orderIds[0].state ||
          "Kendrapara,"
        }`,
        rightColumnX,
        75
      );
      doc.text(`${shipment.orderIds[0].pincode || "754225"}`, rightColumnX, 80);

      // Product Table
      const productColumns = [
        "Product ID",
        "Invoice Number",
        "Quantity",
        "Total",
      ];
      const productData = [
        [
          shipment.orderIds[0].orderId,
          shipment.orderIds[0].invoiceNumber,
          shipment.orderIds[0].quantity,
          shipment.partnerDetails.charges,
        ],
      ];

      doc.autoTable({
        head: [productColumns],
        body: productData,
        startY: 95,
        theme: "grid",
        headStyles: {
          fillColor: [200, 200, 200],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 8,
        },
      });

      // Dimensions table
      const dimensionColumns = [
        "Weight (gram)",
        "Length (cm)",
        "Breadth (cm)",
        "Height (cm)",
      ];
      const dimensionData = [
        [
          shipment.orderIds[0].actualWeight,
          shipment.orderIds[0].length,
          shipment.orderIds[0].breadth,
          shipment.orderIds[0].height,
        ],
      ];

      const productTableHeight = doc.previousAutoTable.finalY;

      doc.autoTable({
        head: [dimensionColumns],
        body: dimensionData,
        startY: productTableHeight + 10,
        theme: "grid",
        headStyles: {
          fillColor: [200, 200, 200],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 8,
        },
      });

      // // Shipping charges table
      // const shippingColumns = [
      //   "HSN Code",
      //   "Base Amount",
      //   "CGST @9%",
      //   "SGST @9%",
      //   "UTGST @0%",
      //   "Net Payable",
      // ];
      // const shippingData = [
      //   [
      //     shipment.shippingHsnCode || "996812",
      //     shipment.baseAmount || "0",
      //     shipment.cgst || "0",
      //     shipment.sgst || "0",
      //     shipment.utgst || "0",
      //     shipment.netPayable || "0",
      //   ],
      // ];

      const dimensionTableHeight = doc.previousAutoTable.finalY;

      // doc.autoTable({
      //   head: [shippingColumns],
      //   body: shippingData,
      //   startY: dimensionTableHeight + 10,
      //   theme: "grid",
      //   headStyles: {
      //     fillColor: [200, 200, 200],
      //     textColor: [0, 0, 0],
      //     fontStyle: "bold",
      //   },
      //   styles: {
      //     fontSize: 8,
      //   },
      // });

      // Footer text
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        "This is a computer generated invoice no signature is required.",
        pageWidth / 2,
        pageHeight - 20,
        { align: "center" }
      );
    });

    // Save the generated PDF
    doc.save("tax-invoice.pdf");
  };

  const handleLabeling = async () => {
    try {
      const selectedAwbNumbers = selectedShipments
        .map((id) => shipments.find((s) => s._id === id)?.awbNumber)
        .filter((awb) => awb !== undefined);

      const response = await axiosInstance
        .post("/label", {
          awbNumbers: selectedAwbNumbers,
        })
        .catch((err) => {
          console.error("Error fetching label data:", err);
          alert("Failed to generate labels. Please try again.");
          return { data: { labels: [] } };
        });

      if (!response.data.labels || response.data.labels.length === 0) {
        console.error("No label data received from server");
        alert("No label data available.");
        return;
      }

      const generateBarcodeDataUrl = (text) => {
        const canvas = document.createElement("canvas");
        JsBarcode(canvas, text, {
          format: "CODE128",
          width: 2,
          height: 50,
          displayValue: false,
        });
        return canvas.toDataURL("image/png");
      };

      const logoUrl = "../../../public/shipDuniyaIcon.jpg";

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      for (let i = 0; i < response.data.labels.length; i++) {
        const labelData = response.data.labels[i];
        const shipment = shipments.find((s) => s.awbNumber === labelData.awb);

        if (!shipment) {
          console.error(`Shipment not found for AWB: ${labelData.awb}`);
          continue;
        }

        if (i > 0) doc.addPage();

        // Generate barcodes
        const orderId = shipment.shipmentId || "N/A";
        const awbNumber = shipment.awbNumber || "0123456789";

        // Generate barcode data URLs
        const orderIdBarcodeUrl = generateBarcodeDataUrl(orderId);
        const awbBarcodeUrl = generateBarcodeDataUrl(awbNumber);
        // const logoImageToPut =

        // To section
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("To:", 15, 20);

        // Recipient address - Make this all caps and bold
        doc.setFont("helvetica", "bold");

        // Get full address from shipment
        const fullAddress = shipment.pickupAddress?.addressLine1 || "";
        const addressLines = doc.splitTextToSize(fullAddress, 140);

        let currentY = 30;
        addressLines.forEach((line, index) => {
          doc.text(line.toUpperCase(), 15, currentY);
          currentY += 5;
        });

        doc.text(
          `India - ${shipment.pickupAddress?.pincode || "N/A"}`,
          15,
          currentY
        );
        currentY += 5;
        doc.text(
          `MOBILE NO: ${
            shipment.pickupAddress?.mobile || labelData.mobile || "N/A"
          }`,
          15,
          currentY
        );

        // Horizontal line after address
        doc.line(15, currentY + 25, 185, currentY + 25);

        // Logo box
        doc.rect(150, 15, 45, 45); // Draw square box
        doc.addImage(
          "https://storage.googleapis.com/ship-duniya_bucket/Images/shipDuniyaIcon.jpg",
          "JPEG", // or "PNG" if your image is in PNG format
          150, // x-coordinate (matches the square's x position)
          15, // y-coordinate (matches the square's y position)
          45, // width (same as the square's width)
          45 // height (same as the square's height)
        );

        // COD and weight section
        doc.setFontSize(18).setFont("helvetica", "bold").text("COD", 50, 80);
        doc.text(
          `₹${shipment.orderIds[0].collectibleValue || labelData.codAmount || "0"}`,
          50,
          88
        );

        doc.text(`${shipment.weight || labelData.weight || "2"}kg`, 150, 80);
        doc.text(
          shipment.dimensions || labelData.dimensions || "45X45X45",
          150,
          88
        );

        // Horizontal line after COD/weight
        doc.line(15, 95, 185, 95);

        // Order details
        doc.setFontSize(10).setFont("helvetica", "normal");
        doc.text(`Order id: ${orderId}`, 15, 105);
        doc.text(
          `Order Date: ${
            new Date(shipment.createdAt).toLocaleDateString() || "N/A"
          }`,
          15,
          110
        );
        doc.text(`Invoice number-${shipment.orderIds[0].invoiceNumber}`, 15, 115);

        // Add Order ID barcode (Aligned on the same row)
        doc.addImage(orderIdBarcodeUrl, "PNG", 120, 105, 60, 15);
        doc.setFontSize(8);
        doc.text(shipment.orderIds[0].orderId, 145, 123);

        // Horizontal line after order details
        doc.line(15, 130, 185, 130);

        // Destination and courier info
        doc.setFontSize(10);
        doc.text(
          `Fwd Destination Code: ${labelData.destinationCode || "N/A"}`,
          15,
          140
        );
        doc.text(
          `Courier partner : ${
            shipment?.partnerDetails?.name || shipment.partnerName || "N/A"
          }`,
          15,
          145
        );

        // Add AWB barcode - centered
        doc.addImage(awbBarcodeUrl, "PNG", 50, 150, 100, 20);
        doc.setFont("helvetica", "bold");
        doc.text(`AWB NUMBER (${awbNumber})`, 85, 173);

        // Product details section
        doc.setFont("helvetica", "normal");
        doc.text("Product details:-", 15, 180);

        // Simplified product table
        const tableHeaders = [
          "Consignee",
          "Pincode",
          "Quantity",
          "Product description"
        ];

        // Calculate equal column width dynamically
        const colWidth = 170 / tableHeaders.length;

        let xPos = 15;

        // Draw table headers with text wrapping
        tableHeaders.forEach((header) => {
          doc.rect(xPos, 185, colWidth, 10);

          // Wrap header text if needed
          const wrappedHeader = doc.splitTextToSize(header, colWidth - 2);
          doc.setFont("helvetica", "bold");

          // Position the text with vertical centering
          wrappedHeader.forEach((line, idx) => {
            doc.text(line, xPos + 2, 190 + idx * 4); // Adjust line spacing
          });

          xPos += colWidth;
        });

        // Draw table rows
        console.log(shipment)
        if (shipment.orderIds?.length > 0) {
          shipment.orderIds.forEach((product, j) => {
            xPos = 15;

            tableHeaders.forEach((_, k) => {
              doc.rect(xPos, 195 + j * 10, colWidth, 10);

              const value = [
                product.consignee || "-",
                product.pincode || "-",
                product.quantity?.toString(),
                product.itemDescription
              ][k];

              // Wrap content if necessary
              const wrappedValue = doc.splitTextToSize(value, colWidth - 2);
              doc.setFont("helvetica", "normal");

              wrappedValue.forEach((line, idx) => {
                doc.text(line, xPos + 2, 201 + j * 10 + idx * 4); // Adjust line spacing
              });

              xPos += colWidth;
            });
          });
        }

        // Pickup and return address
        doc.setFont("helvetica", "bold");
        doc.text("Pickup and Return Address:", 15, 215);
        doc.setFont("helvetica", "normal");
        doc.text(
          "SHIP DUNIYA C 45 GROUND FLOOR SECTOR 10 NOIDA- 201301 Delhi",
          15,
          220
        );
        doc.text("NCR, uttar pradesh, India - 201301", 15, 225);
        doc.text(
          `Mobile No.: ${labelData.pickupMobile || "9220551211"}  GST No: ${
            labelData.gstNumber || "09APLFS8825D1ZK"
          }`,
          15,
          230
        );

        // Contact information outside the main border
        doc.setFont("helvetica", "bold");
        doc.text("For any query please contact:", 15, 235);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Mobile no:- ${labelData.supportMobile || "9990531211"} Email: ${
            labelData.supportEmail || "shipduniya@gmail.com"
          }`,
          15,
          240
        );

        // Draw main border - ending at the mobile number line
        doc.setLineWidth(0.5);
        doc.rect(10, 10, 190, 235);

        // Disclaimer box
        doc.rect(15, 255, 175, 17, "S");
        doc.setFontSize(8);
        doc.text(
          "ALL DISPUTES ARE SUBJECTS TO UTTAR PRADESH(U.P) JURISDICTION ONLY. GOODS",
          17,
          260
        );
        doc.text(
          "ONCE SOLD WILL ONLY BE TAKEN BACK OR EXCHANGED AS PER THE STORE'S",
          17,
          265
        );
        doc.text("EXCHANGE/RETURN POLICY.", 17, 270);

        // Footer text
        doc.setFontSize(9).setFont("helvetica", "bold");
        doc.text("THIS IS AN AUTO-GENERATED LABEL &", 15, 280);
        doc.text("DOES NOT NEED SIGNATURE", 15, 285);

        // Add powered by logo text
        doc.text("Powered by:-", 140, 280);
        doc.setTextColor(0, 0, 150); // Set "SHIP" to blue
        doc.text("SHIP", 152, 285);
        doc.setTextColor(255, 0, 0); // Set "DUNIYA" to red
        doc.text("DUNIYA", 165, 285);
        doc.setTextColor(0, 0, 0); // Reset to black

        const img = new Image();
        img.src = logoUrl;
        img.onload = () => {
          doc.addImage(img, "PNG", 135, 285, 20, 20); // Adjust positioning and size as needed
        };
      }

      doc.save("shipping-labels.pdf");
    } catch (error) {
      console.error("Error generating labels:", error);
      alert("An error occurred while generating labels.");
    }
  };

  return (
    <>
      <Dialog open={isExporting} onOpenChange={setIsExporting}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Export </DialogTitle>
            <DialogDescription>Download excel.</DialogDescription>
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
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Shipments</CardTitle>
            <input
              type="text"
              placeholder="Search by consignee name, awb number or orderId"
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
          <div className="flex justify-between items-center mb-4 pt-2">
            <div className="flex items-center flex-wrap gap-4">
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />

              <div className="w-[130px]">
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
          <div className="flex justify-between flex-row-reverse pt-2 h-10">
            <div className="flex gap-2">
              <Button onClick={() => setShipmentStatus("")}>
                <span className=""> All </span>
              </Button>
              <Button onClick={() => setShipmentStatus("pending")}>
                <span className=""> Pending Pickup</span>
              </Button>
              <Button onClick={() => setShipmentStatus("delivered")}>
                <span className="">Delivered </span>
              </Button>
              <Button onClick={() => setShipmentStatus("in-transit")}>
                <span className="">In-Transit </span>
              </Button>
              <Select open={open} onOpenChange={setOpen}>
                <SelectTrigger>
                  <SelectValue placeholder="More ..." />
                </SelectTrigger>
                <SelectContent>
                  <div className="flex flex-col gap-2">
                    {["rto", "lost"].map((type) => (
                      <Button
                        size="sm"
                        variant="outline"
                        key={type}
                        onClick={() => handleSelect(type)}
                      >
                        <span className="text-sm">{type.toUpperCase()}</span>
                      </Button>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>
            {selectedShipments.length > 0 && (
              <div className="flex gap-2">
                <Button variant="export" onClick={handleLabeling}>
                  <span>Generate bulk label</span>
                </Button>
                <Button
                  variant="export"
                  onClick={handleDownloadPDF}
                  className="w-40"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Pickup list
                </Button>
                <Button
                  variant="export"
                  onClick={handleGenerateInvoice}
                  className="w-40"
                >
                  <ReceiptText className="mr-2 h-4 w-4" />
                  Generate Invoice
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-1">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <Table className="mt-4 p-0">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left flex flex-row justify-center items-center gap-x-2">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                    />
                    <span>Select</span>
                  </TableHead>
                  <TableHead className="hidden md:table-cell text-left ">
                    Shipment ID
                  </TableHead>
                  <TableHead className="text-left">AWB Number</TableHead>
                  <TableHead className="text-left">Date</TableHead>
                  <TableHead className="text-left">Order Type</TableHead>
                  <TableHead className="text-left">Consignee</TableHead>
                  <TableHead className="text-left">Pincode</TableHead>
                  <TableHead className="text-left">Courier Name</TableHead>
                  <TableHead className="text-left">Order Details</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShippings.map((shipment, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-left">
                      <input
                        type="checkbox"
                        checked={selectedShipments.includes(shipment._id)}
                        onChange={() => toggleSelectShipment(shipment)}
                      />
                    </TableCell>
                    <TableCell className="text-left font-bold">
                      {shipment.shipmentId}
                    </TableCell>
                    <TableCell
                      className="text-left text-blue-400 cursor-pointer"
                      onClick={() => viewDetails(shipment, true)}
                    >
                      {shipment.awbNumber}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-left">
                      {new Date(shipment.createdAt).toISOString().split("T")[0]}
                    </TableCell>
                    <TableCell className="text-left font-medium">
                      {shipment.orderIds[0].orderType}
                    </TableCell>
                    <TableCell className="text-left font-medium">
                      {shipment.consignee}
                    </TableCell>
                    <TableCell className="text-left">
                      {shipment.orderIds[0].pincode}
                    </TableCell>
                    <TableCell className="text-left">
                      {shipment.partnerDetails?.name}
                    </TableCell>
                    <TableCell className="text-left font-medium text-blue-400 cursor-pointer">
                      <Button onClick={() => viewDetails(shipment)} size="sm">
                        View{" "}
                      </Button>
                    </TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button
                        type="primary"
                        size="large"
                        icon={<Clock4 />}
                        className="relative text-white overflow-hidden rounded-lg px-4 py-2 font-semibold bg-gradient-to-tr from-blue-800 to-orange-800 hover:opacity-75 transition-all duration-300"
                      >
                        {shipment.status?.trim().toLowerCase() === "pending"
                          ? "Pickup Pending"
                          : shipment.status || "Pending"}
                        <span className="absolute inset-0 bg-gradient-to-tr from-indigo-600 via-blue-400 to-cyan-400 opacity-50 transition-all duration-300 transform scale-110"></span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ShipmentTable;
