import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

export default function AddShipmentForm({ onSubmit, onClose }) {
  const [newShipment, setNewShipment] = useState({
    tracking: "",
    customerName: "",
    invoiceNumber: "",
    orderNumber: "",
    deliveryNumber: "",
    shipToAddress: "",
    date: "",
    totalValue: "",
  });

  const handleChange = (e) => {
    setNewShipment({
      ...newShipment,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newShipment);
  };

  return (
    <Sheet onClose={onClose}>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Add New Shipment</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label>Tracking Number</Label>
            <Input name="tracking" value={newShipment.tracking} onChange={handleChange} required />
          </div>
          <div>
            <Label>Customer Name</Label>
            <Input name="customerName" value={newShipment.customerName} onChange={handleChange} required />
          </div>
          <div>
            <Label>Invoice Number</Label>
            <Input name="invoiceNumber" value={newShipment.invoiceNumber} onChange={handleChange} required />
          </div>
          <div>
            <Label>Order Number</Label>
            <Input name="orderNumber" value={newShipment.orderNumber} onChange={handleChange} required />
          </div>
          <div>
            <Label>Delivery Number</Label>
            <Input name="deliveryNumber" value={newShipment.deliveryNumber} onChange={handleChange} required />
          </div>
          <div>
            <Label>Ship To Address</Label>
            <Input name="shipToAddress" value={newShipment.shipToAddress} onChange={handleChange} required />
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" name="date" value={newShipment.date} onChange={handleChange} required />
          </div>
          <div>
            <Label>Total Invoice Value</Label>
            <Input name="totalValue" value={newShipment.totalValue} onChange={handleChange} required />
          </div>
          <SheetFooter>
            <Button type="submit">Add Shipment</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
