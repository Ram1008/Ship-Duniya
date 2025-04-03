import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import Image from "next/image";
import TrustedTechnicalPartner from "./TrustedTechnicalPartner";
// import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background pt-12 animate-fade-in">
      <div className="container px-8 mx-auto">
        <Image
          src={"https://storage.googleapis.com/ship-duniya_bucket/Images/shipDuniyaIcon.jpg"}
          width={200}
          height={200}
          alt="ShipDuniya Logo"
          unoptimized
          className="rounded-xl ml-10"
        />
        {/* Header Section */}
        <div className="mb-12 mt-8">
          <h1 className="text-4xl font-bold text-primary mb-4 px-8">
            Contact Us
          </h1>
          <p className="text-muted-foreground max-w-2xl px-8">
            Get in touch with our logistics experts. We're here to help with
            your shipping and transportation needs.
          </p>
        </div>

        <div className=" bg-blue-50 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className=" rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary p-3 rounded-full">
                    <Phone className="text-primary-foreground w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+91 9220559211</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary p-3 rounded-full">
                    <Mail className="text-primary-foreground w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">
                      contact@shipduniya.in
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary p-3 rounded-full">
                    <MapPin className="text-primary-foreground w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">
                      Sector-10, Noida, Pincode: 201301
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="rounded-lg overflow-hidden h-[300px] relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7006.654961380396!2d77.32711486393471!3d28.58995095234616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce4ffd9b979eb%3A0x1925cda1418b09ad!2sSector%2010%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1739222679016!5m2!1sen!2sin"
                width="600"
                height="200"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="location map"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className=" rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  className="min-h-[150px]"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 bg-primary text-white"
              >
                <MessageSquare className="mr-2" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
      <section className=" mx-auto px-4 py-6 lg:py-16 lg:px-16">
        <h1 className="text-4xl font-bold text-center mb-4 text-dark">
          Our Technology Partners
        </h1>
        <TrustedTechnicalPartner />
      </section>
    </div>
  );
};

export default Contact;
