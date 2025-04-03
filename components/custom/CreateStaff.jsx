// CreateAdmin.jsx
'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generatePassword } from '@/utils/helpers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axiosInstance from '@/utils/axios';

const CreateStaff = ({ staffs, setStaffs, setIsCreateDialogOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onCreateSubmit = async (data) => {
    const newStaff = {
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone,
      password: data.password,
    };

    setLoading(true);

    try {
      const response = await axiosInstance.post(
        '/superadmin/staffs',
        newStaff,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const createdStaff = response.data;
      if(response.status === 201) {
        setIsCreateDialogOpen(false);
        setStaffs([...staffs, createdStaff]);
      }
    } catch (error) {
      console.log(error);
      console.error('Error creating staff:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create New Staff</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onCreateSubmit)}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="create-name" className="text-right">
              Name
            </Label>
            <Input
              id="create-name"
              className="col-span-3"
              {...register('name', { required: true })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="create-email" className="text-right">
              Email
            </Label>
            <Input
              id="create-email"
              className="col-span-3"
              {...register('email', {
                required: true,
                pattern: /^\S+@\S+$/i,
              })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="create-phone" className="text-right">
              Phone
            </Label>
            <Input
              id="create-phone"
              className="col-span-3"
              {...register('phone', { required: true })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="create-role" className="text-right">
              Role
            </Label>
            <Controller
              name="role"
              control={control}
              defaultValue="Support"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="create-password" className="text-right">
              Password
            </Label>
            <div className="col-span-3 flex gap-2">
              <Input
                id="create-password"
                type="text"
                {...register('password', { required: true })}
              />
              <Button
                type="button"
                onClick={() => setValue('password', generatePassword())}
              >
                Generate
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit">
            {loading ? 'Creating...' : 'Create Staff'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default CreateStaff;
