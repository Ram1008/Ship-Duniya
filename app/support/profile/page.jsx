"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import axiosInstance from "@/utils/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"; 
import { Alert } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowLeft,
  Building2,
  Check,
  CreditCard,
  Mail,
  MapPin,
  Pen,
  PenBox,
  Phone,
  Plus,
  User,
  X,
} from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
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

const Profile = ({setActiveTab}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [alert, setAlert] = useState(false);



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

  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get("/users/profile");
      setProfile(response.data);
      // Set default values for profile form and account form
      profileForm.reset({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        address: response.data.address || "",
        pincode: response.data.pincode || "",
        aadharNumber: response.data.aadharNumber || "",
        panNumber: response.data.panNumber || "",
        gstNumber: response.data.gstNumber || "",
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const onProfileSubmit = async (values) => {
    setIsUpdating(true);
    try {
      await axiosInstance.put("/users/profile", { ...values });
      setAlert({ type: "success", message: "Profile updated successfully!" });
      setIsEditing(false);
    } catch (error) {
      setAlert({ type: "error", message: error.message });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your account settings</CardDescription>
          </div>
          <Button variant="outline" onClick={()=>setActiveTab("Dashboard")}>
            <ArrowLeft height={18} className="mr-2"/>Back
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {alert && <Alert type={alert.type}>{alert.message}</Alert>}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow">
            {/* Personal Information */}
            <div className="p-6 border-b border-gray-200">
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
                      Cancel
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
                    className="grid grid-cols-1 "
                    onSubmit={profileForm.handleSubmit(onProfileSubmit)}
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
                                <Input {...field} disabled={!isEditing} />
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
                                <Input {...field} disabled />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} disabled />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex flex-col">
                        <FormField
                          control={profileForm.control}
                          name="aadharNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Aadhar Number</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="panNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>PAN Number</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="gstNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GST Number</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col">
                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="pincode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pin Code</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="col-span-full">
                          <button
                            type="submit"
                            className="mt-4 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            Save Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-500">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Aadhar Number
                    </label>
                    <p className="text-gray-900">{profile.aadharNumber}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-500">
                      <Phone className="h-4 w-4 mr-2" />
                      Phone
                    </label>
                    <p className="text-gray-900">{profile.phone}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      Address
                    </label>
                    <p className="text-gray-900">{profile.address}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-500">
                      <Mail className="h-4 w-4 mr-2" />
                      Pincode
                    </label>
                    <p className="text-gray-900">{profile.pincode}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-500">
                      <Mail className="h-4 w-4 mr-2" />
                      Pan Number
                    </label>
                    <p className="text-gray-900">{profile.panNumber}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-500">
                      <Building2 className="h-4 w-4 mr-2" />
                      GST Number
                    </label>
                    <p className="text-gray-900">{profile.gstNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
