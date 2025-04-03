"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { chargeSheet } from "./constants";

import axiosInstance from "@/utils/axios";
import { Loader2 } from "lucide-react";

export default function RateCalculator() {
  const [originPincode, setOriginPincode] = useState("");
  const [destinationPincode, setDestinationPincode] = useState("");
  const [productType, setProductType] = useState("prepaid");
  const [chargeableWeight, setChargeableWeight] = useState("");
  const [codAmount, setCodAmount] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedType, setExpandedType] = useState(null);
  const [partnerType, setPartnerType] = useState("");
  const [customerType, setCustomerType] = useState("bronze");

  const filteredChargeSheet = customerType
    ? chargeSheet.filter((category) => category.customerType === customerType)
    : chargeSheet;

  const toggleExpand = (customerType) => {
    setExpandedType(expandedType === customerType ? null : customerType);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const body = {
      chargeableWeight,
      productType,
      originPincode,
      destinationPincode,
      carrierName: partnerType, // Sending selected partner type to API
      ...(productType === "cod" && { "CODAmount":codAmount }), // Include codAmount only when product type is cod
    };

    try {
      const response = await axiosInstance.post(
        "/calculate/calculate-charges",
        body
      );

      console.log("API Response:", response.data);

      // Updated to use "charges" from response
      const filteredResults = response.data.charges.filter(
        (item) => item.carrierName === partnerType
      );

      setResult(filteredResults);
    } catch (err) {
      setError(
        err.response
          ? err.response.data
          : "An error occurred while fetching rates."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side (Rate Calculator) */}
      <div className="w-[70%] px-6 py-4">
        <Card>
          <CardHeader>
            <CardTitle>Ship Dart Rate Calculator</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originPincode">Origin Pincode</Label>
                  <Input
                    id="originPincode"
                    type="text"
                    value={originPincode}
                    onChange={(e) => setOriginPincode(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destinationPincode">
                    Destination Pincode
                  </Label>
                  <Input
                    id="destinationPincode"
                    type="text"
                    value={destinationPincode}
                    onChange={(e) => setDestinationPincode(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productType">Product Type</Label>
                  <Select value={productType} onValueChange={setProductType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product type " />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PREPAID">Prepaid</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                      <SelectItem value="rev">Reverse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chargeableWeight">
                    Chargeable Weight (grams)
                  </Label>
                  <Input
                    id="chargeableWeight"
                    type="number"
                    value={chargeableWeight}
                    onChange={(e) => setChargeableWeight(e.target.value)}
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partnerType">Partner Type</Label>
                  <Select value={partnerType} onValueChange={setPartnerType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select partner type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Delhivery">Delhivery</SelectItem>
                      <SelectItem value="Ecom Express">Ecom Express</SelectItem>
                      <SelectItem value="Xpressbees">Xpressbees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* COD Amount - Show Only When Product Type is "cod" */}
                {productType === "cod" && (
                  <div className="space-y-2">
                    <Label htmlFor="codAmount">COD Amount (optional)</Label>
                    <Input
                      id="codAmount"
                      type="number"
                      value={codAmount}
                      onChange={(e) => setCodAmount(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  "Calculate Rate"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result.length > 0  && <div className="space-y-6 mt-4">
          <Card
            className="w-[100%] border border-gray-300 shadow-lg rounded-lg"
          >
            <CardHeader className="bg-blue-600 text-white p-4 rounded-t-lg">
              <CardTitle className="text-lg font-semibold">
                {result?.[0]?.carrierName}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <table className="w-full border-collapse border-2 border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-gray-200 font-bold">
                    <th className="border p-2">Service</th>
                    <th className="border p-2">Freight Charge</th>
                    <th className="border p-2">COD Charge</th>
                    <th className="border p-2">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {result.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="border p-2">{item?.carrierName + " " +item?.serviceType}</td>
                        <td className="border p-2">{item?.freightCharge + item?.otherCharges}</td>
                        <td className="border p-2">{item?.codCharge}</td>
                        <td className="border p-2">₹{item?.totalPrice}</td>
                      </tr>
                    );
                  }
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>}
      </div>

      {/* Right Side (Rate Sheet) */}
      <div className="w-[50%] h-screen py-4 overflow-y-auto custom-scrollbar">
        <div className="divide-y divide-gray-200">
          {filteredChargeSheet.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="w-full rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold border-b-2">
                  <h2 className="text-xl font-bold text-gray-800">
                    Rate Sheet
                  </h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {category.deliveryPartners.map((partner, partnerIndex) => (
                  <div key={partnerIndex} className="mb-4 px-2 py-4 rounded-lg">
                    <CardDescription className="font-semibold text-black text-xl">
                      {partner.carrierName}
                    </CardDescription>
                    <p>
                      COD Charges: ₹{partner.codCharges} | COD:{" "}
                      {partner.codPercentage}
                    </p>
                    <div className="overflow-x-auto custom-horizontal-scroll">
                      <Table className="min-w-full mt-2">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-24">Type</TableHead>
                            <TableHead className="text-center">
                              Within City
                            </TableHead>
                            <TableHead className="text-center">
                              Within State
                            </TableHead>
                            <TableHead className="text-center">
                              Metro to Metro
                            </TableHead>
                            <TableHead className="text-center">
                              NE, J&K, KL, AN
                            </TableHead>
                            <TableHead className="text-center">
                              Regional
                            </TableHead>
                            <TableHead className="text-center">India</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">
                              Forward
                            </TableCell>
                            <TableCell>₹{partner.fwd?.withinCity}</TableCell>
                            <TableCell>₹{partner.fwd?.withinState}</TableCell>
                            <TableCell>₹{partner.fwd?.metroToMetro}</TableCell>
                            <TableCell>₹{partner.fwd?.neJkKlAn}</TableCell>
                            <TableCell>₹{partner.fwd?.Regional}</TableCell>
                            <TableCell>₹{partner.fwd?.india}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">RTO</TableCell>
                            <TableCell>₹{partner.rto?.withinCity}</TableCell>
                            <TableCell>₹{partner.rto?.withinState}</TableCell>
                            <TableCell>₹{partner.rto?.metroToMetro}</TableCell>
                            <TableCell>₹{partner.rto?.neJkKlAn}</TableCell>
                            <TableCell>₹{partner.rto?.Regional}</TableCell>
                            <TableCell>₹{partner.rto?.india}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              Additional Weight
                            </TableCell>
                            <TableCell>₹{partner.addWt?.withinCity}</TableCell>
                            <TableCell>₹{partner.addWt?.withinState}</TableCell>
                            <TableCell>
                              ₹{partner.addWt?.metroToMetro}
                            </TableCell>
                            <TableCell>₹{partner.addWt?.neJkKlAn}</TableCell>
                            <TableCell>₹{partner.addWt?.Regional}</TableCell>
                            <TableCell>₹{partner.addWt?.india}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
