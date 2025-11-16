"use client";

import React from "react";
import Image from "next/image";

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
  clientName: string;
  logo: string;
  clientEmail: string;
  clientPhone: string;
  upiId: string;
  items: InvoiceItem[];
  notes: string;
}

interface InvoicePreviewProps {
  data: InvoiceFormData;
}

export default function InvoicePreview({ data }: InvoicePreviewProps) {
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };

  const calculateTotal = (): number => {
    return data.items.reduce((sum, item) => sum + item.total, 0);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-lg">
      {/* Invoice Header */}
      <div className="p-8 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <Image
              src={data.logo}
              alt="logo"
              width={120}
              height={120}
              unoptimized
            />
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-light italic text-gray-800 font-mono">
              {data.companyName || "Company Name"}{" "}
            </h1>
          </div>
          <div className="text-right">
            <div className="text-gray-600 font-mono text-sm">
              Invoice #{data.invoiceNumber}
            </div>
            <div className="text-gray-600 font-mono text-sm mt-1">
              Date: {formatDate(data.invoiceDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Company and Client Info */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* From Section */}
          <div>
            <div className="text-sm text-gray-600 mb-2 font-mono">
              Due: {formatDate(data.dueDate)}
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-800 font-mono">From:</div>
              <div className="text-sm text-gray-800 font-mono">
                {data.companyName || "Your Company Name"}
              </div>
              {data.companyEmail && (
                <div className="text-sm text-gray-800 font-mono">
                  {data.companyEmail}
                </div>
              )}
              {data.companyPhone && (
                <div className="text-sm text-gray-800 font-mono">
                  {data.companyPhone}
                </div>
              )}
            </div>
          </div>

          {/* Bill To Section */}
          <div>
            <div className="text-sm text-gray-800 mb-2 font-mono">Bill To:</div>
            <div className="space-y-1">
              <div className="text-sm text-gray-800 font-mono">
                {data.clientName || "Client Company Inc."}
              </div>
              {data.clientEmail && (
                <div className="text-sm text-gray-800 font-mono">
                  {data.clientEmail}
                </div>
              )}
              {data.clientPhone && (
                <div className="text-sm text-gray-800 font-mono">
                  {data.clientPhone}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="mb-8">
          {/* Table Header */}
          <div className="bg-gray-50 border border-gray-200 rounded-t-lg">
            <div className="grid grid-cols-12 gap-4 p-4">
              <div className="col-span-5 text-sm font-medium text-gray-600 font-mono">
                Description
              </div>
              <div className="col-span-2 text-sm font-medium text-gray-600 font-mono">
                Qty
              </div>
              <div className="col-span-2 text-sm font-medium text-gray-600 font-mono">
                Unit Price
              </div>
              <div className="col-span-3 text-sm font-medium text-gray-600 font-mono text-right">
                Total
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="border-l border-r border-gray-200">
            {data.items.length > 0 ? (
              data.items.map((item, index) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-12 gap-4 p-4 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-25"
                  } ${
                    index < data.items.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="col-span-5 text-sm text-gray-800 font-mono">
                    {item.description || "Service description"}
                  </div>
                  <div className="col-span-2 text-sm text-gray-800 font-mono">
                    {item.quantity}
                  </div>
                  <div className="col-span-2 text-sm text-gray-800 font-mono">
                    {formatCurrency(item.unitPrice)}
                  </div>
                  <div className="col-span-3 text-sm text-gray-800 font-mono text-right">
                    {formatCurrency(item.total)}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 font-mono text-sm">
                No items added yet
              </div>
            )}
          </div>

          {/* Table Footer with Border */}
          <div className="border border-gray-200 rounded-b-lg border-t-0">
            <div className="p-4"></div>
          </div>
        </div>

        {/* Notes and Total Section */}
        <div className="flex justify-between items-start mb-8">
          <div className="w-1/2">
            {data.notes && (
              <div className="text-right">
                <div className="text-sm text-gray-600 font-mono">
                  {data.notes}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Total Due Section */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="border-t-2 border-gray-800 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800 font-mono">
                  Total Due:
                </span>
                <span className="text-xl font-bold text-blue-600 font-mono">
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-gray-100">
          <div className="space-y-2">
            {data.upiId && (
              <div className="text-sm text-gray-700 font-mono">
                <span className="font-medium">UPI ID:</span> {data.upiId}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
