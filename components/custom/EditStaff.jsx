'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import axiosInstance from '@/utils/axios';

const EditStaff = ({ staff,fetchStaffs, onClose }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true); 
    try {
      const response = await axiosInstance.put(`/superadmin/staff/${staff._id}`, data);
      
      if(response.status === 200) {
        onClose();
        fetchStaffs();
      }
    } catch (error) {
      console.error('Error updating staff:', error);
    } finally {
      setLoading(false); // Reset loading state after the process completes
    }
  };

  return (
    <DialogContent className="bg-white rounded-3xl shadow px-4">
      <DialogHeader>
        <DialogTitle>Edit Staff Details</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            {...register('name', { required: 'Name is required' })}
            className="col-span-3"
          />
          {errors.name && <span className="text-red-500 col-span-4 text-end">{errors.name.message}</span>}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            })}
            className="col-span-3"
          />
          {errors.email && <span className="text-red-500 col-span-4 text-end">{errors.email.message}</span>}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="phone" className="text-right">
            Phone No
          </Label>
          <Input
            id="phone"
            {...register('phone', {
              required: 'Phone number is required',
              minLength: {
                value: 10,
                message: 'Phone number must be at least 10 digits',
              },
              maxLength: {
                value: 10,
                message: 'Phone number must be exactly 10 digits',
              },
              pattern: {
                value: /^[0-9]*$/,
                message: 'Phone number must be numeric',
              },
            })}
            className="col-span-3"
          />
          {errors.phone && <span className="text-red-500 col-span-4 text-end">{errors.phone.message}</span>}
        </div>
        <div className="flex justify-end space-x-2">
          <Button className="border-none" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white rounded-[10px]"
            type="submit"
            disabled={loading} // Disable the button if loading
          >
            {loading ? 'Saving...' : 'Save Details'} {/* Show loading state */}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default EditStaff;
