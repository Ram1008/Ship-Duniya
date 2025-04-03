"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Clock,
  Download,
  MapPin,
  Menu,
  Package,
  PhoneCall,
  Truck,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/utils/axios"; // Assuming axiosInstance is defined in utils
import Footer from "@/components/home/Footer";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import HomePage from "@/components/home/HomePage";
import AboutPage from "@/components/home/AboutPage";

export default function LandingPage() {
  const [track, setTrack] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isParcelDetailsOpen, setIsParcelDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shippingPartner, setShippingPartner] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const navItems = useMemo(
    () => [
      { name: "Home", url: "/" },
      { name: "About", url: "/about" },
      { name: "Contact us", url: "/contact" },
    ],
    []
  );

  const activeTab = navItems.find((item) =>
    pathname.startsWith(item.url)
  )?.name;

  const handleTrackParcel = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/shipping/track-without-login",
        { courier: shippingPartner, awb: trackingNumber }
      );
      console.log("API Response:", response.data);
      setTrack(response.data);
      setIsParcelDetailsOpen(true);
    } catch (error) {
      console.error("Error tracking parcel:", error);
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error Message:", error.message);
      }
    } finally {
      setLoading(false);
      setIsTracking(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-secondary py-4 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto flex justify-between items-center relative">
          <button
            onClick={() => router.push("/")}
            className="text-3xl  font-bold flex gap-2"
          >
            {/* <Image
              src="EraOfShipping.jpg"
              alt="Ship Duniya"
              className=""
              height={300}
              width={150}
              unoptimized
            /> */}
          </button>
          <nav className="hidden md:block ml-[10%]">
            <ul className="flex gap-4 max-md:flex-col flex-row max-md:space-y-4">
              {navItems.map((item) => {
                console.log("item name:", item.name);
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => router.push(item.url)}
                      className={`relative rounded-lg py-1 px-3 transition duration-300 ${
                        pathname === item.url && item.url === "/about"
                          ? "bg-black/80 text-white after:content-[''] after:block after:w-0 after:h-[2px]"
                          : "text-black/80 hover:bg-black/80 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" color="black" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col h-full py-6">
                <ul>
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <button
                        onClick={() => router.push(item.url)}
                        className={
                          activeTab === item.name
                            ? "relative bg-black/80 text-white rounded-lg py-1 px-3 after:content-[''] after:block after:w-0 after:h-[2px]"
                            : "relative text-black/80 hover:bg-black/80 hover:text-white transition duration-300 rounded-lg py-1 px-3"
                        }
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-col items-center gap-3">
                  <Link href="/track">
                    <Button className="flex items-center gap-2 w-60 bg-blue-600 hover:bg-blue-700 transition">
                      <Package />
                      <span>Track</span>
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button className="w-60 bg-primary text-white border hover:bg-primary-dark transition">
                      Sign In
                    </Button>
                  </Link>
                  <Button className="w-60 bg-primary text-white border border-black hover:bg-primary-dark transition">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="hidden md:flex space-x-2">
            <Button
              className="flex gap-2 bg-primary text-white"
              onClick={() => setIsTracking(true)}
            >
              <Package className=" h-4 w-4" />
              Track
            </Button>
            <Link href="/login">
              <Button variant="secondary">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button variant="secondary">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <AboutPage />
      <Footer />
      {/* First Dialog: Track Parcel */}
      <Dialog open={isTracking} onOpenChange={setIsTracking}>
        <DialogContent className="sm:max-w-[425px] h-[300px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Track Parcel
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Select
              value={shippingPartner}
              onValueChange={(value) => setShippingPartner(value)}
            >
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
              label="Enter AWB Number"
              type="text"
              placeholder="Enter AWB Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value.trim())}
              className="w-full outline-none focus:ring-2 focus:ring-offset-2"
            />
          </div>
          <DialogFooter className="flex justify-around">
            <Button
              onClick={handleTrackParcel}
              className="bg-primary text-white mx-auto"
              size="lg"
            >
              <Package className="mr-2 h-4 w-4" />
              Track Parcel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Second Dialog: Parcel Details */}
      <Dialog open={isParcelDetailsOpen} onOpenChange={setIsParcelDetailsOpen}>
        {console.log(track)}
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
                    {new Date(scan.ScanDetail.ScanDateTime).toLocaleString()}
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
    </div>
  );
}
