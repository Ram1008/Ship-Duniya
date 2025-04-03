"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

const TrustedPartner = () => {
  const partners = [
    { name: "https://storage.googleapis.com/ship-duniya_bucket/Images/xpressbeesLogo.jpeg" },
    { name: "https://storage.googleapis.com/ship-duniya_bucket/Images/ecomexpressLogo.jpeg" },
    { name: "https://storage.googleapis.com/ship-duniya_bucket/Images/delhiveryLogo.jpeg" },
    { name: "https://storage.googleapis.com/ship-duniya_bucket/Images/ecartLogo.jpeg" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % partners.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center h-full px-4">
      
      <div className="flex flex-wrap justify-center gap-6 items-center w-full">
        {partners.map((partner, index) => (
          <div
            key={index}
            className={`p-2 md:p-4 transition-all duration-500 ${
              activeIndex === index
                ? " scale-125 text-white"
                : "opacity-70 text-gray-300"
            }`}
          >
            <Image
            src={partner.name}
            width={200}
            height={200}
            unoptimized/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustedPartner;
