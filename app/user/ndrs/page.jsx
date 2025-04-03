"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/utils/axios";
import NdrTable from "../_components/NdrTable";
import ShipmentDetails from "../_components/ShipmentDetails";

const NdrPage = () => {
  const [ndrData, setNdrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [viewDetails, setViewDetails] = useState(false);
  const [viewTracking, setViewTracking] = useState(false);

  const fetchNdrs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/ndr/user/fetchndr");
      setNdrData(response.data.data);
    } catch (err) {
      console.error("Error fetching NDRs:", err);
      setError("Failed to fetch NDR data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNdrs();
  }, [fetchNdrs]);

  const handleBackToList = useCallback(() => {
    setSelectedShipments([]);
    setViewDetails(false);
    setViewTracking(false);
  }, []);

  const renderView = () => {
    if (viewDetails || viewTracking) {
      return (
        <ShipmentDetails
          details={selectedShipments}
          isTracking={viewTracking}
          handleBackToList={handleBackToList}
        />
      );
    }
    return (
      <NdrTable
        loading={loading}
        shipments={ndrData}
        selectedShipments={selectedShipments}
        setSelectedShipments={setSelectedShipments}
        setViewTracking={setViewTracking}
        setViewDetails={setViewDetails}
      />
    );
  };

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return <>{renderView()}</>;
};

export default NdrPage;
