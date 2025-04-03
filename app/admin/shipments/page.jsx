"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axios";
import ShipmentTable from "../_components/ShipmentTable";
import ShipmentDetails from "../_components/ShipmentDetails";


const Parcel = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [viewDetails, setViewDetails] = useState(false);
  const [viewTracking, setViewTracking] = useState(false);

  
  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/admin/all-shipments');
      console.log(response.data);
      setShipments(response.data);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchShipments();
  }, []);

  const handleBackToList = () => {
    setSelectedShipments([]);
    setViewDetails(false);
    setViewTracking(false);
 };
 const renderView = () =>{
  if(viewDetails){
    return(
    <ShipmentDetails details = {selectedShipments} handleBackToList={ handleBackToList} />
    )
  }
  if(viewTracking){
    return(
      <ShipmentDetails details = {selectedShipments} isTracking={true} handleBackToList={ handleBackToList}/>
      )
  }
  return (<ShipmentTable 
            shipments={shipments} 
            loading={loading} 
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
  );

}
export default Parcel;