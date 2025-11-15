"use client";

import { useState } from "react";
import { generateInvoicePDF } from "../lib/generatePdf";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceFormData {
  // Invoice details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;

  // Company details
  companyName: string;
  companyEmail: string;
  companyPhone: string;

  // Agency details
  agencyName: string;

  // Client details
  clientName: string;
  clientEmail: string;
  clientPhone: string;

  // Payment details
  upiId: string;

  // Invoice items
  items: InvoiceItem[];

  // Notes
  notes: string;
}

export default function InvoiceForm() {
  const [formData, setFormData] = useState<InvoiceFormData>({
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
    items: [{ id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 }],
    notes: "Payment is due within 30 days.",
  });

  const updateFormData = (field: keyof InvoiceFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: String(Date.now()),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const removeItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Generating PDF with data:", formData);
      await generateInvoicePDF(formData);

      // Optionally show success message
      alert("Invoice PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-light italic text-gray-800">Invoice</h1>
        </div>

        <div className="flex justify-between items-start mb-8">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Invoice Details
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) =>
                    updateFormData("invoiceNumber", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) =>
                    updateFormData("invoiceDate", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => updateFormData("dueDate", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company and Client Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* From Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">From:</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    updateFormData("companyName", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
                  placeholder="Your Company Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.companyEmail}
                  onChange={(e) =>
                    updateFormData("companyEmail", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
                  placeholder="info@yourcompany.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.companyPhone}
                  onChange={(e) =>
                    updateFormData("companyPhone", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
                  placeholder="+91 12345678899"
                />
              </div>
            </div>
          </div>

          {/* Bill To Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Bill To:</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => updateFormData("clientName", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
                  placeholder="Client Company Inc."
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) =>
                    updateFormData("clientEmail", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
                  placeholder="client@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) =>
                    updateFormData("clientPhone", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
                  placeholder="+1 (555) 987-6543"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Agency Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Agency:</h3>
          <div className="max-w-md">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Agency Name
              </label>
              <input
                type="text"
                value={formData.agencyName}
                onChange={(e) => updateFormData("agencyName", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded font-mono text-sm text-black"
                placeholder="Agency Name"
              />
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Payment Information:
          </h3>
          <div className="max-w-md">
            <div>
              <label className="block text-sm text-gray-600 mb-1">UPI ID</label>
              <input
                type="text"
                value={formData.upiId}
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

        {/* Invoice Items */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
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
          {formData.items.map((item, index) => (
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
                {formData.items.length > 1 && (
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
        <div className="flex justify-end">
          <div className="w-64">
            <div className="border-t border-gray-300 pt-4">
              <div className="flex justify-between items-center text-xl font-bold text-gray-800">
                <span>Total Due:</span>
                <span className="text-blue-600 font-mono">
                  ${calculateSubtotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => updateFormData("notes", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded font-mono text-sm text-black"
            rows={3}
            placeholder="Additional notes or payment terms..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-mono text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Generate PDF Invoice
          </button>
          <button
            type="button"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-mono text-sm font-medium"
            onClick={() => console.log("Save draft:", formData)}
          >
            Save Draft
          </button>
        </div>
      </form>
    </div>
  );
}
