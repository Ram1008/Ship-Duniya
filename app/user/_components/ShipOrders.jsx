import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/utils/axios";
import { Input } from "@/components/ui/input";

const ShipOrders = ({
  setIsShipping,
  selectedOrder,
  setSelectedOrder,
  userType,
  handleBookShipment
}) => {
  const [shippingInfo, setShippingInfo] = useState({
    pickUp: "",
    rto: "",
    partner: "",
  });
  const [loading, setLoading] = useState(false);
  const [shippingPartners, setShippingPartners] = useState([]);
  const [wareHouses, setWareHouses] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const { toast } = useToast();

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/warehouse");
      setWareHouses(response.data.warehouses);
    } catch (error) {
      toast({
        title: "Failed to fetch warehouses! Please reload!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/calculate/calculate-shipping-charges",
        {
          orderIds: selectedOrder,
          pickUpWareHouse: shippingInfo.pickUp,
          returnWarehouse: shippingInfo.rto,
          carrierName: shippingInfo.partner,
        }
      );
      setShippingPartners(response.data.charges);
    } catch (error) {
      toast({
        title: "Failed to fetch shipping partners data! Please reload!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      shippingInfo.pickUp !== "" &&
      shippingInfo.rto !== "" &&
      shippingInfo.partner !== ""
    ) {
      fetchPartners();
    }
  }, [shippingInfo]);

  const bookShipment = async () => {
    handleBookShipment(selectedPartner, shippingInfo, selectedOrder);
  };

  const goBack = () => {
    setSelectedOrder([]);
    setIsShipping(false);
  };

  // Helper to determine if a partner is selected using a composite check
  const isPartnerSelected = (partner) => {
    return (
      selectedPartner &&
      selectedPartner.carrierName === partner.carrierName &&
      selectedPartner.serviceType === partner.serviceType &&
      selectedPartner.totalPrice === partner.totalPrice
    );
  };

  const isShipmentDisabled =
    !shippingInfo.pickUp || !shippingInfo.rto || !selectedPartner;

  return (
    <Card className="p-4 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Book Shipment</CardTitle>
          <Button
            variant="outline"
            onClick={goBack}
            className="flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between gap-6 w-full">
          {/* Pickup Warehouse */}
          <Select
            value={shippingInfo.pickUp}
            onValueChange={(value) =>
              setShippingInfo({ ...shippingInfo, pickUp: value })
            }
            className="w-[30%]"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Pickup Warehouse" />
            </SelectTrigger>
            <SelectContent>
              {wareHouses.map((w) => (
                <SelectItem key={w._id} value={w._id}>
                  {w.name} - {w.address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Return Warehouse */}
          <Select
            value={shippingInfo.rto}
            onValueChange={(value) =>
              setShippingInfo({ ...shippingInfo, rto: value })
            }
            className="w-[30%]"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Return Warehouse" />
            </SelectTrigger>
            <SelectContent>
              {wareHouses.map((w) => (
                <SelectItem key={w._id} value={w._id}>
                  {w.name} - {w.address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Partner Type */}
          <Select
            value={shippingInfo.partner}
            onValueChange={(value) =>
              setShippingInfo({ ...shippingInfo, partner: value })
            }
            className="w-[30%]"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Partner Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ECOM">Ecom Express</SelectItem>
              <SelectItem value="Delhivery">Delhivery</SelectItem>
              <SelectItem value="XPRESSBEES">Xpressbees</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Shipping Partners Selection */}
        <div className="grid grid-cols-3 gap-4">
          {shippingPartners.map((partner) => {
            // Create a composite key from multiple fields
            const compositeKey = `${partner.carrierName}-${partner.serviceType}-${partner.totalPrice}`;
            const selected = isPartnerSelected(partner);
            return (
              <Card
                key={compositeKey}
                className={`cursor-pointer border rounded-lg transition-all ${
                  selected ? "border-blue-500 bg-blue-50 shadow-lg" : "border-gray-300 hover:border-blue-300"
                }`}
                onClick={() => setSelectedPartner(partner)}
              >
                <div className="flex items-center p-4">
                  <Input
                    type="radio"
                    name="partner"
                    checked={selected}
                    onChange={() => setSelectedPartner(partner)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-semibold">{partner.carrierName}</p>
                    <p className="text-sm text-gray-600">{partner.serviceType}</p>
                    <p className="text-sm text-gray-600">₹{partner.totalPrice}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Book Shipment Button */}
        <Button
          onClick={bookShipment}
          disabled={isShipmentDisabled}
          className="w-full"
        >
          {loading ? "Processing..." : "Book Shipment"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShipOrders;
