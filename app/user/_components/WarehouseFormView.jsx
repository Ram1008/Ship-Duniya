import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import axiosInstance from '@/utils/axios';

const warehouseFormSchema = z.object({
   
    name: z.string()
      .min(3, { message: "Name must be at least 3 characters long" })
      .max(50, { message: "Name must be no more than 50 characters long" }),
    
      address: z.string()
        .min(3, { message: "Address must be at least 3 characters long" })
        .max(100, { message: "Address must be no more than 100 characters long" }),
      pincode: z.string().min(6, { message: 'Pincode must be at least 6 characters' }),
    
    capacity: z.number(),
    
      managerName: z.string()
        .min(3, { message: "Manager's name must be at least 3 characters long" })
        .max(50, { message: "Manager's name must be no more than 50 characters long" }),
      managerMobile: z.string().regex(/^\d{10}$/, 'Must be 10 digits').or(z.literal('')),
    
    status: z.enum(['operational', 'under maintenance'], {
      errorMap: () => ({ message: "Status must be either 'operational' or 'under maintenance'" }),
    }),
  });

const WarehouseFormView = () => {

  const wareHouseForm = useForm ({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: {
        name: '',
            address: '',
            pincode: '',
        capacity: 0,
            managerName: '',
            managerMobile: '',
        status: 'operational',
    }
  });


  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axiosInstance.post('/warehouse', data);
      console.log(response);
      if (response) {
        console.log("Added warehouse");
      } else {
        console.error("Failed to add warehouse", response.statusText);
      }
    } catch (error) {
      console.error("Error adding warehouse", error);
    }
  };

  return (
    <Form {...wareHouseForm}>
      <form onSubmit={wareHouseForm.handleSubmit(onSubmit)}>
      <FormField
                  control={wareHouseForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
      <FormField
                  control={wareHouseForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
      <FormField
                  control={wareHouseForm.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input {...field}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
      <FormField
                  control={wareHouseForm.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input {...wareHouseForm.register('length', {
                    setValueAs: (value) => parseFloat(value) || 0, // Ensure it's parsed as a number
                  })} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
      <FormField
                  control={wareHouseForm.control}
                  name="managerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager Name</FormLabel>
                      <FormControl>
                        <Input {...field}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
      <FormField
                  control={wareHouseForm.control}
                  name="managerMobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manager's Contact</FormLabel>
                      <FormControl>
                        <Input {...field}  />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
        <Button type="submit" className="mt-4">Submit</Button>
      </form>
    </Form>
  );
};

export default WarehouseFormView;
