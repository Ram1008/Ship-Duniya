"use client";

import Image from 'next/image'
import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Package } from 'lucide-react';
import Link from "next/link";

const Header = () => {
    const NavItems = ({ currentPage, setPage, closeSheet }) => (
        <ul className="flex gap-4 max-md:flex-col flex-row max-md:space-y-4">
          {[
            { label: "Home", page: "home" },
            { label: "About", page: "about" },
            { label: "Contact", page: "contact" },
          ].map((item) => (
            <li key={item.page}>
              <button
                onClick={() => {
                  setPage(item.page);
                  closeSheet();
                }}
                className={
                  currentPage === item.page
                    ? "relative bg-black/80 text-white  rounded-lg py-1 px-3 after:content-[''] after:block after:w-0 after:h-[2px]"
                    : "relative text-black/80 hover:bg-black/80 hover:text-white transition duration-300 rounded-lg py-1 px-3 "
                }
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      );
  return (
    <header className="bg-secondary py-4 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto flex justify-between items-center relative">
          <button
            onClick={() => setCurrentPage("home")}
            className="text-3xl  font-bold flex gap-2"
          >
            <Image
              src="https://storage.googleapis.com/ship-duniya_bucket/Images/logo%201.jpg"
              alt="Ship Duniya"
              className="absolute rounded-xl z-50"
              height={580}
              width={200}
              unoptimized
            />
          </button>
          <nav className="hidden md:block">
            <NavItems
              currentPage={currentPage}
              setPage={setCurrentPage}
              closeSheet={() => document.body.click()}
            />
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
                <NavItems
                  setPage={setCurrentPage}
                  closeSheet={() => document.body.click()}
                />
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
  )
}

export default Header
