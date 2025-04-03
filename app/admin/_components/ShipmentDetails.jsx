import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axiosInstance from '@/utils/axios';

const ShipmentDetails = ({details, isTracking =false, handleBackToList}) => {
  console.log(details)
  const [tracking, setTracking] = useState(null);
  const [order, setOrder] = useState(null);

  const fetchTracking = async () => {
    try {
      const response = await axiosInstance.post(`/shipping/track-with-login`);
      console.log("Shipping details : ",response.data);
      setTracking(response.data);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    }
  };
  const fetchOrder = async () => {
    try {
      const response = await axiosInstance.get('/shipping/userShipments');
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    }
  };

useEffect(()=>{
  if(isTracking){
    fetchTracking();
  }else{
    fetchOrder();
  }
}, [])


  return (
    <div className="space-y-6 mx-5">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">
        {isTracking ? `AWB Number: ${details[0].awbNumber}` :`Order Id: ${details[0].orderId}` }
      </h2>
      <Button variant="outline" onClick={() => handleBackToList()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
      </Button>
    </div>
    {isTracking ? (
      <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Shipping Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          {/* Add all required fields here */}
          <div>
            <dt>Shipment ID</dt>
            <dd>{details[0].SHIPMENT_ID}</dd>
          </div>
          <div>
            <dt>Order ID</dt>
            <dd>{details[0].orderId}</dd>
          </div>
          <div>
            <dt>Shipment Charges</dt>
            <dd>INR {details[0].PRICE_FOR_CUSTOMER}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{details[0].STAUS}</dd>
          </div>
          <div>
            <dt>Shipping Partner</dt>
            <dd>{details[0].PARTNER_Name}</dd>
          </div>
          <div>
            <dt>Label</dt>
            <dd>
              <a href={details[0].label} target="_blank" rel="noopener noreferrer">
                View Label
              </a>
            </dd>
          </div>
          <div>
            <dt>Manifest</dt>
            <dd>
              <a href={details[0].manifest} target="_blank" rel="noopener noreferrer">
                View Manifest
              </a>
            </dd>
          </div>
          <div>
            <dt>Dangerous Goods Shipment</dt>
            <dd>{details[0].dgShipment ? 'Yes' : 'No'}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
    ):(
      <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
          {/* Add all required fields here */}
          <div>
            <dt>Order ID</dt>
            <dd>{details[0].orderId}</dd>
          </div>
          <div>
            <dt>Shipment Charges</dt>
            <dd>INR {details[0].PRICE_FOR_CUSTOMER}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{details[0].STAUS}</dd>
          </div>
          <div>
            <dt>Shipping Partner</dt>
            <dd>{details[0].PARTNER_Name}</dd>
          </div>
          <div>
            <dt>Label</dt>
            <dd>
              <a href={details[0].label} target="_blank" rel="noopener noreferrer">
                View Label
              </a>
            </dd>
          </div>
          <div>
            <dt>Manifest</dt>
            <dd>
              <a href={details[0].manifest} target="_blank" rel="noopener noreferrer">
                View Manifest
              </a>
            </dd>
          </div>
          <div>
            <dt>Dangerous Goods Shipment</dt>
            <dd>{details[0].dgShipment ? 'Yes' : 'No'}</dd>
          </div>
        </dl>
          </CardContent>
        </Card>
    )}
      </div>
  )
}

export default ShipmentDetails

