"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const orderFormSchema = z
  .object({
    orderType: z.enum(["cod", "prepaid"]),
    consignee: z.string().min(1, "Consignee Name is required"),
    consigneeAddress1: z
      .string()
      .min(1, "Consignee Address Line 1 is required"),
    consigneeAddress2: z.string().optional(),
    city: z.string().min(1, "Destination City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().min(1, "Pincode is required"),
    telephone: z.string().optional(),
    mobile: z
      .string()
      .regex(/^\d{10}$/, "Must be 10 digits")
      .or(z.literal("")),
    collectableValue: z
      .number()
      .min(0, "Must be a valid number and at least 0"),
    declaredValue: z.number().min(0, "Must be a valid number and at least 0"),
    itemDescription: z.string(),
    dgShipment: z.boolean(),
    quantity: z
      .number()
      .min(1, "Quantity is required and must be a valid number"),
    height: z.number(),
    breadth: z
      .number(),
    length: z.number(),
    volumetricWeight: z.number(),
    actualWeight: z
      .number(),
    invoiceNumber: z.string().min(1, "Invoice Number is required"),
  })
  .refine(
    (data) => {
      // Only apply validation when order type is COD
      if (data.orderType === "cod") {
        return data.collectableValue <= data.declaredValue;
      }
      return true;
    },
    {
      message:
        "Collectable value cannot be greater than declared value for COD orders",
      path: ["collectableValue"], // This will show the error on the collectableValue field
    }
  );

const orderFormSteps = [
  {
    title: "Booking Details",
    fields: [
      "orderType",
      "consignee",
      "consigneeAddress1",
      "consigneeAddress2",
      "pincode",
      "invoiceNumber",
      "destinationCity",
      "state",
      "mobile",
      "telephone",
    ],
  },
  {
    title: "Parcel Details",
    fields: [
      "height",
      "breadth",
      "length",
      "collectableValue",
      "declaredValue",
      "itemDescription",
      "dgShipment",
      "quantity",
      "volumetricWeight",
      "actualWeight",
    ],
  },
];

export default function ShippingOrder({ onSubmit, setIsAddingOrder }) {
  const [orderFormStep, setOrderFormStep] = useState(0);
  const router = useRouter();

  const orderForm = useForm({
    mode: "onBlur", // Validate on blur instead of onChange
    reValidateMode: "onBlur",
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      orderType: "prepaid",
      consignee: "",
      consigneeAddress1: "",
      consigneeAddress2: "",
      city: "",
      state: "",
      pincode: "",
      telephone: "",
      mobile: "",
      collectableValue: 0,
      declaredValue: 0,
      itemDescription: "",
      dgShipment: false,
      quantity: 1,
      height: 0,
      breadth: 0,
      length: 0,
      volumetricWeight: 0,
      actualWeight: 0,
      invoiceNumber: "",
    },
    mode: "onBlur",
    criteriaMode: "all",
  });

  const nextOrderStep = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();

    const fields = orderFormSteps[orderFormStep].fields;
    const isStepValid = await orderForm.trigger(fields);

    if (!isStepValid) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    // Additional validation for COD orders
    if (orderFormStep === 1) {
      const formData = orderForm.getValues();
      if (
        formData.orderType === "cod" &&
        formData.collectableValue > formData.declaredValue
      ) {
        orderForm.setError("collectableValue", {
          type: "custom",
          message:
            "Collectable value cannot be greater than declared value for COD orders",
        });

        toast.error("Collectable value cannot be greater than declared value!");
        return;
      }
    }

    // Move to next step safely without submitting
    setOrderFormStep((prev) => Math.min(prev + 1, orderFormSteps.length - 1));

    // Debug log to confirm the step change
    console.log("Moving to step:", orderFormStep + 1);
  };

  const prevOrderStep = () => {
    setOrderFormStep((prev) => Math.max(prev - 1, 0));
  };

  const fetchLocation = async () => {
    const pincode = orderForm.watch("pincode");
    if (pincode.length === 6) {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const data = await response.json();

        if (data && data[0] && data[0].PostOffice) {
          const { District, State } = data[0].PostOffice[0];
          orderForm.setValue("city", District || "");
          orderForm.setValue("state", State || "");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    }
  };

  // Watch for changes in orderType and validate collectableValue
  useEffect(() => {
    const subscription = orderForm.watch((value, { name }) => {
      if (
        name === "orderType" ||
        name === "declaredValue" ||
        name === "collectableValue"
      ) {
        const formData = orderForm.getValues();
        if (
          formData.orderType === "cod" &&
          formData.collectableValue > formData.declaredValue
        ) {
          orderForm.setError("collectableValue", {
            type: "custom",
            message:
              "Collectable value cannot be greater than declared value for COD orders",
          });
        } else {
          orderForm.clearErrors("collectableValue");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [orderForm]);

  useEffect(() => {
    fetchLocation();
  }, [orderForm.watch("pincode")]);

  useEffect(() => {
    if (orderForm.watch("orderType").toLowerCase() === "prepaid") {
      orderForm.setValue("collectableValue", 0);
    }
  }, [orderForm.watch("collectableValue")]);

  useEffect(() => {
    const vW =
      (orderForm.watch("length") *
        orderForm.watch("breadth") *
        orderForm.watch("height")) /
      5000;
    orderForm.setValue("volumetricWeight", parseFloat(vW));
  }, [
    orderForm.watch("length"),
    orderForm.watch("breadth"),
    orderForm.watch("height"),
  ]);
  const renderOrderForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>{orderFormSteps[orderFormStep].title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={orderForm.handleSubmit(onSubmit)} className="space-y-6">
          {/* Booking Details Inputs */}
          {orderFormStep === 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap justify-between">
                <div className="w-[30%]">
                  <Label htmlFor="consignee">Consignee Name</Label>
                  <Input
                    id="consignee"
                    {...orderForm.register("consignee")}
                    placeholder="Enter consignee name"
                  />
                  {orderForm.formState.errors.consignee && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.consignee.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="consigneeAddress1">
                    Consignee Address Line 1
                  </Label>
                  <Input
                    id="consigneeAddress1"
                    {...orderForm.register("consigneeAddress1")}
                    placeholder="Enter consignee address line 1"
                  />
                  {orderForm.formState.errors.consigneeAddress1 && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.consigneeAddress1.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="consigneeAddress2">
                    Consignee Address Line 2
                  </Label>
                  <Input
                    id="consigneeAddress2"
                    {...orderForm.register("consigneeAddress2")}
                    placeholder="Enter consignee address line 2 (Optional)"
                  />
                </div>
              </div>
              <div className="flex flex-wrap justify-between">
                <div className="w-[30%]">
                  <Label htmlFor="orderType">Order Type</Label>
                  <Select
                    onValueChange={(value) =>
                      orderForm.setValue("orderType", value)
                    }
                    defaultValue={orderForm.getValues("orderType")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prepaid">Prepaid</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                  {orderForm.formState.errors.orderType && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.orderType.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    {...orderForm.register("pincode")}
                    placeholder="Enter pincode"
                    type="number"
                  />
                  {orderForm.formState.errors.pincode && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.pincode.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="mobile">Mobile</Label>
                  <Input
                    id="mobile"
                    {...orderForm.register("mobile")}
                    placeholder="Enter mobile number"
                  />
                  {orderForm.formState.errors.mobile && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.mobile.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap justify-between">
                <div className="w-[30%]">
                  <Label htmlFor="city">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    {...orderForm.register("invoiceNumber")}
                    placeholder="Enter invoice number"
                  />
                  {orderForm.formState.errors.invoiceNumber && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.invoiceNumber.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="telephone">Telephone</Label>
                  <Input
                    id="telephone"
                    {...orderForm.register("telephone")}
                    placeholder="Enter telephone number (Optional)"
                  />
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...orderForm.register("city")}
                    placeholder="Enter city"
                  />
                  {orderForm.formState.errors.city && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.city.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap justify-between">
                <div className="w-[30%]">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    {...orderForm.register("state")}
                    placeholder="Enter state"
                  />
                  {orderForm.formState.errors.state && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.state.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {orderFormStep === 1 && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap justify-between">
                <div className="w-[30%]">
                  <Label htmlFor="state">Length</Label>
                  <Input
                    id="length"
                    {...orderForm.register("length", {
                      setValueAs: (value) => parseFloat(value) || 0,
                    })}
                    placeholder="Enter length"
                    type="number"
                  />
                  {orderForm.formState.errors.length && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.length.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="state">Breadth</Label>
                  <Input
                    id="breadth"
                    {...orderForm.register("breadth", {
                      setValueAs: (value) => parseFloat(value) || 0, // Ensure it's parsed as a number
                    })}
                    placeholder="Enter breadth"
                    type="number"
                  />
                  {orderForm.formState.errors.breadth && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.breadth.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="state">Height</Label>
                  <Input
                    id="height"
                    {...orderForm.register("height", {
                      setValueAs: (value) => parseFloat(value) || 0, // Ensure it's parsed as a number
                    })}
                    placeholder="Enter height"
                    type="number"
                  />
                  {orderForm.formState.errors.height && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.height.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap justify-between">
                <div className="w-[30%]">
                  <Label htmlFor="declaredValue">Quantity</Label>
                  <Input
                    id="quantity"
                    {...orderForm.register("quantity", {
                      setValueAs: (value) => parseFloat(value) || 0, // Ensure it's parsed as a number
                    })}
                    placeholder="Enter declared value"
                    type="number"
                  />
                  {orderForm.formState.errors.quantity && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.quantity.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="collectableValue">Collectable Value</Label>
                  <Input
                    id="collectableValue"
                    {...orderForm.register("collectableValue", {
                      setValueAs: (value) => parseFloat(value) || 0,
                    })}
                    placeholder="Enter collectable value"
                    disabled={orderForm.watch("orderType") === "prepaid"}
                    type="number"
                  />
                  {orderForm.formState.errors.collectableValue && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.collectableValue.message}
                    </p>
                  )}
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="declaredValue">Declared Value</Label>
                  <Input
                    id="declaredValue"
                    {...orderForm.register("declaredValue", {
                      setValueAs: (value) => parseFloat(value) || 0, // Ensure it's parsed as a number
                    })}
                    placeholder="Enter declared value"
                    type="number"
                  />
                  {orderForm.formState.errors.declaredValue && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.declaredValue.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap justify-between">
                <div className="flex items-center gap-3 w-[30%]">
                  <Label htmlFor="dgShipment">DG Shipment</Label>
                  <Switch
                    id="dgShipment"
                    checked={orderForm.watch("dgShipment")}
                    onCheckedChange={(checked) =>
                      orderForm.setValue("dgShipment", checked)
                    }
                  />
                </div>
                <div className="w-[30%]">
                  <Label htmlFor="volumetricWeight">Volumetric Weight</Label>
                  <Input
                    id="volumetricWeight"
                    {...orderForm.register("volumetricWeight", {
                      setValueAs: (value) => {
                        const parsedValue = parseFloat(value);
                        return isNaN(parsedValue) ? 0 : parsedValue; // Ensure it's a valid float or default to 0
                      },
                      validate: {
                        isPositiveNumber: (value) => {
                          const parsedValue = parseFloat(value);
                          return (
                            (!isNaN(parsedValue) && parsedValue >= 0) ||
                            "Volumetric weight must be a valid number and greater than or equal to 0"
                          );
                        },
                      },
                    })}
                    placeholder="Enter volumetric weight"
                    type="number" // Use type="number" to enforce numeric input
                    step="0.01" // Allow decimal values (e.g., 1.23)
                  />
                  {orderForm.formState.errors.volumetricWeight && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.volumetricWeight.message}
                    </p>
                  )}
                </div>

                <div className="w-[30%]">
                  <Label htmlFor="actualWeight">Actual Weight</Label>
                  <Input
                    id="actualWeight"
                    {...orderForm.register("actualWeight", {
                      setValueAs: (value) => parseFloat(value) || 0, // Ensure it's parsed as a number
                    })}
                    placeholder="Enter actual weight"
                    type="number"
                  />
                  {orderForm.formState.errors.actualWeight && (
                    <p className="text-sm text-red-500">
                      {orderForm.formState.errors.actualWeight.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemDescription">Item Description</Label>
                <Textarea
                  id="itemDescription"
                  {...orderForm.register("itemDescription")}
                  placeholder="Enter item description"
                />
                {orderForm.formState.errors.itemDescription && (
                  <p className="text-sm text-red-500">
                    {orderForm.formState.errors.itemDescription.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            {orderFormStep > 0 ? (
              <Button type="button" variant="outline" onClick={prevOrderStep}>
                Previous
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                  onClick={() => {
                    // setIsAddingOrder(false)
                    router.push("/user/orders")
                   }}
              >
                Back
              </Button>
            )}
            {orderFormStep < orderFormSteps.length - 1 ? (
              <Button type="button" onClick={nextOrderStep}>
                Next
              </Button>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );

  return <div>{renderOrderForm()}</div>;
}
