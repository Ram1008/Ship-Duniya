import React from "react";
import {
  Globe,
  Truck,
  Users,
  PackageCheck,
  ShieldCheck,
  Clock,
  BarChart,
  Leaf,
  Lightbulb,
  Handshake,
  MapPin,
  Award,
  Shield,
} from "lucide-react";
import Footer from "./Footer";
import Image from "next/image";
import TrustedPartner from "./TrustedPartner";
import TrustedTechnicalPartner from "./TrustedTechnicalPartner";

export default function AboutPage() {
  const stats = [
    { icon: Globe, value: "4+", label: "Cities Served" },
    { icon: Truck, value: "10,000+", label: "Successful Deliveries" },
    { icon: Users, value: "10+", label: "Team Members" },
    { icon: PackageCheck, value: "98%", label: "On-Time Delivery" },
  ];

  const values = [
    {
      icon: Clock,
      title: "Reliability",
      description:
        "On-time delivery, every time. We understand that time is money, and we respect your deadlines.",
    },
    {
      icon: ShieldCheck,
      title: "Security",
      description:
        "Your cargo's safety is our priority. Advanced tracking and security measures ensure peace of mind.",
    },
    {
      icon: BarChart,
      title: "Efficiency",
      description:
        "Optimized logistics solutions using cutting-edge technology and data-driven decisions.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description:
        "Committed to reducing our carbon footprint through eco-friendly practices and green initiatives.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Constantly evolving and adopting new technologies to improve our services.",
    },
    {
      icon: Handshake,
      title: "Partnership",
      description:
        "Building lasting relationships through transparency and collaborative solutions.",
    },
  ];

  const locations = [
    {
      city: "Noida",
      country: "India",
      image:
        "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      city: "Delhi",
      country: "India",
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      city: "Gurugraam",
      country: "India",
      image:
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      city: "Faridabad",
      country: "India",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="relative">
      <div className="absolute inset-0 h-[600px]">
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
          alt="Logistics Hub"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
      </div>
      <div className="relative h-full mt-[2.5%]">
        <div className="flex flex-col max-w-7xl justify-center h-full text-white mx-auto px-4 sm:px-6 lg:px-8">
          <Image
            src={"https://storage.googleapis.com/ship-duniya_bucket/Images/shipDuniyaIcon.jpg"}
            width={200}
            height={300}
            alt="ShipDuniya Logo"
            unoptimized
            className="rounded-xl"
          />
          <h1 className="mt-10 text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Delivering Excellence
            <br />
            Across India
          </h1>
          <p className=" text-xl md:text-2xl max-w-2xl leading-relaxed">
            With 10+ years of experience, we're revolutionizing logistics
            through innovation, sustainability, and unwavering dedication to
            customer success.
          </p>
          <div className=" flex gap-4">
            <Award className="w-12 h-12 text-blue-400" />
            <Shield className="w-12 h-12 text-blue-400" />
            <Globe className="w-12 h-12 text-blue-400" />
          </div>
        </div>
        <div className="py-20 mt-[6%] bg-white mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-8 rounded-xl hover:shadow-xl transition-shadow duration-300"
                >
                  <stat.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-16">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <value.icon className="w-12 h-12 text-blue-600 mb-6" />
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <section className="mx-auto px-4 py-6 lg:py-16">
          <h1 className="text-4xl font-bold text-center mb-4 text-dark">
            Our shipping Partners
          </h1>
          <TrustedPartner />
        </section>
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-16">
              Global Presence
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {locations.map((location, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-xl"
                >
                  <img
                    src={location.image}
                    alt={`${location.city} Office`}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-white" />
                        <span className="font-semibold">{location.city}</span>
                      </div>
                      <p className="text-sm opacity-75">{location.country}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <section className="mx-auto px-4 py-6 lg:py-16 lg:px-16">
        <h1 className="text-4xl font-bold text-center mb-4 text-dark">
          Our Technology Partners
        </h1>
        <TrustedTechnicalPartner />
      </section>
    </div>
  );
}
