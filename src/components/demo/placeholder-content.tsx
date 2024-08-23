"use client"
import { Card, CardContent } from "@/components/ui/card";
import ShipmentsTable from "@/components/ShipmentsTable";

export default function PlaceholderContent() {
  return (
    <Card className="rounded-lg border-none mt-1">
        <div className="flex justify-center items-center ">
            
          <ShipmentsTable />
        </div>
    </Card>
  );
}
