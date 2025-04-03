"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axiosInstance from "@/utils/axios";
import { User, Mail, Phone, MapPin, PenBox, X, BookUser } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone must be at least 10 digits" }),
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters" }),
  pincode: z
    .string()
    .min(6, { message: "Pincode must be at least 6 characters" }),
  aadharNumber: z
    .string()
    .regex(/^\d{12}$/, { message: "Aadhar must be 12 digits" })
    .optional(),
  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, { message: "Invalid PAN format" })
    .optional(),
  gstNumber: z
    .string()
    .regex(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/, {
      message: "Invalid GST format",
    })
    .optional(),
});

export default function Profile({ type, onClose }) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      pincode: "",
      aadharNumber: "",
      panNumber: "",
      gstNumber: "",
    },
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get("/users/profile");
        console.log("Profile Data:", response.data);
        setProfile(response.data);

        profileForm.reset({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
          pincode: response.data.pincode || "",
          aadharNumber: response.data.aadharNumber || "",
          panNumber: response.data.panNumber || "",
          gstNumber: response.data.gstNumber || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [profileForm]);

  const onProfileSubmit = async (data) => {
    console.log("Form Submitted!");
    console.log("Submitted Data:", data);

    setLoading(true); // Start loading
    setAlert(null); // Reset previous alerts

    try {
      const response = await axiosInstance.put("/users/profile", data);
      console.log("Updated Profile Data:", response.data);

      setProfile(response.data); // Update local profile state
      setIsEditing(false); // Exit editing mode
      setAlert({ type: "success", message: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setAlert({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false); // End loading
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {alert && <Alert type={alert.type}>{alert.message}</Alert>}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              Personal Information
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 text-sm font-medium text-blue-600 border-2 border-blue-600 hover:bg-blue-50 rounded-md flex items-center"
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  <p className="flex xl:flex lg:flex md:flex sm:hidden">
                    Cancel
                  </p>
                </>
              ) : (
                <div className="flex gap-2 items-center">
                  <PenBox size={16} />
                  Edit Profile
                </div>
              )}
            </button>
          </div>

          {isEditing ? (
            <Form {...profileForm}>
              <form
                className="grid grid-cols-1"
                onSubmit={(e) => {
                  e.preventDefault(); // Prevents page reload
                  const profileData = profileForm.getValues(); // Get form data
                  onProfileSubmit(profileData);
                }}
              >
                <div className="flex flex-wrap gap-20">
                  <div className="flex flex-col">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col">
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 px-4 py-1 w-1/2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </form>
            </Form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-20">
              <div className="flex gap-2 flex-col space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-500">
                    <User className="h-4 w-4 mr-2" />
                    Name
                  </label>
                  <p className="text-gray-900">{profile.name}</p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-500">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </label>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
              </div>

              <div className="flex gap-2 flex-col space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-500">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </label>
                  <p className="text-gray-900">{profile.phone}</p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-500">
                    <BookUser className="h-4 w-4 mr-2" />
                    Address
                  </label>
                  <p className="text-gray-900">{profile.address}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
