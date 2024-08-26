'use client'
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { getCurrentUser } from '@/services/authService';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { FileIcon, UploadIcon,EyeIcon,Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users, } from "lucide-react";
  import toast from "react-hot-toast";
import { format } from 'date-fns'
export default function ShipmentsTable() {
  const [shipments, setShipments] = useState([])
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
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [user, setUser] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sheetContent, setSheetContent] = useState(null)

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await fetch('https://be-shadn.onrender.com/api/shipments');
        if (!response.ok) {
          throw new Error('Failed to fetch shipments');
        }
        const data = await response.json();
        setShipments(data);
      } catch (error) {
        console.error('Error fetching shipments:', error);
      }
    };

    fetchShipments();
  }, []);
  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        console.log(currentUser)
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);
  async function checkAuthStatus() {
    try {
      const user = await getCurrentUser();
      if (user) {
        console.log('User is logged in:', user);
      } else {
        console.log('No user is logged in');
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
    }
  }
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
          shipment.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
          shipment.customerNumber.toLowerCase().includes(search.toLowerCase()) ||
          shipment.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
          shipment.deliveryNumber.toLowerCase().includes(search.toLowerCase()) ||
          shipment.shipToAddress.toLowerCase().includes(search.toLowerCase())
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
  const handleViewTrackingHistory = (shipment) => {
    setSelectedShipment(shipment)
    setSheetContent('tracking')
    setIsSheetOpen(true)
  }

  const handleViewPdfAttachment = (shipment) => {
    setSelectedShipment(shipment)
    setSheetContent('pdf')
    setIsSheetOpen(true)
  }

  /*const handleCloseSheet = () => {
    setSelectedShipment(null)
    setSheetContent(null)
    setIsSheetOpen(false)
  }*/
   /* const handleDownloadPdf = () => {
      // Implement PDF download functionality here
      console.log("Downloading PDF for shipment:", selectedShipment)
    }*/

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
    // Implement PDF download functionality here
    toast.success("Downloading PDF for shipment");
    console.log("Downloading PDF for shipment:", selectedShipment)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file)
    } else {
      //alert('Please upload a PDF file')
      toast.error("Please upload a PDF file before extracting");
    }
  }

  const handleExtract = async () => {
    if (uploadedFile) {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', uploadedFile);
            const response = await fetch('http://localhost:5000/api/pdf', {
              method: 'POST',
              body: formData,
          });
            if (!response.ok) {
              const errorText = await response.text(); 
              throw new Error(`Failed to extract data from PDF: ${errorText}`);
          }

            const data = await response.json();
            toast.success("Extracted successfully!");
            setShipments(prevShipments => [...prevShipments, data]);
            setUploadedFile(null);
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error extracting data:', error);
             toast.error("Failed to extract data from PDF!");
        } finally {
            setIsLoading(false);
        }
    } else {
        //alert('Please upload a PDF file before extracting');
        toast.error("Please upload a PDF file before extracting");
    }
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
                  <DropdownMenuRadioItem value="invoiceNumber">Invoice Number</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="customerNumber">Customer Number</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="orderNumber">Order Number</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="deliveryNumber">Delivery Number</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add New Shipments</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload PDF Invoice</DialogTitle>
                  <DialogDescription>
                    Upload to extract shipment details.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="pdf-upload"></Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="pdf-upload"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      {!uploadedFile ? (
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">PDF files only</p>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <FileIcon className="w-4 h-4" />
          <span>{uploadedFile.name}</span>
        </div>
      )}
      <Input
        id="pdf-upload"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileUpload}
      />
    </label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleExtract} disabled={isLoading}>
                    {isLoading ? 'Extracting...' : 'Extract'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-hidden border rounded-lg">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Tracking</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Delivery Number</TableHead>
                    <TableHead className="max-w-[200px]">Ship To Address</TableHead>
                    <TableHead>PDF</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShipments.map((shipment) => (
                    <TableRow key={shipment.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {shipment.id ? (
                          <Button
                            variant="link"
                            onClick={() => handleViewTrackingHistory(shipment)}
                            className="p-0 h-auto font-normal"
                          >
                            <Badge variant="outline" className="cursor-pointer">
                              {shipment.id}
                            </Badge>
                          </Button>
                        ) : (
                          <Badge variant="outline">N/A</Badge>
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(shipment.date), 'dd-MM-yyyy')}</TableCell>
                      <TableCell>{shipment.invoiceNumber}</TableCell>
                      <TableCell>{shipment.customerNumber}</TableCell>
                      <TableCell>{shipment.orderNumber}</TableCell>
                      <TableCell>{shipment.deliveryNumber}</TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate" title={shipment.shipToAddress}>
                          {shipment.shipToAddress}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewPdfAttachment(shipment)}
                          className="h-8 w-8 p-0"
                        >
                          <EyeIcon className="h-4 w-4" />
                          <span className="sr-only">View Shipment</span>
                        </Button>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full max-w-md">
          <SheetHeader>
            <SheetTitle>
              {sheetContent === 'tracking' ? 'Tracking History' : 'PDF Attachment'}
            </SheetTitle>
            <SheetDescription>
              {sheetContent === 'tracking'
                ? 'View the tracking history for this shipment.'
                : 'View and download the PDF attachment for this shipment.'}
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            {sheetContent === 'tracking' && selectedShipment && (
              <div className="space-y-4">
                <div>
                  <Label>Tracking Number</Label>
                  <p className="font-medium">{selectedShipment.id}</p>
                </div>
                <div>
                  <Label>Current Status</Label>
                  <p className="font-medium">{selectedShipment.status || <Badge variant="secondary">Completed</Badge>}</p>
                </div>
                <div>
                  <Label>Tracking History</Label>
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    {selectedShipment.trackingHistory ? (
                      selectedShipment.trackingHistory.map((event, index) => (
                        <div key={index} className="mb-4 last:mb-0">
                          <p className="font-medium">{event.status}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(event.timestamp), 'dd-MM-yyyy HH:mm')}
                          </p>
                          <p className="text-sm">{event.location}</p>
                        </div>
                      ))
                    ) : (
                      <Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>History</AccordionTrigger>
    <AccordionContent>
                      <p>No tracking history available.</p>
                      </AccordionContent>
  </AccordionItem>
</Accordion>
                    )}
                    
                  </ScrollArea>
                </div>
                <Label>Shipment Detail</Label>
                <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedShipment.invoiceTotal}</div>
              
            </CardContent>
          </Card>
              </div>
            )}
            {sheetContent === 'pdf' && selectedShipment && (
              <div className="space-y-4">
                <div>
                  <Label>PDF Attachment</Label>
                  <p className="font-medium">{selectedShipment.pdfAttachment || 'N/A'}</p>
                </div>
                <div>
                  <Button onClick={handleDownloadPdf}>
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
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


/*function FileIcon(props) {
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
*/

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
