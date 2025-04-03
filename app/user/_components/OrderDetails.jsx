'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package, User, RotateCcw, Truck, DollarSign } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function OrderDetails({ order, index, setSelectedOrderIndex }) {
  const sections = [
    {
      title: 'Product Details',
      icon: Package,
      fields: ['PRODUCT', 'ITEM_DESCRIPTION', 'DG_SHIPMENT', 'PIECES', 'HEIGHT', 'BREADTH', 'LENGTH', 'VOLUMETRIC_WEIGHT', 'ACTUAL_WEIGHT'],
    },
    {
      title: 'Consignee Details',
      icon: User,
      fields: ['CONSIGNEE', 'CONSIGNEE_ADDRESS1', 'CONSIGNEE_ADDRESS2', 'CONSIGNEE_ADDRESS3', 'DESTINATION_CITY', 'STATE', 'PINCODE', 'TELEPHONE', 'MOBILE'],
    },
    {
      title: 'Return Details',
      icon: RotateCcw,
      fields: ['RETURN_NAME', 'RETURN_MOBILE', 'RETURN_PINCODE', 'RETURN_ADDRESS_LINE1', 'RETURN_ADDRESS_LINE2', 'RETURN_PHONE'],
    },
    {
      title: 'Pickup Details',
      icon: Truck,
      fields: ['PICKUP_NAME', 'PICKUP_PINCODE', 'PICKUP_MOBILE', 'PICKUP_PHONE', 'PICKUP_ADDRESS_LINE1', 'PICKUP_ADDRESS_LINE2'],
    },
    {
      title: 'Value Details',
      icon: DollarSign,
      fields: ['COLLECTABLE_VALUE', 'DECLARED_VALUE'],
    },
  ]

  // Add Bank Details section conditionally
  if (order.PRODUCT === 'COD') {
    sections.push({
      title: 'Bank Details',
      icon: DollarSign,
      fields: [
        'ACCOUNT_HOLDER_NAME',
        'BANK_NAME',
        'ACCOUNT_NUMBER',
        'IFSC_CODE',
        'ACCOUNT_TYPE',
        'GST_NUMBER',
        'PAN_NUMBER',
        'BRANCH_NAME',
      ],
    })
  }

  const formatFieldName = (field) => {
    return field
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ')
  }

  const formatFieldValue = (key, value) => {
    if (value === undefined || value === null || value === '') {
      return 'N/A'
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }
    if (key === 'COLLECTABLE_VALUE' || key === 'DECLARED_VALUE') {
      return `₹${value}`
    }
    return value?.toString()
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Order {index + 1} Details</CardTitle>
        <Button variant="outline" onClick={() => setSelectedOrderIndex(null)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <div key={section.title}>
              <h3 className="flex items-center text-lg font-semibold mb-3">
                <section.icon className="w-5 h-5 mr-2" />
                {section.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <div key={field} className="flex flex-col">
                    <span className="text-sm text-gray-500">{formatFieldName(field)}</span>
                    <span className="font-medium">
                      {order[field] !== undefined && order[field] !== null && order[field] !== ''
                        ? formatFieldValue(field, order[field])
                        : 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
              {sectionIndex < sections.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
