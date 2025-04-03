"use client";
import { Button } from "@/components/ui/button";
import {
  Star,
  ArrowRight,
  Truck,
  ShieldCheck,
  Headset,
  MoveRight,
  Stars,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TrustedPartner from "./TrustedPartner";
import TrustedTechnicalPartner from "./TrustedTechnicalPartner";

 function HomePage() {
  const router = useRouter();
  const navItems = [
    {
      name: "Transparent Pricing",
      icon: Truck,
      description:
        "Get cost-effective shipping with transparent pricing and no hidden fees. Save more on every delivery while ensuring reliability.",
    },
    {
      name: "Security for package",
      icon: ShieldCheck,
      description:
        "Enjoy hassle-free pickups and dedicated customer support. Our team is just a call away to assist you with your shipping needs.",
    },
    {
      name: "Customer service 24/7",
      icon: Headset,
      description:
        "Speed up your deliveries with our same-day dispatch service. Ship your parcels quickly and ensure they reach their destination on time.",
    },
  ];
  const reviews = [
    {
      name: "Vinayak Mehta",
      image:"https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
      role: "Customer",
      feedback:
        "ShipDuniya provides excellent delivery services! My package arrived on time and in perfect condition. Highly recommend!",
    },
    {
      name: "Hemant Singh",
      image:"https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
      role: "Customer",
      feedback:
        "Fast and reliable! The tracking updates kept me informed, and the delivery was seamless. Great service!",
    },
    {
      name: "Vivek Yadav",
      image:"https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
      role: "Customer",
      feedback:
        "Outstanding customer support and on-time delivery. I’ve used ShipDuniya multiple times and have never been disappointed!",
    },
  ];

  const services = [
    {
      title: "Courier (Air & Surface)",
      description:
        "Fast and reliable courier services through both air and surface transport, ensuring timely delivery.",
      image: "https://storage.googleapis.com/ship-duniya_bucket/Images/IMG%201%202.jpg", 
    },
    {
      title: "Cargo Shipping",
      description:
        "Efficient cargo shipping solutions for businesses, covering domestic and international shipments.",
      image: "https://storage.googleapis.com/ship-duniya_bucket/Images/IMG%202%202.jpg", 
    },
    {
      title: "Reverse Shipping",
      description:
        "Hassle-free reverse logistics to handle product returns and replacements efficiently.",
      image: "https://storage.googleapis.com/ship-duniya_bucket/Images/IMG%203%202.jpg", 
    },
  ];

  return (
    <div className=" text-foreground min-h-screen">
      {/* Hero Section */}
      <section className=" mx-auto px-4 md:px-10 pb-10  lg:px-16 flex flex-col md:flex-row">
        <div className="md:w-1/2 space-y-5 ">
        <Image
              src="https://storage.googleapis.com/ship-duniya_bucket/Images/shipDuniyaBrand.jpg"
              alt="Ship Duniya"
              className=" "
              height={500}
              width={500}
              unoptimized
            />
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
            {/* <span className="text-primary">Ship Duniya,</span> */}
            <br className="sm:hidden block" />
            Your Reliable Logistics Partner
          </h1>
          <p className="text-muted pr-16">
            Ship Duniya is a logistics aggregator offering seamless domestic
            (PAN India) and international shipping. We ensure easy pickups,
            on-time delivery (within TAT), and reverse pickups with trusted
            vendors like Xpressbees, Delhivery, Ecom Express, and Blue Dart.
          </p>
          <Button
            className="flex gap-3 rounded-lg bg-primary text-white"
            size="lg"
            onClick={() => router.push("/signup")}
          >
            <span>Get Started</span>
            <MoveRight />
          </Button>
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex justify-center items-center w-10 h-10 bg-muted rounded-full border-2 border-background"
                >
                  <Stars className="w-6 h-6" color="white" />
                </div>
              ))}
            </div>
            <span className="font-semibold">
              2500+ <span className="text-muted">Happy Customers</span>
            </span>
          </div>
        </div>
        <div className="md:w-1/2 w-full mt-8 md:mt-0 flex justify-end py-16">
          <Image
            src="https://storage.googleapis.com/ship-duniya_bucket/Images/delivery.jpeg"
            alt="Courier"
            width={500}
            height={400}
            className="rounded-lg w-full"
            unoptimized
          />
        </div>
      </section>

      <section className=" mx-auto px-4 py-16 lg:py-24 lg:px-16">
        <h2 className="text-3xl font-bold text-center mb-2 lg:text-5xl">
          Why Choose Ship Duniya?
        </h2>
        <p className="text-muted text-center mb-12">
          Experience reliable shipping with our affordable pricing, on-call
          pickup, same-day dispatch, and dedicated online & physical customer
          support.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {navItems.map((title, index) => (
            <div key={index} className="bg-white p-6 rounded-lg space-y-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  index === 0
                    ? "bg-blue-500"
                    : index === 1
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
              >
                <title.icon className="w-6 h-6" color="white" />
              </div>
              <h3 className="text-xl font-semibold">{title.name}</h3>
              <p className="text-muted">{title.description}</p>
              <span
                onClick={() => router.push("/about")}
                className="text-blue-500 flex items-center"
              >
                Learn More <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Shipdart Delivery Service */}
      <section className=" bg-blue-50 mx-auto px-4 py-16 lg:py-24 lg:px-16 flex flex-col md:flex-row items-center ">
        <div className="w-full md:w-1/2 mb-8 md:mb-0 flex justify-center">
          <Image
            src="https://images.pexels.com/photos/4604668/pexels-photo-4604668.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Delivery"
            width={500}
            height={300}
            className="rounded-lg w-full h-[500px] object-cover"
            unoptimized
          />
        </div>
        <div className="md:w-1/2 md:pl-12 space-y-6">
          <h2 className="text-3xl font-bold lg:text-5xl">
            Ship Duniya Delivery service
            <br />
            at your doorstep.
          </h2>
          <p className="mt-4 text-gray-600">
            Experience hassle-free shipping with ShipDuniya! We ensure safe,
            timely, and affordable deliveries right at your doorstep. Whether
            it’s a small package or bulk shipment, our trusted logistics network
            handles it all with precision.
          </p>
          <p className="mt-2 text-gray-600">
            Our dedicated team ensures that your parcels are securely packed,
            swiftly transported, and delivered on time. With real-time tracking
            and reliable customer support, we make shipping stress-free for you!
          </p>
          <Button
            onClick={() => router.push("/signup")}
            className="text-white bg-primary"
            size="lg"
          >
            Learn More
          </Button>
        </div>
      </section>

      {/* Our Delivery Process */}
      <section className=" mx-auto px-4 py-16 lg:py-24 lg:px-16 ">
        <div className="flex flex-col md:flex-row md:items-center ">
          <div className="md:w-1/2 space-y-6 mb-8 md:mb-0 md:pr-20">
            <h2 className="text-3xl font-bold lg:text-5xl">
              Our Delivery Process
            </h2>
            <p className="text-muted">
              We ensure a seamless and efficient delivery process, keeping your
              parcels safe from pickup to doorstep.
            </p>
            {[
              {
                name: "Booking",
                description:
                  "Place your order effortlessly through our website or app. Enter your details, select the delivery type, and confirm your booking.",
              },
              {
                name: "Packing",
                description:
                  "Our team ensures secure packaging to protect your items during transit. We handle everything with utmost care.",
              },
              {
                name: "Transportation",
                description:
                  "Your package is transported using our trusted logistics network, ensuring timely and safe delivery to the destination.",
              },
              {
                name: "Delivery",
                description:
                  "Finally, your package arrives at your doorstep, delivered with care by our dedicated team. Track your shipment in real-time.",
              },
            ].map((step, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div
                  className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-white ${
                    [
                      "bg-blue-500",
                      "bg-pink-500",
                      "bg-yellow-500",
                      "bg-green-500",
                    ][index]
                  }`}
                >
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold">{step.name}</h3>
                  <p className="text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src="https://images.pexels.com/photos/4393532/pexels-photo-4393532.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Delivery Process"
              width={500}
              height={500}
              className="rounded-lg w-full object-cover h-[500px]"
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="bg-blue-50 mx-auto px-4 py-16 lg:py-24 lg:px-16">
        <h2 className="text-3xl font-bold text-center mb-12 lg:text-5xl">
          Our Services
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden"
            >
              <Image
                src={service.image}
                alt={service.title}
                width={400}
                height={200}
                className="w-full"
                unoptimized
              />
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="text-muted">{service.description}</p>
                <span
                 onClick={() => router.push("/signup")}
                  className="text-blue-500 flex items-center cursor-pointer"
                >
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="  mx-auto px-4 py-6 lg:py-16 lg:px-16">
        <h1 className="text-4xl font-bold text-center mb-4 text-dark">
          Our shipping Partners
        </h1>
        <TrustedPartner />
        
      </section>

      {/* Client's Say About Us */}
      <section className=" bg-blue-50 mx-auto px-4 py-6 lg:py-24 lg:px-16">
        <h1 className="text-2xl font-bold text-center">
          What People Say About Us
        </h1>
        <p className="mt-2 text-gray-600 text-center mb-10">
          Hear from our happy customers who trust ShipDuniya for their
          deliveries.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white p-6 rounded-lg space-y-4">
              <div className="flex items-center space-x-4">
                <Image
                  src={review.image}
                  alt="Client"
                  width={50}
                  height={50}
                  className="rounded-full"
                  unoptimized
                />
                <div>
                  <h3 className="font-semibold">{review.name}</h3>
                  <p className="text-muted">{review.role}</p>
                </div>
              </div>
              <p className="text-muted">{review.feedback}</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-500 fill-current"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className=" mx-auto px-4 py-6 lg:py-16 lg:px-16">
        <h1 className="text-4xl font-bold text-center mb-4 text-dark">
          Our Technology Partners
        </h1>
        <TrustedTechnicalPartner />
      </section>
    </div>
  );
}

export default HomePage;
