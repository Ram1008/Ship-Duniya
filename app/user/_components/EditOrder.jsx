import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/utils/axios";

const EditOrder = ({ isEditing, setIsEditing, editOrder, setEditOrder }) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (editOrder?.orderType === "prepaid") {
      // Set collectableValue to 0 for prepaid orders
      setEditOrder((prev) => ({
        ...prev,
        collectableValue: 0,
      }));
    }
  }, [editOrder?.orderType, setEditOrder]);

  useEffect(() => {
    if (
      editOrder?.collectableValue &&
      editOrder?.declaredValue &&
      parseFloat(editOrder.collectableValue) >
        parseFloat(editOrder.declaredValue)
    ) {
      // Show an error or enforce the condition
      console.error("Collectable value cannot be greater than declared value");
    }
    if(editOrder?.orderType.toLowerCase() === 'prepaid' && parseFloat(editOrder.collectableValue) >0){
      console.error("Collectable should be 0 for prepaid orders");
      setEditOrder({...editOrder, collectableValue : 0})
    }
  }, [editOrder?.collectableValue, editOrder?.declaredValue]);

  const handleEdit = async () => {
    // Save logic here
    console.log("Order updated:", editOrder);
    try{
      const response = await axiosInstance.put(`/orders/${editOrder._id}`, editOrder);
      console.log(response)
    }catch(err){
      console.log(err)
    }

    setIsEditing(false);
  };

  return (
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogContent className="sm:max-w-[660px]">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Edit Order</DialogTitle>
          <DialogDescription>
            Modify the order details below and save the changes.
          </DialogDescription>
        </DialogHeader>

        {/* Step 1 */}
        {step === 1 && (
          <div className="flex gap-6 justify-between flex-wrap">
            <div className="flex flex-col pb-4 w-[45%]">
              <label>Consignee</label>
              <input
                type="text"
                value={editOrder?.consignee || ""}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
                    consignee: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg "
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Order Type</label>
              <select
                value={editOrder?.orderType || ""}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
                    orderType: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              >
                <option value="prepaid">Prepaid</option>
                <option value="COD">Cash on Delivery (COD)</option>
              </select>
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Consignee Address 1</label>
              <input
                type="text"
                value={editOrder?.consigneeAddress1 || ""}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
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
                value={editOrder?.consigneeAddress2 || ""}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
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
                value={editOrder?.pincode || ""}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
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
                value={editOrder?.invoiceNumber || ""}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
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
                value={editOrder?.city || ""}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
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
                value={editOrder?.state || ""}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
                    state: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Mobile</label>
              <input
                type="text"
                value={editOrder?.mobile || ""}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
                    mobile: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg "
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex gap-6 justify-between flex-wrap">
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Length (cm)</label>
              <input
                type="number"
                value={editOrder?.length || ""}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
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
                value={editOrder?.breadth || ""}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
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
                value={editOrder?.height || ""}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
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
                value={editOrder?.collectableValue || 0}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
                    collectableValue: e.target.value,
                  })
                }
                disabled={editOrder?.orderType.toLowerCase() === "prepaid"} // Disable for prepaid orders
                step="0.01" // Allow decimal values
                className="border px-2 py-1 rounded-lg"
              />
              {editOrder?.orderType === "cod" &&
                editOrder?.collectableValue > editOrder?.declaredValue && (
                  <p className="text-sm text-red-500">
                    Collectable value cannot be greater than declared value
                  </p>
                )}
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Declared Value (₹)</label>
              <Input
                type="number"
                value={editOrder?.declaredValue || ""}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
                    declaredValue: e.target.value,
                  })
                }
                step="0.01" // Allow decimal values
                className="border px-2 py-1 rounded-lg"
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Description</label>
              <textarea
                value={editOrder?.itemDescription || ""}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
                    itemDescription: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg "
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>DG Shipment</label>
              <input
                type="checkbox"
                value={editOrder?.dgShipment || ""}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
                    dgShipment: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
            </div>
            <div className="flex flex-col pb-4 w-[40%]">
              <label>Quantity</label>
              <input
                type="number"
                value={editOrder?.quantity || ""}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
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
                value={editOrder?.volumetricWeight || ""}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
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
                value={editOrder?.actualWeight || ""}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
                    actualWeight: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-lg"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <div className="flex justify-between">
            {/* Back Button for Steps 2 and 3 */}
            {step > 1 && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
              >
                Back
              </Button>
            )}

            {/* Next Button */}
            {step < 2 && (
              <Button
                size="lg"
                className="bg-primary text-white"
                onClick={() => setStep(2)}
              >
                Next
              </Button>
            )}

            {/* Save Button for the Last Step */}
            {step === 2 && (
              <Button
                size="lg"
                onClick={handleEdit}
                className="bg-primary text-white"
              >
                Save
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrder;
