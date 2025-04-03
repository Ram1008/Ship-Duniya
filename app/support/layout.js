"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "@/components/custom/Sidebar";
import { getGreeting } from "./utils";
import {
  MenuIcon,
  Ticket,
  User,
  Cross,
  LayoutDashboard,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const navItems = useMemo(
    () => [
      { name: "Dashboard", icon: LayoutDashboard, url: "/support/dashboard" },
      { name: "Tickets", icon: Ticket, url: "/support/tickets" },
      { name: "NDR", icon: Cross, url: "/support/ndrs" },
    ],
    []
  );

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

  return (
    <html lang="en">
      <body className="flex flex-col bg-gray-100">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <div className="bg-white rounded-lg ">
            <Image
              src="https://storage.googleapis.com/ship-duniya_bucket/Images/shipDuniyaBrand.jpg"
              height={180}
              width={180}
              alt="Ship Duniya Logo"
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold flex gap-2">
              {getGreeting()}{" "}
              {loading ? "Loading..." : <span>{userData?.name}</span>}
            </h2>
            <span className="flex text-base text-primary gap-2">
              <Minus className="text-primary" /> Welcome to Ship Duniya
            </span>
            {error && (
              <span className="text-xs font-semibold text-red-500">
                {error}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="h-10 bg-gray-100 hover:bg-gray-300"
              onClick={() => router.push("/support/profile")}
            >
              <User className="h-6 w-6" />
            </Button>
            <button onClick={toggleSidebar} className="block lg:hidden">
              <MenuIcon size={24} />
            </button>
          </div>
        </header>

        <div className="flex overflow-hidden">
          <Sidebar
            sidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            navItems={navItems}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 px-6 py-2">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
