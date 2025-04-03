"use client";

import { useState } from "react";
import { Package, Loader2, MapPin, Truck, PhoneCall, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/utils/axios";

export default function TrackParcelDialog() {
  // States for the first dialog
  const [isOpen, setIsOpen] = useState(false);
  const [awbNumber, setAwbNumber] = useState("");
  const [shippingPartner, setShippingPartner] = useState("");
  const [loading, setLoading] = useState(false);
  const [isParcelDetailsOpen, setIsParcelDetailsOpen] = useState(false);
  const [track, setTrackingDetails] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/shipping/track-without-login",
        { courier: shippingPartner, awb: awbNumber }
      );
      setTrackingDetails(response.data);
      setIsParcelDetailsOpen(true);
    } catch (error) {
      console.error("Error tracking parcel:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="flex h-10 gap-2 bg-primary text-white"
          >
            <Package className=" h-4 w-4" />
            Track
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] h-[300px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Track Parcel
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Select value={shippingPartner} onValueChange={setShippingPartner}>
              <SelectTrigger>
                <SelectValue placeholder="Select shipping partner" />
              </SelectTrigger>
              <SelectContent>
                {["xpressbees", "ecom", "delhivery"].map((partner) => (
                  <SelectItem key={partner} value={partner}>
                    {partner}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="text"
              value={awbNumber}
              onChange={(e) => setAwbNumber(e.target.value.trim())}
              className="w-full outline-none focus:ring-2 focus:ring-offset-2"
              placeholder="Enter AWB Number"
            />
          </div>

          <DialogFooter className="flex justify-around">
            <Button
              onClick={handleSubmit}
              className="bg-primary text-white mx-auto"
              disabled={loading || !awbNumber.trim() || !shippingPartner}
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : (
                <>
                  <Package className="mr-2 h-4 w-4" />
                  Track Parcel
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isParcelDetailsOpen} onOpenChange={setIsParcelDetailsOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">
              Tracking Details
            </DialogTitle>
          </DialogHeader>
           <h2 className="text-gray-600">AWB: {track?.awb}</h2>
          <p className="text-gray-600">Courier Partner: {track?.courier}</p>
            {track?.trackingDetails.ShipmentData[0].Shipment.Scans.map(
              (scan, index) => (
                  <div className="flex gap-2 items-center">
                    {scan.ScanDetail.Scan === "In Transit" ? (
                      <Truck className="text-blue-500" />
                    ) : scan.ScanDetail.Scan === "Dispatched" ? (
                      <PhoneCall className="text-green-500" />
                    ) : scan.ScanDetail.Scan === "Pending" ? (
                      <Clock className="text-yellow-500" />
                    ) : (
                      <MapPin className="text-gray-500" />
                    )}
                    <div>
                      <p className="font-semibold">
                        {scan.ScanDetail.Scan} - {scan.ScanDetail.Instructions}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(
                          scan.ScanDetail.ScanDateTime
                        ).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Location: {scan.ScanDetail.ScannedLocation}
                      </p>
                    </div>
                  </div>
              )
            )}
          <DialogFooter className="flex justify-around">
            <Button
              onClick={() => setIsParcelDetailsOpen(false)}
              className="w-full bg-red-600 text-white mt-2"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
