'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, User, MapPin, ChevronRight } from 'lucide-react'

export default function OrderSummary({ orders, setSelectedOrderIndex }) {
  console.log(orders)
  return (
    <div className="space-y-4 w-full max-w-7xl mx-auto">
      {orders.map((order, index) => (
        <Card key={index} className="w-full transition-shadow hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <span className="text-2xl font-bold mr-4">Order #{order.ORDER_ID || index + 1}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()} {/* Replace with actual order date if available */}
                </span>
              </div>
              <Button
                className="w-full md:w-auto"
                onClick={() => setSelectedOrderIndex(index)}
              >
                View Details
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Product</p>
                  <p className="text-sm text-muted-foreground">{order.PRODUCT}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Consignee</p>
                  <p className="text-sm text-muted-foreground">{order.CONSIGNEE}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Destination</p>
                  <p className="text-sm text-muted-foreground">
                    {order.DESTINATION_CITY}, {order.STATE}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-sm text-muted-foreground">
                    {order.DECLARED_VALUE}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}