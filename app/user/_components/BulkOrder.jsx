import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Download, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import * as XLSX from "xlsx"
import ExcelJS from 'exceljs'

export default function BulkUploadComponent({ isOpen, setIsOpen, onUpload }) {
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        setFile(selectedFile)
        setError(null)
      } else {
        setFile(null)
        setError("Please upload a valid Excel file (.xlsx)")
      }
    }
  }

  const handleUpload = useCallback(async () => {
    if (!file) {
      setError("Please select a file to upload")
      return
    }
  
    try {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Call the onUpload function with the FormData
      await onUpload(formData);
      
      setSuccess("File uploaded successfully")
      setFile(null)
      setIsOpen(false)
    } catch (err) {
      setError("An error occurred while uploading the file")
      console.error(err)
    }
  }, [file, onUpload, setIsOpen])
  

  const handleDownloadSchema = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Schema')

    const headings = [
      'consignee', 'consigneeAddress1', 'consigneeAddress2', 'orderType', 'pincode',
      'mobile', 'invoiceNumber', 'telephone', 'city', 'state', 'length', 'breadth',
      'height', 'collectableValue', 'declaredValue', 'itemDescription', 'dgShipment',
      'quantity', 'volumetricWeight', 'actualWeight',
    ]
    const example1 = ['Dev', 'sector-10', '', 'prepaid', '201301', '1234567890', 'inv-321', '', 'noida', 'Uttar Pradesh', '2', '2', '2', '0', '200', 'this is glass bottle', '', '10', '8', '10']
    const example2 = ['Dev', 'sector-10', '', 'cod', '201301', '1234567890', 'inv-321', '', 'noida', 'Uttar Pradesh', '2', '2', '2', '200', '200', 'this is glass bottle', 'true', '10', '8', '10']
    worksheet.addRow(headings)
    worksheet.addRow(example1)
    worksheet.addRow(example2)

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
      cell.alignment = { horizontal: 'center' }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE599' } }
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bulk_upload_schema.xlsx"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bulk Upload</DialogTitle>
          <DialogDescription>
            Upload your Excel file for bulk data import or download the required schema.
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
            <Alert variant="default" className="border-green-500 text-green-700">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={handleDownloadSchema} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Schema
            </Button>
            <Button onClick={handleUpload} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  )
}
