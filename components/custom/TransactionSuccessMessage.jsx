'use client'
import { CheckCircle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function TransactionSuccessMessage() {
  return (
    <Card className="w-full max-w-md mx-auto border-none shadow-none">
      <CardHeader className="relative">
        <div className="flex items-center space-x-4">
          <CheckCircle className="h-10 w-10 text-green-500" />
          <CardTitle className="text-2xl font-semibold text-green-700">Transaction Successful</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Your transaction has been processed successfully. Thank you for your payment.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Your wallet will be updated soon. This may take a few moments to reflect in your account.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => console.log("View transaction details")}>
          View Transaction Details
        </Button>
      </CardFooter>
    </Card>
  )
}