'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Ship, Loader2, CheckCircle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import OrderForm from './OrderForm'
import OrderSummary from './OrderSummary'
import OrderDetails from './OrderDetails'
import axiosInstance from '@/utils/axios'
import BulkOrder from './BulkOrder'

export default function OrderManagement({setActiveSection}) {
  const [orders, setOrders] = useState([])
  const [isAddingOrder, setIsAddingOrder] = useState(false)
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const { toast } = useToast()

  const handleAddOrder = (values) => {
    const orderWithPrice = {
      ...values,
      price: parseFloat(values.DECLARED_VALUE),
      total_charge: parseFloat(values.total_charge)
    }
    console.log(orderWithPrice)
    setOrders([...orders, orderWithPrice])
    setIsAddingOrder(false)
  }

  const generateOrders = async () => {
    setIsGenerating(true);
    try {
      const response = await axiosInstance.post('/orders/create', { orders }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (response.data.success) {
        const processedOrders = response.data.orders;
        setOrders([]);
        setShowSuccessDialog(true);
      } else {
        throw new Error('Failed to generate orders');
      }
    } catch (error) {
      console.error('Error generating orders:', error);
  
      // Check if the error response includes "Insufficient balance" and handle it specifically
      const errorMessage = error.response?.data?.error || error.message || "An unexpected error occurred.";
      const isInsufficientBalance = errorMessage.includes("Insufficient balance");
  
      toast({
        title: isInsufficientBalance ? "Insufficient Balance" : "Error Generating Orders",
        description: isInsufficientBalance
          ? "Your balance is not sufficient to process these orders. Please add more funds to continue."
          : errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  

  const handleGoToOrders = () => {
    setShowSuccessDialog(false)
    setActiveSection('Orders')// Navigate to the first order
  }

  const getTotalPrice = () => {
    let total =  orders.reduce((total, order) => total + Number(order.DECLARED_VALUE), 0)

    console.log(total)

    return total.toFixed(2);
  }

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center justify-center md:justify-between">
        <h2 className="hidden md:block text-2xl font-bold">Order Management</h2>
        <div className='flex gap-2'>
        <BulkOrder setOrders={setOrders}/>
        </div>
        
      </div>
      {selectedOrderIndex !== null ? (
        <OrderDetails
          order={orders[selectedOrderIndex]}
          index={selectedOrderIndex}
          setSelectedOrderIndex={setSelectedOrderIndex}
        />
      ) : orders.length === 0 && !isAddingOrder ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Ship className="w-16 h-16 text-primary mb-4" aria-hidden="true" />
          <h3 className="text-2xl font-bold mb-2">Start Your First Order</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Create your first order to get started with order management.
          </p>
          <Button onClick={() => setIsAddingOrder(true)} size="lg">
            <Plus className="w-5 h-5 mr-2" aria-hidden="true" /> Create Order
          </Button>
        </div>
      ) : (
        <>
          <OrderSummary orders={orders} setSelectedOrderIndex={setSelectedOrderIndex} />
          {isAddingOrder ? (
            <OrderForm onSubmit={handleAddOrder} isAddingOrder={isAddingOrder} setIsAddingOrder={setIsAddingOrder} />
          ) : (
            <div className="flex flex-col space-y-4">
              <Button onClick={() => setIsAddingOrder(true)}>
                <Plus className="w-4 h-4 mr-2" aria-hidden="true" /> Add New Order
              </Button>
              {orders.length > 0 && (
                <Button onClick={generateOrders} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                      Generating...
                    </>
                  ) : (
                    `Book Orders (Total: ₹${getTotalPrice()})`
                  )}
                </Button>
              )}
            </div>
          )}
        </>
      )}

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">Order Confirmed</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <p className="text-center text-lg mb-6">
            Your order has been successfully booked.
          </p>
          <Button onClick={handleGoToOrders} className="w-full">
            View My Orders
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            variant="ghost"
            onClick={() => setShowSuccessDialog(false)}
            className="absolute top-2 right-2"
          >
            {/* <X className="h-4 w-4" /> */}
            <span className="sr-only">Close</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  )
}