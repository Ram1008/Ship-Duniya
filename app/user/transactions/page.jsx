"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Eye,
  Loader2,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/utils/axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { se } from "date-fns/locale";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Utility to get badge color based on status
const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Group transactions by month/year using the updatedAt field
const groupTransactionsByMonth = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const monthYear = format(new Date(transaction.updatedAt), "MMMM yyyy");
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(transaction);
    return acc;
  }, {});
};

// Generate monthly invoice objects from the grouped transactions
const generateMonthlyInvoices = (groupedTransactions) => {
  return Object.entries(groupedTransactions).map(
    ([monthYear, transactions]) => {
      // Sum total amount for the month
      const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
      // Split month and year from the key (ex: "March 2023")
      const [month, year] = monthYear.split(" ");
      return {
        id: `INV-${month.substring(0, 3).toUpperCase()}-${year}`, // e.g. INV-MAR-2023
        month,
        year: parseInt(year, 10),
        amount: totalAmount,
        transactions, // include transactions for detailed invoice view
        // Dummy status logic – adjust as needed
        status: totalAmount > 0 ? "Paid" : "Pending",
      };
    }
  );
};

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [monthlyInvoices, setMonthlyInvoices] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedYear, setSelectedYear] = useState("all");
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(2022, 0, 1),
    to: new Date(),
  });

  // Filter transactions based on search query and date range
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearchQuery = searchQuery
      ? transaction.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.orderId?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesDateRange =
      new Date(transaction.updatedAt) >= new Date(dateRange.from) &&
      new Date(transaction.updatedAt) <= new Date(dateRange.to);

    return matchesSearchQuery && matchesDateRange;
  });

  const walletTransactions = filteredTransactions.filter((trans) =>
    trans.type.includes("wallet")
  );

  const shippingTransactions = filteredTransactions.filter((trans) =>
    trans.type.includes("shipping")
  );

  // Filter invoices based on search query and selected year
  const filteredInvoices = monthlyInvoices.filter(
    (invoice) =>
      (invoice.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedYear === "all" || invoice.year.toString() === selectedYear)
  );

  // Get status icon for invoice badge
  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid":
        return <CheckCircle2 className="h-4 w-4 mr-2 text-green-800" />;
      case "Pending":
        return <Clock className="h-4 w-4 mr-2 text-yellow-800" />;
      case "Overdue":
        return <XCircle className="h-4 w-4 mr-2 text-red-800" />;
      default:
        return <CheckCircle2 className="h-4 w-4 mr-2 text-gray-800" />;
    }
  };

  const handleDownloadInvoice = () => {
    // Get invoice data from your API
    const invoice = monthlyInvoices.find((inv) => inv.id === selectedInvoice);
    if (!invoice) {
      alert("Please select a valid invoice to download.");
      return;
    }

    // Create new PDF document
    const doc = new jsPDF();

    // Set initial margins and position
    const leftMargin = 15;
    const topMargin = 15;
    let currentY = topMargin;

    // Load and add logo image
    const logoUrl = "../../../public/shipDuniyaIcon.jpg";
    const img = new Image();
    img.src = logoUrl;

    img.onload = function () {
      // Add logo to the PDF
      doc.addImage(img, "JPEG", leftMargin, currentY, 30, 30);

      // Continue with the rest of the PDF generation
      continueWithPdfGeneration();
    };

    img.onerror = function () {
      console.error("Error loading logo image");
      // Continue with PDF generation without the logo
      doc.rect(leftMargin, currentY, 30, 30);
      continueWithPdfGeneration();
    };

    function continueWithPdfGeneration() {
      // Add company name and title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("TAX INVOICE", doc.internal.pageSize.width / 2, currentY + 10, {
        align: "center",
      });

      doc.setFontSize(20);
      doc.text("SHIP DUNIYA", doc.internal.pageSize.width / 2, currentY + 20, {
        align: "center",
      });

      // Add "Original Copy" text
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text("Original Copy", doc.internal.pageSize.width - 20, currentY + 10, {
        align: "right",
      });

      // Company address and details
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        "C-45, GROUND FLOOR, SECTORE 10, NOIDA",
        doc.internal.pageSize.width / 2,
        currentY + 30,
        { align: "center" }
      );
      doc.text(
        `GSTIN : ${invoice.sellerGstin || "09AFLFS8825D1ZK"}`,
        doc.internal.pageSize.width / 2,
        currentY + 35,
        { align: "center" }
      );
      doc.text(
        `Tel. : ${invoice.sellerPhone || "9290551411, 9990531411"}   email : ${
          invoice.sellerEmail || "shipduniya@gmail.com"
        }`,
        doc.internal.pageSize.width / 2,
        currentY + 40,
        { align: "center" }
      );

      currentY += 45;

      // Supply details box
      doc.rect(doc.internal.pageSize.width - 80, currentY, 80, 20);
      doc.text(
        "Place of Supply   :   Uttar Pradesh (09)",
        doc.internal.pageSize.width - 75,
        currentY + 8
      );
      doc.text(
        "Reverse Charge    :   N",
        doc.internal.pageSize.width - 75,
        currentY + 15
      );

      currentY += 25;

      // Billing and shipping information
      const billingStartX = leftMargin;
      const shippingStartX = doc.internal.pageSize.width / 2;

      // Draw boxes
      doc.rect(
        billingStartX,
        currentY,
        doc.internal.pageSize.width / 2 - leftMargin,
        40
      );
      doc.rect(
        shippingStartX,
        currentY,
        doc.internal.pageSize.width / 2 - leftMargin,
        40
      );

      // Box headers
      doc.setFont("helvetica", "bold");
      doc.text("Billed to : (SELLER DETAILS)", billingStartX + 5, currentY + 8);
      doc.text("Shipped to: (SELLER DETAILS)", shippingStartX + 5, currentY + 8);

      // Box content
      const address = [
        invoice.buyerName || "FOREVER ENGINEERING SYSTEM PVT LTD",
        invoice.buyerAddress1 || "B 817, 8TH FLOOR",
        invoice.buyerAddress2 || "ADVANT NAVIS BUSINESS PARK, SECTOR 142",
        invoice.buyerCity || "NOIDA, Uttar Pradesh, 201301",
      ];

      // Add billing address
      doc.text(address, billingStartX + 5, currentY + 15);

      // Add shipping address (same in this case)
      doc.text(address, shippingStartX + 5, currentY + 15);

      currentY += 45;

      // GSTIN Information
      doc.text(
        `GSTIN / UIN       :   ${invoice.buyerGstin || "09AACCF6683P1ZT"}`,
        billingStartX + 5,
        currentY
      );
      doc.text(
        `GSTIN / UIN       :   ${invoice.buyerGstin || "09AACCF6683P1ZT"}`,
        shippingStartX + 5,
        currentY
      );

      currentY += 10;

      // Line items table
      const tableColumns = [
        { header: "S.No.", dataKey: "sno" },
        { header: "Description of Goods", dataKey: "description" },
        { header: "HSN/SAC Code", dataKey: "hsn" },
        { header: "Qty.", dataKey: "qty" },
        { header: "Unit", dataKey: "unit" },
        { header: "List Price", dataKey: "price" },
        { header: "Discount", dataKey: "discount" },
        { header: "Amount(₹)", dataKey: "amount" },
      ];

      // Create table rows from invoice transactions
      let tableRows = [];

      if (invoice.transactions && invoice.transactions.length > 0) {
        tableRows = invoice.transactions.map((tx, index) => ({
          sno: index + 1,
          description: tx.description || "SHIPPING CHARGE",
          hsn: tx.hsn || "996812",
          qty: tx.quantity || "--",
          unit: tx.unit || "--",
          price: tx.price || "0.00 %",
          discount: "--",
          amount: tx.amount.toFixed(2),
        }));
      } else {
        // Fallback to sample data if no transactions
        tableRows = [
          {
            sno: 1,
            description: "SHIPPING CHARGE",
            hsn: "996812",
            qty: "--",
            unit: "--",
            price: "0.00 %",
            discount: "--",
            amount: "1000.00",
          },
        ];
      }

      // Calculate totals
      const subtotal = tableRows.reduce(
        (sum, row) => sum + parseFloat(row.amount),
        0
      );
      const taxRate = invoice.taxRate || 9;
      const cgst = (subtotal * taxRate) / 100;
      const sgst = (subtotal * taxRate) / 100;
      const roundOff = invoice.roundOff || 0.0;
      const grandTotal = subtotal + cgst + sgst + roundOff;

      // Add table
      doc.autoTable({
        head: [tableColumns.map((col) => col.header)],
        body: tableRows.map((row) => tableColumns.map((col) => row[col.dataKey])),
        startY: currentY,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: "bold",
          lineWidth: 0.1,
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 60 },
        },
      });

      // Get the Y position after the table
      currentY = doc.previousAutoTable.finalY + 10;

      // Add tax summary
      const taxStartX = doc.internal.pageSize.width - 120;

      doc.text("Add : CGST", taxStartX, currentY);
      doc.text(`₹`, taxStartX + 70, currentY, { align: "right" });
      doc.text(`${taxRate.toFixed(1)} %`, taxStartX + 80, currentY, {
        align: "right",
      });
      doc.text(`${cgst.toFixed(2)}`, taxStartX + 100, currentY, {
        align: "right",
      });

      currentY += 5;
      doc.text("Add : SGST", taxStartX, currentY);
      doc.text(`₹`, taxStartX + 70, currentY, { align: "right" });
      doc.text(`${taxRate.toFixed(1)} %`, taxStartX + 80, currentY, {
        align: "right",
      });
      doc.text(`${sgst.toFixed(2)}`, taxStartX + 100, currentY, {
        align: "right",
      });

      currentY += 5;
      doc.text("Add : Rounded Off (+)", taxStartX, currentY);
      doc.text(`${roundOff.toFixed(2)}`, taxStartX + 100, currentY, {
        align: "right",
      });

      currentY += 8;
      doc.setLineWidth(0.1);
      doc.line(
        taxStartX - 5,
        currentY - 3,
        doc.internal.pageSize.width - leftMargin,
        currentY - 3
      );

      doc.setFont("helvetica", "bold");
      doc.text("Grand Total", taxStartX, currentY);
      doc.text(`${grandTotal.toFixed(2)}`, taxStartX + 100, currentY, {
        align: "right",
      });

      // Create tax rate table
      currentY += 15;
      doc.autoTable({
        head: [
          ["Tax Rate", "Taxable Amt.", "CGST Amt.", "SGST Amt.", "Total Tax"],
        ],
        body: [
          [
            `${(taxRate * 2).toFixed(0)}%`,
            subtotal.toFixed(2),
            cgst.toFixed(2),
            sgst.toFixed(2),
            (cgst + sgst).toFixed(2),
          ],
        ],
        startY: currentY,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: "bold",
          lineWidth: 0.1,
        },
      });

      currentY = doc.previousAutoTable.finalY + 10;

      // Amount in words
      doc.setFont("helvetica", "bold");
      const amountInWords = numberToWords(Math.round(grandTotal));
      doc.text(`Rupees ${amountInWords} Only`, leftMargin, currentY);

      currentY += 10;

      // Terms and conditions and signature box
      const termsStartX = leftMargin;
      const termsWidth = doc.internal.pageSize.width / 2 - 20;
      const signatureStartX = doc.internal.pageSize.width / 2;
      const signatureWidth = doc.internal.pageSize.width / 2 - leftMargin;
      const boxHeight = 50;

      doc.rect(termsStartX, currentY, termsWidth, boxHeight);
      doc.rect(signatureStartX, currentY, signatureWidth, boxHeight);

      doc.setFont("helvetica", "bold");
      doc.text("Terms & Conditions", termsStartX + 5, currentY + 8);
      doc.text("Receiver's Signature    :", signatureStartX + 5, currentY + 8);

      doc.setFont("helvetica", "normal");
      doc.text("E & O.E", termsStartX + 5, currentY + 15);
      doc.text(
        "1. Goods once sold will not be taken back.",
        termsStartX + 5,
        currentY + 22
      );
      doc.text(
        "2. Interest @ 18% p.a will be charged if the payment",
        termsStartX + 5,
        currentY + 29
      );
      doc.text(
        "is not made with in the stipulated time.",
        termsStartX + 5,
        currentY + 36
      );
      doc.text(
        "3. Subject to 'Uttar Pradesh' Jurisdiction only.",
        termsStartX + 5,
        currentY + 43
      );

      doc.text(
        "for SHIP DUNIYA",
        signatureStartX + signatureWidth - 30,
        currentY + 40
      );
      doc.setFont("helvetica", "bold");
      doc.text(
        "Authorized Signatory",
        signatureStartX + signatureWidth - 30,
        currentY + 47
      );

      // Save PDF
      doc.save(`Invoice_${invoice.id || "Ship_Duniya"}.pdf`);
    }
  };

  // Helper function to convert number to words
  function numberToWords(num) {
    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    function convert(num) {
      if (num < 10) return units[num];
      if (num < 20) return teens[num - 10];
      if (num < 100)
        return (
          tens[Math.floor(num / 10)] + (num % 10 ? " " + units[num % 10] : "")
        );
      if (num < 1000)
        return (
          units[Math.floor(num / 100)] +
          " Hundred" +
          (num % 100 ? " " + convert(num % 100) : "")
        );
      if (num < 100000)
        return (
          convert(Math.floor(num / 1000)) +
          " Thousand" +
          (num % 1000 ? " " + convert(num % 1000) : "")
        );
      return (
        convert(Math.floor(num / 100000)) +
        " Lakh" +
        (num % 100000 ? " " + convert(num % 100000) : "")
      );
    }

    return convert(num);
  }

  // Update invoice details when a new invoice is selected
  useEffect(() => {
    if (selectedInvoice) {
      const invoiceDetail = monthlyInvoices.find(
        (inv) => inv.id === selectedInvoice
      );
      if (invoiceDetail) {
        setInvoiceDetails({
          ...invoiceDetail,
          dueDate: "2023-05-31", // example due date, adjust as needed
          items: [
            {
              description: "Total Transactions Amount",
              amount: invoiceDetail.amount,
            },
          ],
        });
      }
    } else {
      setInvoiceDetails(null);
    }
  }, [selectedInvoice, monthlyInvoices]);

  // Fetch transactions from API and generate monthly invoices
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/transactions");
        if (response.status === 200) {
          const txData = response.data.transactions;
          setTransactions(txData);
          const grouped = groupTransactionsByMonth(txData);
          const invoices = generateMonthlyInvoices(grouped);
          setMonthlyInvoices(invoices);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleDownloadExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Transactions");
      const headings = [
        "Transaction ID",
        "Type",
        "Amount",
        "Date",
        "Current Balance",
        "Order ID",
        "AWB Number",
        "Status"
      ];
      worksheet.addRow(headings);
      filteredTransactions.forEach((transaction) => {
        worksheet.addRow([
          transaction.transactionId,
          transaction.type.length === 1 && transaction.type[0] === "wallet"
            ? "wallet"
            : transaction.type.filter(type => type !== "wallet").join(" "),
          `${transaction.currency || "$"} ${transaction.amount.toFixed(2)}`,
          new Date(transaction.updatedAt).toLocaleDateString(),
          transaction.balance,
          transaction.orderId || "N/A",
          transaction.awbNumber || "N/A",
          transaction.status
        ]);
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "transactions.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export Excel");
    }
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      const tableColumn = [
        "Transaction ID",
        "Type",
        "Amount",
        "Date",
        "Current Balance",
        "Order ID",
        "AWB Number",
        "Status"
      ];
      const tableRows = filteredTransactions.map((transaction) => [
        transaction.transactionId,
        transaction.type.length === 1 && transaction.type[0] === "wallet"
          ? "wallet"
          : transaction.type.filter(type => type !== "wallet").join(" "),
        `${transaction.currency || "$"} ${transaction.amount.toFixed(2)}`,
        new Date(transaction.updatedAt).toLocaleDateString(),
        transaction.balance,
        transaction.orderId || "N/A",
        transaction.awbNumber || "N/A",
        transaction.status
      ]);
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 25 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 25 },
          5: { cellWidth: 30 },
          6: { cellWidth: 25 },
          7: { cellWidth: 20 },
        },
      });
      doc.save("transactions.pdf");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex justify-between items-center my-4 ">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input max-w-sm border-2 border-gray-400 rounded-lg px-3 py-1"
          />
          <Button
            variant="export"
            size="lg"
            className="h-10"
            onClick={() => setIsExportDialogOpen((prev) => !prev)}
          >
            <span className="text-lg">+ Export </span>
          </Button>
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Export</DialogTitle>
                <DialogDescription>
                  Download Excel or PDF.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-around">
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
        </div>
        <Tabs defaultValue="wallet" className="mx-auto my-3">
          <TabsList className="p-4 gap-6 flex justify-center mx-auto max-w-max bg-white">
            <TabsTrigger
              value="wallet"
              className="data-[state=active]:bg-primary data-[state=active]:text-white bg-gray-200"
            >
              Wallet Transactions
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="data-[state=active]:bg-primary data-[state=active]:text-white bg-gray-200"
            >
              Shipping Transactions
            </TabsTrigger>
            <TabsTrigger
              value="weight"
              className="data-[state=active]:bg-primary data-[state=active]:text-white bg-gray-200"
            >
              Weight Reconciliation
            </TabsTrigger>
            <TabsTrigger
              value="invoice"
              className="data-[state=active]:bg-primary data-[state=active]:text-white bg-gray-200"
            >
              Monthly Invoice
            </TabsTrigger>
          </TabsList>
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
            </div>
          ) : (
            <>
              {/* Wallet Transactions Tab */}
              <TabsContent value="wallet">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead> Transaction Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">
                        Current Balance
                      </TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {walletTransactions.map((transaction) => (
                      <TableRow key={transaction._id}>
                        <TableCell className="font-medium">
                          {transaction.transactionId}
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.type.length === 1 && transaction.type[0] === "wallet"
                            ? "wallet"
                            : transaction.type.filter(type => type !== "wallet").join(" ")}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {transaction.currency || "$"}{" "}
                          {transaction.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {format(
                            new Date(transaction.updatedAt),
                            "dd MMM yyyy"
                          )}
                        </TableCell>
                        {/* <TableCell className="text-center">
                          <Badge
                            className={`${getStatusColor(
                              transaction.status
                            )} font-medium`}
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell> */}
                        <TableCell className="text-center">
                          {transaction.balance}
                        </TableCell>
                        <TableCell className="text-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(transaction)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">View</span>
                                <span className="sm:hidden">Details</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Transaction Details</DialogTitle>
                                <DialogDescription>
                                  Full details of the transaction
                                </DialogDescription>
                              </DialogHeader>
                              {selectedTransaction && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">Order ID:</span>
                                    <span className="col-span-3">
                                      {selectedTransaction.orderId}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">Amount:</span>
                                    <span className="col-span-3">
                                      {selectedTransaction.currency || "$"}{" "}
                                      {selectedTransaction.amount.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">Status:</span>
                                    <span className="col-span-3">
                                      <Badge
                                        className={`${getStatusColor(
                                          selectedTransaction.status
                                        )} font-medium`}
                                      >
                                        {selectedTransaction.status}
                                      </Badge>
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">
                                      Requested:
                                    </span>
                                    <span className="col-span-3">
                                      {new Date(selectedTransaction.requested_at)
                                        .toLocaleString("en-IN")}
                                    </span>
                                  </div>
                                  {selectedTransaction.confirmed_at && (
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <span className="font-bold">
                                        Confirmed:
                                      </span>
                                      <span className="col-span-3">
                                      {new Date(selectedTransaction.confirmed_at)
                                        .toLocaleString("en-IN")}
                                      </span>
                                    </div>
                                  )}
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">
                                      Payment ID:
                                    </span>
                                    <span className="col-span-3">
                                      {selectedTransaction.paymentId}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">User ID:</span>
                                    <span className="col-span-3">
                                      {selectedTransaction.userId}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="shipping">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>AWB</TableHead>
                      <TableHead className="text-center">
                        Current Balance
                      </TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shippingTransactions.map((transaction) => (
                      <TableRow key={transaction._id}>
                        <TableCell className="font-medium">
                          {transaction.transactionId}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {transaction.currency || "$"}{" "}
                          {transaction.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                        {new Date(selectedTransaction?.updatedAt)
                                        .toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="text-center">
                          {transaction.awbNumber || "N/A"}
                        </TableCell>
                        <TableCell className="text-center">
                          {transaction.balance}
                        </TableCell>
                        <TableCell className="text-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(transaction)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">View</span>
                                <span className="sm:hidden">Details</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Transaction Details</DialogTitle>
                                <DialogDescription>
                                  Full details of the transaction
                                </DialogDescription>
                              </DialogHeader>
                              {selectedTransaction && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">Order ID:</span>
                                    <span className="col-span-3">
                                      {selectedTransaction.orderId}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">Amount:</span>
                                    <span className="col-span-3">
                                      {selectedTransaction.currency || "$"}{" "}
                                      {selectedTransaction.amount.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">Status:</span>
                                    <span className="col-span-3">
                                      <Badge
                                        className={`${getStatusColor(
                                          selectedTransaction.status
                                        )} font-medium`}
                                      >
                                        {selectedTransaction.status}
                                      </Badge>
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">
                                      Requested:
                                    </span>
                                    <span className="col-span-3">
                                    {new Date(selectedTransaction.requested_at)
                                        .toLocaleString("en-IN")}
                                    </span>
                                  </div>
                                  {selectedTransaction.confirmed_at && (
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <span className="font-bold">
                                        Confirmed:
                                      </span>
                                      <span className="col-span-3">
                                      {new Date(selectedTransaction.confirmed_at)
                                        .toLocaleString("en-IN")}
                                      </span>
                                    </div>
                                  )}
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">
                                      Payment ID:
                                    </span>
                                    <span className="col-span-3">
                                      {selectedTransaction.paymentId}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">User ID:</span>
                                    <span className="col-span-3">
                                      {selectedTransaction.userId}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* Monthly Invoices Tab */}
              <TabsContent value="invoice">
                <div className="container mx-auto py-10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h1 className="text-3xl font-bold tracking-tight">
                        Monthly Invoices
                      </h1>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <input
                        type="text"
                        placeholder="Search invoices..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input max-w-sm border-2 border-gray-400 rounded-lg px-3 py-1"
                      />
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="select w-[180px] border-2 border-gray-400 rounded-lg px-2"
                      >
                        <option value="all">All Time</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredInvoices.map((invoice) => (
                        <div
                          key={invoice.id}
                          className="card cursor-pointer hover:shadow-md transition-shadow bg-gray-100 rounded-xl px-4 py-3"
                          onClick={() => setSelectedInvoice(invoice.id)}
                        >
                          <div className="card-body">
                            <h3 className="font-semibold mb-2">
                              The invoice for {invoice.month} {invoice.year} is
                              available to download
                            </h3>
                            <p className="text-xl font-bold mb-2">
                              ₹&nbsp;{invoice.amount.toFixed(2)}
                            </p>
                            <p className="text-xs font-semibold text-gray-500 mb-2">
                              Invoice ID: {invoice.id}
                            </p>
                            <div className="flex justify-between">
                              <Button>Download</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {invoiceDetails && (
                      <Dialog
                        open={!!invoiceDetails}
                        onOpenChange={() => setInvoiceDetails(null)}
                      >
                        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl shadow-xl">
                          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <DialogTitle className="text-2xl font-bold text-white">
                                  {`Invoice ${invoiceDetails.id}`}
                                </DialogTitle>
                                <DialogDescription className="text-blue-100 mt-1">
                                  {`${invoiceDetails.month} ${invoiceDetails.year}`}
                                </DialogDescription>
                              </div>
                            </div>
                            <div
                              className={`badge mt-4 inline-flex items-center px-3 py-1 rounded-full ${
                                invoiceDetails.status === "Paid"
                                  ? "bg-green-200 text-green-800"
                                  : invoiceDetails.status === "Pending"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : invoiceDetails.status === "Overdue"
                                  ? "bg-red-200 text-red-800"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              {getStatusIcon(invoiceDetails.status)}
                              {invoiceDetails.status}
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="space-y-6">
                              <div>
                                <p className="text-sm font-medium text-gray-500">
                                  Due Date
                                </p>
                                <p className="mt-1 text-gray-900">
                                  {invoiceDetails.dueDate}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                  Invoice Items
                                </h3>
                                <div className="space-y-3">
                                  {invoiceDetails.items.map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-between items-center py-3 border-b border-gray-100"
                                    >
                                      <p className="font-medium text-gray-900">
                                        {item.description}
                                      </p>
                                      <p className="text-gray-900">
                                        ₹{item.amount.toFixed(2)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-gray-50 -mx-6 px-6 py-4">
                                <div className="flex justify-between items-center">
                                  <p className="text-lg font-semibold text-gray-900">
                                    Total Amount
                                  </p>
                                  <p className="text-xl font-bold text-blue-600">
                                    ₹{invoiceDetails.amount.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="px-6 pb-6">
                            <Button
                              onClick={handleDownloadInvoice}
                              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
                            >
                              <Download className="h-5 w-5 mr-2" />
                              Download Invoice
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
