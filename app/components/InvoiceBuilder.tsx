"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import InvoicePreview from "./InvoicePreview";
import { generateInvoicePDF } from "../lib/generatePdf";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { visuallyHidden } from "@mui/utils";
import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined";
const VisuallyHiddenInput = styled("input")({
  ...visuallyHidden,
});

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceFormData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  agencyName: string;
  logo: string;
  logoType: string;
  logoFile: File | null;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  upiId: string;
  items: InvoiceItem[];
  notes: string;
}

export default function InvoiceBuilder() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [showUploadButton, setShowUploadButton] = useState(true);
  const [invoiceData, setInvoiceData] = useState<InvoiceFormData>({
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    agencyName: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    upiId: "",
    logo: "",
    logoType: "none",
    logoFile: null,
    items: [{ id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 }],
    notes: "Payment is due within 30 days.",
  });

  const handleDataChange = (newData: InvoiceFormData) => {
    setInvoiceData(newData);
  };

  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      await generateInvoicePDF(invoiceData);
      alert("Invoice PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const isFormValid = (): boolean => {
    return !!(
      invoiceData.companyName &&
      invoiceData.companyEmail &&
      invoiceData.clientName &&
      invoiceData.clientEmail &&
      invoiceData.items.some(
        (item) => item.description && item.quantity > 0 && item.unitPrice > 0,
      )
    );
  };

  const formValid: boolean = isFormValid();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Navigation Header */}

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 font-mono mb-2">
            Create New Invoice
          </h1>
          <p className="text-gray-600 font-mono">
            Fill in the details below to generate your professional invoice
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <div className="flex">
              <button
                onClick={() => setActiveTab("form")}
                className={`px-6 py-3 rounded-md font-mono text-sm font-medium transition-colors ${
                  activeTab === "form"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Edit Invoice
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-6 py-3 rounded-md font-mono text-sm font-medium transition-colors ${
                  activeTab === "preview"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto">
          {activeTab === "form" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <InvoiceFormContent
                data={invoiceData}
                onChange={handleDataChange}
                onGeneratePDF={handleGeneratePDF}
                isGeneratingPDF={isGeneratingPDF}
                isFormValid={formValid}
                showUploadButton={showUploadButton}
                setShowUploadButton={setShowUploadButton}
              />
            </div>
          )}

          {activeTab === "preview" && (
            <div className="space-y-6">
              <InvoicePreview data={invoiceData} />

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setActiveTab("form")}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-mono text-sm font-medium"
                >
                  ← Edit Invoice
                </button>
                <button
                  onClick={handleGeneratePDF}
                  disabled={!formValid || isGeneratingPDF}
                  className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-mono text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isGeneratingPDF ? "Generating..." : "Download PDF"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Form Content Component
interface InvoiceFormContentProps {
  data: InvoiceFormData;
  onChange: (data: InvoiceFormData) => void;
  onGeneratePDF: () => void;
  isGeneratingPDF: boolean;
  showUploadButton: boolean;
  setShowUploadButton: React.Dispatch<React.SetStateAction<boolean>>;
  isFormValid: boolean;
}

function InvoiceFormContent({
  data,
  onChange,
  onGeneratePDF,
  isGeneratingPDF,
  isFormValid,
  showUploadButton,
  setShowUploadButton,
}: InvoiceFormContentProps) {
  const updateFormData = (field: keyof InvoiceFormData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: String(Date.now()),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    onChange({
      ...data,
      items: [...data.items, newItem],
    });
  };

  const removeItem = (id: string) => {
    onChange({
      ...data,
      items: data.items.filter((item) => item.id !== id),
    });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    onChange({
      ...data,
      items: data.items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      }),
    });
  };
  const addLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange({
      ...data,
      logo: url,
      logoType: file.type,
      logoFile: file,
    });
    setShowUploadButton(false);
  };
  const calculateSubtotal = () => {
    return data.items.reduce((sum, item) => sum + item.total, 0);
  };

  return (
    <div className="p-8">
      {/* Invoice Details */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4 font-mono">
          Invoice Details
        </h2>
        <div className="mb-6">
          <h3 className="text-sm font-mono text-gray-700 mb-2">Company Logo</h3>

          {showUploadButton ? (
            <div className="flex items-center gap-4">
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadOutlined />}
                className="font-mono"
              >
                Upload Logo
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={addLogo}
                />
              </Button>

              <p className="text-xs text-gray-500 font-mono">
                PNG or JPG. Transparent background recommended.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Image
                src={data.logo}
                height={80}
                width={80}
                alt="Company Logo"
                className="w-20 h-20 object-contain rounded border border-gray-300 bg-white shadow-sm"
              />

              <div className="flex flex-col gap-1">
                <p className="text-sm font-mono text-gray-700">Logo Uploaded</p>

                <button
                  className="text-blue-600 text-xs underline font-mono hover:text-blue-800"
                  onClick={() => setShowUploadButton(true)}
                >
                  Change Logo
                </button>
              </div>
            </div>
          )}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              value={data.invoiceNumber}
              onChange={(e) => updateFormData("invoiceNumber", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Invoice Date
            </label>
            <input
              type="date"
              value={data.invoiceDate}
              onChange={(e) => updateFormData("invoiceDate", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Due Date</label>
            <input
              type="date"
              value={data.dueDate}
              onChange={(e) => updateFormData("dueDate", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
            />
          </div>
        </div>
      </div>

      {/* Company and Client Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* From Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4 font-mono">
            From:
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                value={data.companyName}
                onChange={(e) => updateFormData("companyName", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
                placeholder="Your Company Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={data.companyEmail}
                onChange={(e) => updateFormData("companyEmail", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
                placeholder="info@yourcompany.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone</label>
              <input
                type="tel"
                value={data.companyPhone}
                onChange={(e) => updateFormData("companyPhone", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
                placeholder="+91 12345678899"
              />
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="mb-9">
          <h3 className="text-lg font-medium text-gray-800 mb-4 font-mono">
            Payment Information:
          </h3>
          <div className="max-w-md">
            <div>
              <label className="block text-sm text-gray-600 mb-1">UPI ID</label>
              <input
                type="text"
                value={data.upiId}
                onChange={(e) => updateFormData("upiId", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
                placeholder="yourname@paytm or phone@ybl"
              />
              <p className="text-xs text-gray-500 mt-1">
                For Indian payments. Leave empty if not applicable.
              </p>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4 font-mono">
            Bill To:
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Client Name *
              </label>
              <input
                type="text"
                value={data.clientName}
                onChange={(e) => updateFormData("clientName", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
                placeholder="Client Company Inc."
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={data.clientEmail}
                onChange={(e) => updateFormData("clientEmail", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
                placeholder="client@example.com"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4 font-mono">
          Invoice Items
        </h3>

        {/* Items Header */}
        <div className="grid grid-cols-12 gap-4 mb-4 pb-2 border-b border-gray-300">
          <div className="col-span-5 text-sm font-medium text-gray-600">
            Description
          </div>
          <div className="col-span-2 text-sm font-medium text-gray-600">
            Qty
          </div>
          <div className="col-span-2 text-sm font-medium text-gray-600">
            Unit Price
          </div>
          <div className="col-span-2 text-sm font-medium text-gray-600">
            Total
          </div>
          <div className="col-span-1"></div>
        </div>

        {/* Items List */}
        {data.items.map((item, index) => (
          <div
            key={item.id}
            className="grid grid-cols-12 gap-4 mb-3 items-center"
          >
            <div className="col-span-5">
              <input
                type="text"
                value={item.description}
                onChange={(e) =>
                  updateItem(item.id, "description", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
                placeholder="Service description"
                required
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(
                    item.id,
                    "quantity",
                    parseFloat(e.target.value) || 0,
                  )
                }
                className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                value={item.unitPrice}
                onChange={(e) =>
                  updateItem(
                    item.id,
                    "unitPrice",
                    parseFloat(e.target.value) || 0,
                  )
                }
                className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
                min="0"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>
            <div className="col-span-2">
              <div className="p-2 bg-gray-50 rounded font-mono text-sm font-medium">
                ${item.total.toFixed(2)}
              </div>
            </div>
            <div className="col-span-1">
              {data.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-mono text-sm"
        >
          Add Item
        </button>
      </div>

      {/* Total Section */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="border-t border-gray-300 pt-4">
            <div className="flex justify-between items-center text-xl font-bold text-gray-800">
              <span className="font-mono">Total Due:</span>
              <span className="text-blue-600 font-mono">
                ${calculateSubtotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-8">
        <label className="block text-sm text-gray-600 mb-2">Notes</label>
        <textarea
          value={data.notes}
          onChange={(e) => updateFormData("notes", e.target.value)}
          className="w-full p-3 border border-gray-300 rounded font-mono text-sm text-black"
          rows={3}
          placeholder="Additional notes or payment terms..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={onGeneratePDF}
          disabled={!isFormValid || isGeneratingPDF}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-mono text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isGeneratingPDF ? "Generating..." : "Generate PDF Invoice"}
        </button>
        <button
          type="button"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-mono text-sm font-medium"
          onClick={() => console.log("Save draft:", data)}
        >
          Save Draft
        </button>
      </div>

      {!isFormValid && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800 font-mono">
            Please fill in all required fields (*) and add at least one item to
            generate the invoice.
          </p>
        </div>
      )}
    </div>
  );
}
