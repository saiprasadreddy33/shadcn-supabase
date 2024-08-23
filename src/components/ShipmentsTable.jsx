
"use client"

import { useState, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

export default function ShipmentsTable() {
  const [shipments, setShipments] = useState([

  ])
  
  const [filters, setFilters] = useState({
    carrier: [],
    status: [],
    date: {
      from: null,
      to: null,
    },
  })
  const [sort, setSort] = useState({
    key: "date",
    order: "desc",
  })
  const [search, setSearch] = useState("")
  const [isAddingShipment, setIsAddingShipment] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const filteredShipments = useMemo(() => {
    return shipments
      .filter((shipment) => {
        if (filters.carrier.length > 0 && !filters.carrier.includes(shipment.carrier)) {
          return false
        }
        if (filters.status.length > 0 && !filters.status.includes(shipment.status)) {
          return false
        }
        if (filters.date.from && new Date(shipment.date) < new Date(filters.date.from)) {
          return false
        }
        if (filters.date.to && new Date(shipment.date) > new Date(filters.date.to)) {
          return false
        }
        return (
          shipment.id.toLowerCase().includes(search.toLowerCase()) ||
          shipment.tracking.toLowerCase().includes(search.toLowerCase()) ||
          shipment.recipient.toLowerCase().includes(search.toLowerCase()) ||
          shipment.address.toLowerCase().includes(search.toLowerCase())
        )
      })
      .sort((a, b) => {
        if (sort.order === "asc") {
          return a[sort.key] > b[sort.key] ? 1 : -1
        } else {
          return a[sort.key] < b[sort.key] ? 1 : -1
        }
      })
  }, [shipments, filters, sort, search])
  const handleFilterChange = (type, value) => {
    if (type === "carrier") {
      setFilters({
        ...filters,
        carrier: filters.carrier.includes(value)
          ? filters.carrier.filter((item) => item !== value)
          : [...filters.carrier, value],
      })
    } else if (type === "status") {
      setFilters({
        ...filters,
        status: filters.status.includes(value)
          ? filters.status.filter((item) => item !== value)
          : [...filters.status, value],
      })
    } else if (type === "date") {
      setFilters({
        ...filters,
        date: {
          from: value.from,
          to: value.to,
        },
      })
    }
  }
  const handleSortChange = (key) => {
    if (sort.key === key) {
      setSort({
        ...sort,
        order: sort.order === "asc" ? "desc" : "asc",
      })
    } else {
      setSort({
        key,
        order: "asc",
      })
    }
  }
  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }
  const handleViewMore = (shipment) => {
    setSelectedShipment(shipment)
    setIsSheetOpen(true)
  }
  const handleCloseSheet = () => {
    setSelectedShipment(null)
    setIsSheetOpen(false)
  }
  const handleDownloadPdf = () => {
    window.open(selectedShipment.pdf, "_blank")
  }
  const handleAddShipment = (newShipment) => {
    setShipments([...shipments, { id: `SHP${shipments.length + 1}`, ...newShipment }]);
    setIsAddingShipment(false);
  };
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Shipments</CardTitle>
          <CardDescription>Manage and track your shipments with our comprehensive system.</CardDescription>
          <div className="flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search shipments..."
              value={search}
              onChange={handleSearchChange}
              className="w-full max-w-xs"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FilterIcon className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={filters.carrier.includes("FedEx")}
                  onCheckedChange={() => handleFilterChange("carrier", "FedEx")}
                >
                  FedEx
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.carrier.includes("UPS")}
                  onCheckedChange={() => handleFilterChange("carrier", "UPS")}
                >
                  UPS
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.carrier.includes("USPS")}
                  onCheckedChange={() => handleFilterChange("carrier", "USPS")}
                >
                  USPS
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={filters.status.includes("In Transit")}
                  onCheckedChange={() => handleFilterChange("status", "In Transit")}
                >
                  In Transit
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.status.includes("Delivered")}
                  onCheckedChange={() => handleFilterChange("status", "Delivered")}
                >
                  Delivered
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.status.includes("Pending")}
                  onCheckedChange={() => handleFilterChange("status", "Pending")}
                >
                  Pending
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <div className="px-4 py-2">
                  <Label htmlFor="date-from">Date range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      id="date-from"
                      value={filters.date.from || ""}
                      onChange={(e) =>
                        handleFilterChange("date", {
                          from: e.target.value,
                          to: filters.date.to,
                        })
                      }
                    />
                    <Input
                      type="date"
                      id="date-to"
                      value={filters.date.to || ""}
                      onChange={(e) =>
                        handleFilterChange("date", {
                          from: filters.date.from,
                          to: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ListOrderedIcon className="w-4 h-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sort.key} onValueChange={(key) => handleSortChange(key)}>
                  <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="tracking">Tracking</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="carrier">Carrier</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="status">Status</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="recipient">Recipient</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog>
                <DialogTrigger>Add New Shipments</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Shipments</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                <Button type="submit">Extract</Button>
                </DialogFooter>
                </DialogContent>
              </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto border rounded-lg">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Tracking</TableHead>
                  <TableHead>customerName</TableHead>
                  <TableHead>invoiceNumber</TableHead>
                  <TableHead>orderNumber</TableHead>
                  <TableHead>deliveryNumber</TableHead>
                  <TableHead>shipToAddress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">{shipment.tracking}</TableCell>
                    <TableCell>{shipment.carrier}</TableCell>
                    <TableCell>{shipment.status}</TableCell>
                    <TableCell>{shipment.recipient}</TableCell>
                    <TableCell>{shipment.address}</TableCell>
                    <TableCell>{shipment.date}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoveHorizontalIcon className="w-4 h-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewMore(shipment)}>
                            <FileIcon className="mr-2 h-4 w-4" />
                            View Shipment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {selectedShipment && (
        <Sheet onClose={handleCloseSheet}>
          <SheetContent side="right" className="w-full max-w-md">
            <SheetHeader>
              <SheetTitle>Shipment Details</SheetTitle>
              <SheetDescription>View details and download the shipment PDF.</SheetDescription>
            </SheetHeader>
            <div className="p-6 space-y-4">
              <div>
                <Label>Tracking Number</Label>
                <p className="font-medium">{selectedShipment.tracking}</p>
              </div>
              <div>
                <Label>customerName</Label>
                <p className="font-medium">{selectedShipment.customerName}</p>
              </div>
              <div>
                <Label>invoiceNumber</Label>
                <p className="font-medium">{selectedShipment.invoiceNumber}</p>
              </div>
              <div>
                <Label>orderNumber</Label>
                <p className="font-medium">{selectedShipment.orderNumber}</p>
              </div>
              <div>
                <Label>deliveryNumber</Label>
                <p className="font-medium">{selectedShipment.deliveryNumber}</p>
              </div>
              <div>
                <Label>Date</Label>
                <p className="font-medium">{selectedShipment.date}</p>
              </div>
              <div>
                <Label>shipToAddress</Label>
                <p className="font-medium">{selectedShipment.shipToAddress}</p>
              </div>
            </div>
            <SheetFooter>
              <Button onClick={handleDownloadPdf}>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}

function DownloadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}


function FileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  )
}


function FilterIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}


function ListOrderedIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="10" x2="21" y1="6" y2="6" />
      <line x1="10" x2="21" y1="12" y2="12" />
      <line x1="10" x2="21" y1="18" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  )
}


function MoveHorizontalIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  )
}
