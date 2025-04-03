import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axios";
import { Switch } from "@/components/ui/switch";

const CloneOrder = ({
  cloneOrder,
  setCloneOrder,
  isCloneDialogOpen,
  setIsCloneDialogOpen,
}) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (cloneOrder?.orderType === "prepaid") {
      setCloneOrder((prev) => ({
        ...prev,
        collectableValue: 0,
      }));
    }
  }, [cloneOrder?.orderType, setCloneOrder]);

  useEffect(() => {
    if (
      cloneOrder?.collectableValue &&
      cloneOrder?.declaredValue &&
      parseFloat(cloneOrder.collectableValue) >
        parseFloat(cloneOrder.declaredValue)
    ) {
      // Show an error or enforce the condition
      console.error("Collectable value cannot be greater than declared value");
    }
    if (
      cloneOrder?.orderType?.toLowerCase() === "prepaid" &&
      parseFloat(cloneOrder.collectableValue) > 0
    ) {
      console.error("Collectable should be 0 for prepaid orders");
      setCloneOrder({ ...cloneOrder, collectableValue: 0 });
    }
  }, [cloneOrder?.collectableValue, cloneOrder?.declaredValue]);

  const handleCloneOrder = async () => {
    console.log(cloneOrder);
    try {
      const response = await axiosInstance.post(
        "/orders/create-forward-order",
        { order: cloneOrder }
      );
      if (response.data.success) {
        setCreateForwardSingleOrder(false);
        fetchOrders();
        // toast.success('Order added successfully!');
      }
    } catch (e) {
      console.log(e);
      // toast.error('Unable to create order, try again.');
    }
    setIsCloneDialogOpen(false);
  };

  return (
    <Dialog open={isCloneDialogOpen} onOpenChange={setIsCloneDialogOpen}>
      <DialogContent className="sm:max-w-[660px]">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Clone Order</DialogTitle>
        </DialogHeader>

        {/* Step 1: Consignee Details */}
        {step === 1 && (
          <div className="flex gap-6 justify-between flex-wrap">
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Consignee</label>
              <Input
                value={cloneOrder.consignee}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    consignee: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Order Type</label>
              <select
                value={cloneOrder.orderType?.toLowerCase()}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    orderType: e.target.value,
                  })
                }
                className="p-2 border rounded"
              >
                <option value="prepaid">Prepaid</option>
                <option value="cod">COD</option>
              </select>
            </div>

            <div className="flex flex-col pb-4 w-[40%]">
              <label>Consignee Address 1</label>
              <input
                type="text"
                value={cloneOrder?.consigneeAddress1 || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    consigneeAddress1: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg "
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Consignee Address 2</label>
              <input
                type="text"
                value={cloneOrder?.consigneeAddress2 || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    consigneeAddress2: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Pincode</label>
              <input
                type="text"
                value={cloneOrder?.pincode || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    pincode: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Invoice Number</label>
              <input
                type="text"
                value={cloneOrder?.invoiceNumber || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    invoiceNumber: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>City</label>
              <input
                type="text"
                value={cloneOrder?.city || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    city: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>State</label>
              <input
                type="text"
                value={cloneOrder?.state || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    state: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label>Mobile</label>
              <Input
                value={cloneOrder.mobile}
                onChange={(e) =>
                  setCloneOrder({ ...cloneOrder, mobile: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {/* Step 2: Package Details */}
        {step === 2 && (
          <div className="flex gap-6 justify-between flex-wrap">
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Length (cm)</label>
              <input
                type="number"
                value={cloneOrder?.length || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    length: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
            </div>

            <div className="flex flex-col pb-4 w-[40%]">
              <label>Width (cm)</label>
              <input
                type="number"
                value={cloneOrder?.breadth || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    breadth: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
            </div>

            <div className="flex flex-col pb-4 w-[40%]">
              <label>Height (cm)</label>
              <input
                type="number"
                value={cloneOrder?.height || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    height: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Collectable Value (₹)</label>
              <Input
                type="number"
                value={cloneOrder?.collectableValue || 0}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    collectableValue: e.target.value,
                  })
                }
                disabled={cloneOrder?.orderType?.toLowerCase() === "prepaid"} // Disable for prepaid orders
                step="0.01" // Allow decimal values
                className="border px-2 py-1 rounded-lg"
              />
              {cloneOrder?.orderType === "cod" &&
                cloneOrder?.collectableValue > cloneOrder?.declaredValue && (
                  <p className="text-sm text-red-500">
                    Collectable value cannot be greater than declared value
                  </p>
                )}
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Declared Value (₹)</label>
              <input
                type="text"
                value={cloneOrder?.declaredValue || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    declaredValue: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Description</label>
              <textarea
                value={cloneOrder?.itemDescription || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    itemDescription: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg "
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>DG Shipment</label>
              <Switch
                checked={cloneOrder?.dgShipment || false}
                onCheckedChange={(checked) =>
                  setCloneOrder({
                    ...cloneOrder,
                    dgShipment: checked,
                  })
                }
              />
            </div>

            <div className="flex flex-col pb-4 w-[40%]">
              <label>Quantity</label>
              <input
                type="number"
                value={cloneOrder?.quantity || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    quantity: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Volumetric Weight (gm)</label>
              <input
                type="number"
                value={cloneOrder?.volumetricWeight || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    volumetricWeight: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Actual Weight (gm)</label>
              <input
                type="number"
                value={cloneOrder?.actualWeight || ""}
                onChange={(e) =>
                  setCloneOrder({
                    ...cloneOrder,
                    actualWeight: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-row justify-between">
          {step > 1 && (
            <Button size="lg" variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
          )}
          {step < 2 && (
            <Button
              size="lg"
              className="bg-primary text-white"
              onClick={() => setStep(2)}
            >
              Next
            </Button>
          )}
          {step === 2 && (
            <Button
              size="lg"
              className="bg-primary text-white"
              onClick={handleCloneOrder}
            >
              Clone
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CloneOrder;
