"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import axiosInstance from "@/utils/axios";
import ShipmentTable from "../_components/ShipmentTable";
import ShipmentDetails from "../_components/ShipmentDetails";
import Pagination from "@/components/custom/Pagination";

const ShipmentsPage = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [viewDetails, setViewDetails] = useState(false);
  const [viewTracking, setViewTracking] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState(null);
  const pageSize = 50;

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/shipping/userShipments");
      setShipments(response.data);
      console.log(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching shipments:", err);
      setError("Failed to fetch shipments. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/users/profile", {
          signal: controller.signal,
        });
        setUserData(response.data);
      } catch (err) {
        if (err.name === "CanceledError") {
          // Request was canceled – no further action needed.
        } else {
          console.error("Error fetching user data:", err);
          setError("Failed to fetch user data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    return () => {
      controller.abort();
    };
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedShipments([]);
    setViewDetails(false);
    setViewTracking(false);
  }, []);

  const paginatedShipments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return shipments.slice(startIndex, startIndex + pageSize);
  }, [shipments, currentPage, pageSize]);

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
      <div className="flex flex-col">
        <div className="flex-grow">
          <ShipmentTable
            userData={userData}
            shipments={paginatedShipments}
            loading={loading}
            selectedShipments={selectedShipments}
            setSelectedShipments={setSelectedShipments}
            setViewTracking={setViewTracking}
            setViewDetails={setViewDetails}
          />
        </div>
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalItems={shipments.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    );
  };

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return <>{renderView()}</>;
};

export default ShipmentsPage;
