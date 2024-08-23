"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export default function AddShipments() {
  const [isLoading, setIsLoading] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [extractedData, setExtractedData] = useState({ invoiceNumber: '', customerNumber: '' })

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setPdfFile(file)
      setIsLoading(true)
      // Simulate API call to extract data from PDF
      await new Promise(resolve => setTimeout(resolve, 1000))
      setExtractedData({
        invoiceNumber: 'INV-' + Math.floor(Math.random() * 10000),
        customerNumber: 'CUST-' + Math.floor(Math.random() * 10000)
      })
      setIsLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    // Simulate API call to create shipment
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast({
      title: "Shipment created",
      description: "Your shipment has been successfully created.",
    })
  }

  return (
    <Card className="w-[600px] mx-auto mt-8">
      <CardHeader>
        <CardTitle>Create New Shipment</CardTitle>
        <CardDescription>Enter shipment details and upload invoice PDF.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tracking-number">Tracking Number</Label>
            <Input id="tracking-number" placeholder="Enter tracking number" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-name">Customer Name</Label>
            <Input id="customer-name" placeholder="Enter customer name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pdf-upload">Upload Invoice PDF</Label>
            <Input id="pdf-upload" type="file" accept=".pdf" onChange={handlePdfUpload} required />
          </div>
          {extractedData.invoiceNumber && (
            <div className="space-y-2">
              <p><strong>Extracted Invoice Number:</strong> {extractedData.invoiceNumber}</p>
              <p><strong>Extracted Customer Number:</strong> {extractedData.customerNumber}</p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea id="notes" placeholder="Enter any additional notes" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating Shipment...' : 'Create Shipment'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
