'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const EditUser = ({ user = null, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      _id: user?._id || "",
      name: user?.name.trim() || "",
      email: user?.email || "",
      role: user?.role || "",
      customerType: user?.customerType || "",
      phone: user?.phone || "",
      address: user?.address || ""
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue('name', user?.name.trim());
    setValue('email', user?.email);
    setValue('phone', user?.phone);
    setValue("address", user?.address);
    setValue('role', user?.role);
    setValue('customerType', user?.customerType);
  }, [user, setValue]);


  const handleSave = async (data) => {
    console.log(data);
    setLoading(true);
    await onSave({ _id: user?._id, ...data });
    setLoading(false);
    onClose();
  };

  return (
    <DialogContent className="bg-white rounded-3xl shadow px-4">
      <DialogHeader>
        <DialogTitle>{user ? "Edit User Details" : "Add User"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(handleSave)}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              {...register("name", {
                required: "Name is required",
                setValueAs: (value) => value.trim(),
              })}
              className="col-span-3"
            />
            {errors.name && (
              <p className="col-span-4 text-right text-red-500 text-sm">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email address",
                },
              })}
              className="col-span-3"
            />
            {errors.email && (
              <p className="col-span-4 text-right text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select
              id="role"
              onValueChange={(value) => setValue("role", value)}
              defaultValue={user?.role || "Role"}
              className="col-span-3"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Role type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="col-span-4 text-right text-red-500 text-sm">
                {errors.role.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customerType" className="text-right">
              Customer Type
            </Label>
            <Select
              id="customerType"
              onValueChange={(value) => setValue("customerType", value)}
              defaultValue={user?.customerType || "bronze"}
              className="col-span-3"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select customer type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="diamond">Diamond</SelectItem>
              </SelectContent>
            </Select>
            {errors.customerType && (
              <p className="col-span-4 text-right text-red-500 text-sm">
                {errors.customerType.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone No
            </Label>
            <Input
              id="phone"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Phone number must be 10 digits",
                },
              })}
              className="col-span-3"
            />
            {errors.phone && (
              <p className="col-span-4 text-right text-red-500 text-sm">
                {errors.phone.message}
              </p>
            )}
          </div>
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              {...register("address", {
                required: "Address is required",
                pattern: {
                  message: "Address must be at least 3 characters",
                },
              })}
              className="col-span-3"
            />
            {errors.address && (
              <p className="col-span-4 text-right text-red-500 text-sm">
                {errors.address.message}
              </p>
            )}
          </div> */}
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            className="border-none"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white rounded-[10px]"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Details"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default EditUser;
