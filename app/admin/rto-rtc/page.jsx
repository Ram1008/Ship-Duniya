"use client";
import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/utils/axios";
import RtoTable from "../_components/RtoTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Upload } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const RtoRtc = () => {
  const [rtoRtcData, setRtoRtcData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    from: new Date(2022, 0, 1),
    to: new Date(),
  });
  const [partnerType, setPartnerType] = useState("All");
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("admin/rtcorders");
      setRtoRtcData(response.data);
    } catch (error) {
      console.error("Error fetching rto/rtc:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleImportExcel = async (event) => {
    const file = event.target.files[0];
    if (!file || !file.name.endsWith(".xlsx")) {
      alert("Please upload a valid .xlsx file");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const reader = new FileReader();

    reader.onload = async (e) => {
      const buffer = e.target.result;
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.getWorksheet("Shipments");
      const importedData = worksheet
        .getSheetValues()
        .slice(2)
        .map((row) => ({
          SHIPMENT_ID: row[1],
          awbNumber: row[2],
          createdAt: new Date(row[3]).toISOString(),
          consignee: row[4],
          pincode: row[5],
          PARTNER_Name: row[6],
          orderId: row[7],
          status: row[8],
        }));

      console.log("Imported Data:", importedData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Shipments");

    worksheet.addRow([
      "Shipment ID",
      "AWB Number",
      "Date",
      "Consignee",
      "Pincode",
      "Courier Name",
      "Order ID",
      "Status",
    ]);

    filteredData.forEach((shipment) => {
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
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "shipments.xlsx"
    );
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "Shipment ID",
          "AWB Number",
          "Date",
          "Consignee",
          "Pincode",
          "Courier Name",
          "Order ID",
          "Status",
        ],
      ],
      body: filteredData.map((shipment) => [
        shipment.SHIPMENT_ID,
        shipment.awbNumber,
        new Date(shipment.createdAt).toLocaleDateString(),
        shipment.consignee,
        shipment.pincode,
        shipment.PARTNER_Name,
        shipment.orderId,
        shipment.status,
      ]),
    });

    doc.save("shipments.pdf");
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setFile(selectedFile);
        setError(null);
      } else {
        setFile(null);
        setError("Please upload a valid Excel file (.xlsx)");
      }
    }
  };

  const handleDownloadSchema = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Schema");

    const headings = ["AWB Number"];

    worksheet.addRow(headings);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk_AWB_schema.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = useCallback(async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    // try {
    //   const response = onUpload(file);
    //   if (response) {
    //     setSuccess("File uploaded successfully");
    //     setFile(null);
    //     setIsOpen(false);
    //   }
    // } catch (err) {
    //   setError("An error occurred while uploading the file");
    //   console.error(err);
    // }
  }, [file]);

  return (
    <>
      
      <Card>
        <CardHeader className="space-y-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Returned Orders
            </CardTitle>
            <div className="flex gap-2">
              <Button size="lg" onClick={() => setIsImporting((prev) => !prev)}>
                <span className="text-md">+ Import </span>
              </Button>
              <Button
                variant="export"
                size="lg"
                onClick={() => setIsExporting((prev) => !prev)}
              >
                <span className="text-md">+ Export </span>
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Input
              type="text"
              placeholder="Search by order Id or Consignee Name"
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            <Select
              value={partnerType}
              onValueChange={(value) => setPartnerType(value)}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Choose courier partner" />
              </SelectTrigger>
              <SelectContent>
                {["All", "xpressbees", "ecom", "delhivery"].map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <RtoTable
          rtoRtcData={rtoRtcData}
          setRtoRtcData={setRtoRtcData}
          loading={loading}
          setLoading={setLoading}
        />
      </Card>
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
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Pickup list
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isImporting} onOpenChange={setIsImporting}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Import AWBs</DialogTitle>
            <DialogDescription>
              Upload your Excel file with the list of AWBs to move the AWBs to
              RTC.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="excel-file" className="text-right">
                Excel File
              </Label>
              <Input
                id="excel-file"
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="col-span-3"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert
                variant="default"
                className="border-green-500 text-green-700"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                onClick={handleDownloadSchema}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Schema
              </Button>
              <Button onClick={handleUpload} className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RtoRtc;
