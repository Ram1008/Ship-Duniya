"use client"
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Loader2, Package  } from 'lucide-react';
import axiosInstance from '@/utils/axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import NdrTable from '../_components/NdrTable';
// import ShipmentDetails from './ShipmentDetails';
// import NdrTable from './NdrTable';
 
 const Ndr = () => {
    const [ndr, setNdr] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedShipments, setSelectedShipments] = useState([]);
    const [viewDetails, setViewDetails] = useState(false);
    const [viewTracking, setViewTracking] = useState(false);
   
    const fetchNdrs = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get("/ndr/fetchall");
          setNdr(response.data.groupedOrders);
          console.log("ndr res :", response.data.groupedOrders);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      };
      useEffect(() => {
        fetchNdrs();
      }, []);
 
      const handleBackToList = () => {
        setSelectedShipments([]);
        setViewDetails(false);
        setViewTracking(false);
     };
 
     const renderView = () =>{
      // if(viewDetails){
      //   return(
      //   <ShipmentDetails details = {selectedShipments} handleBackToList={ handleBackToList} />
      //   )
      // }
      // if(viewTracking){
      //   return(
      //     <ShipmentDetails details = {selectedShipments} isTracking={true} handleBackToList={ handleBackToList}/>
      //     )
      // }
      return (<NdrTable
                loading={loading}
                shipments={ndr}
                selectedShipments ={selectedShipments}
                setSelectedShipments={setSelectedShipments}
                setViewTracking= {setViewTracking}
                setViewDetails = {setViewDetails}
                />)
     }
    return (
      <>
        {renderView()}
      </>
   )  
 }
 
 export default Ndr;
 