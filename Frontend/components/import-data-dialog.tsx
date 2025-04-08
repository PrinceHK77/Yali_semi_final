"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileSpreadsheet, Upload, FileText } from "lucide-react"
import type { Persona } from "@/types/persona"

interface ImportDataModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (personas: Persona[]) => void
}

export default function ImportDataModal({ isOpen, onClose, onImport }: ImportDataModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [preview, setPreview] = useState<Persona[]>([])
  const [selectedType, setSelectedType] = useState<string>("Employees")
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      previewFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      previewFile(e.dataTransfer.files[0])
    }
  }

  const previewFile = (file: File) => {
    setProcessing(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        let data: Persona[] = []

        if (e.target?.result) {
          // Simple CSV parsing (would be more robust in production)
          const csvContent = e.target.result as string
          const lines = csvContent.split("\n")
          const headers = lines[0].split(",")

          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue

            const values = lines[i].split(",")
            const persona: any = {
              id: Date.now().toString() + i,
              isFavorite: false,
              status: "Active",
              added: new Date().toISOString().split("T")[0],
              type: selectedType,
            }

            headers.forEach((header, index) => {
              const key = header.trim()
              if (values[index]) {
                persona[key] = values[index].trim()
              }
            })

            data.push(persona as Persona)
          }
        }

        setPreview(data.slice(0, 3)) // Preview first 3 items
        setProcessing(false)
      } catch (error) {
        console.error("Error parsing file:", error)
        setProcessing(false)
      }
    }

    reader.readAsText(file)
  }

  const handleImport = () => {
    if (file) {
      // Check file extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'csv') {
        // Handle CSV file
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            if (e.target?.result) {
              // Get the raw CSV content
              const csvContent = e.target.result as string
              
              // Send the raw CSV data to backend
              fetch('http://localhost:5500/import-data', {
                method: 'POST',
                headers: {
                  'Content-Type': 'text/csv',
                  'X-File-Type': 'csv',
                  'Type':selectedType
                },
                body: csvContent,
              })
              .then(handleResponse)
              .catch(handleError);
            }
          } catch (error) {
            console.error("Error importing file:", error)
          }
        }
        reader.readAsText(file)
      } 
      else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        // Handle Excel file - need to send as binary
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            if (e.target?.result) {
              // Send the binary Excel data to backend
              fetch('http://localhost:5500/import-data', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/octet-stream',
                  'X-File-Type': fileExtension,
                  'Type':selectedType
                },
                body: e.target.result,
              })
              .then(handleResponse)
              .catch(handleError);
            }
          } catch (error) {
            console.error("Error importing file:", error)
          }
        }
        reader.readAsArrayBuffer(file) // Read as binary for Excel files
      }
      else {
        alert('Unsupported file format. Please upload a CSV or Excel file.');
      }
    }
  }
  
  // Helper functions for handling response/error
  const handleResponse = (response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json().then(responseData => {
      console.log('Success:', responseData);
      resetForm();
      onClose();
    });
  }
  
  const handleError = (error) => {
    console.error('Error sending data to server:', error);
    alert('Error sending data to server: ' + error.message);
  }


  const resetForm = () => {
    setFile(null)
    setPreview([])
    setProcessing(false)
  }

  const handleButtonClick = () => {
    inputRef.current.click();
  };


  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm()
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Persona Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Persona Type</Label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="Employees">Employees</option>
              <option value="Vendors">Vendors</option>
              <option value="Customers">Customers</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Upload CSV file</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${
                isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileSpreadsheet className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">
                Drag and drop your CSV file here
              </p>
              <label className="cursor-pointer">
                {/* <span className="relative z-10">
                  <Button size="sm">Choose File</Button>
                </span> */}
                <input
                  type="file"
                  accept=".csv"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              {file && (
                <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>CSV should have headers with these fields:</p>
            <p>name, email, phone, location, role, department, etc.</p>
          </div>
          <div className="flex gap-2 flex-wrap pt-2">
    <a href="/vendors_sample.xlsx" download>
      <button className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 transition">
        Vendors Sample 
      </button>
    </a>
    <a href="/employee.xlsx" download>
      <button className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600 transition">
        Employee Sample 
      </button>
    </a>
    <a href="/customers_sample.xlsx" download>
      <button className="bg-purple-500 text-white text-sm px-3 py-1 rounded hover:bg-purple-600 transition">
        Customer Sample 
      </button>
    </a>
  </div>
        </div>

        {preview.length > 0 && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium mb-2">Preview ({preview.length} items):</h3>
            <div className="space-y-2 text-sm max-h-[200px] overflow-y-auto">
              {preview.map((item, index) => (
                <div key={index} className="p-2 border rounded bg-white">
                  <p>
                    <span className="font-medium">Name:</span> {item.name}
                  </p>
                  <p>
                    <span className="font-medium">Type:</span> {item.type}
                  </p>
                  {item.email && (
                    <p>
                      <span className="font-medium">Email:</span> {item.email}
                    </p>
                  )}
                  {item.location && (
                    <p>
                      <span className="font-medium">Location:</span> {item.location}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file}>
            Import Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

