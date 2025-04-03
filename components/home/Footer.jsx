"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Footer = () => {
  const router = useRouter();

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || fileUrl.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reference files using their absolute paths from the public folder
  const termsFile = "/tnc_ShipDuniya.docx";
  const privacyFile = "/pp_ShipDuniya.docx";

  return (
    <footer className="bg-blue-50 py-8 h-[300px]">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-6 px-6 py-8">
        <div className="flex justify-center md:justify-start">
          <Image
            src="https://storage.googleapis.com/ship-duniya_bucket/Images/shipDuniyaBrand.jpg"
            alt="ShipDuniya Logo"
            height={400}
            width={400}
            className="object-contain rounded-lg"
            unoptimized
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="flex space-x-6 mb-4 font-semibold text-dark ">
          <button
              onClick={() => router.push("/")}
              className=" transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => router.push("/about")}
              className=" transition-colors"
            >
              About Us
            </button>
            <button
              onClick={() => router.push("/contact")}
              className="transition-colors"
            >
              Contact
            </button>
          </div>
          <div className="flex flex-col text-center text-sm border-t border-gray-700 pt-4">
            <div className="flex flex-col space-y-1">
              <button
                onClick={() =>
                  router.push("/terms")
                }
                className=" transition-colors"
              >
                Terms &amp; Conditions
              </button>
              <button
                onClick={() =>
                  router.push("/privacy-policy")
                }
                className=" transition-colors"
              >
                Privacy Policy
              </button>
            </div>
            <p className="mt-2 text-gray-400">All rights reserved.</p>
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} ShipDuniya
            </p>
          </div>
        </div>
        <div className="flex justify-center md:justify-end space-x-4">
          <a
            href="#"
            aria-label="Facebook"
            className="transition-colors"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="transition-colors"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="text-white hover:text-gray-400 transition-colors"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="text-white hover:text-gray-400 transition-colors"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
