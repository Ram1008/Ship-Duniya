"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

const TrustedTechnicalPartner = () => {
  const TechnicalPartners = [
    { name: "https://storage.googleapis.com/ship-duniya_bucket/Images/yatikenLogo.png" },
    { name: "https://storage.googleapis.com/ship-duniya_bucket/Images/shopifyLogo.jpeg" },
    { name: "https://storage.googleapis.com/ship-duniya_bucket/Images/woocommerseLogo.jpeg" },
    { name: "https://storage.googleapis.com/ship-duniya_bucket/Images/amazonLogo.jpeg" },
    { name: "https://storage.googleapis.com/ship-duniya_bucket/Images/bigcommerseLogo.jpeg" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % TechnicalPartners.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center h-full px-4">
      <div className="flex flex-wrap justify-center gap-6 items-center w-full">
        {TechnicalPartners.map((partner, index) => (
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
            height={200}
            width={200}
            unoptimized/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustedTechnicalPartner;
