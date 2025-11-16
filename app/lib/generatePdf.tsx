import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceFormData {
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
  logo: string;
  logoType: string;
  logoFile: File | null;
  // Notes
  notes: string;
}

export async function generateInvoicePDF(data: InvoiceFormData): Promise<void> {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points

    // Fetch and embed IBM Plex Mono font
    const ibmPlexMonoRegularUrl =
      "https://fonts.gstatic.com/s/ibmplexmono/v19/-F6qfjptAgt5VM-kVkqdyU8n3kwq0n1h.woff2";
    const ibmPlexMonoBoldUrl =
      "https://fonts.gstatic.com/s/ibmplexmono/v19/-F6sfjptAgt5VM-kVkqdyU8n1ioSznh_j6k.woff2";

    let ibmPlexMonoFont, ibmPlexMonoBold, ibmPlexMonoItalic;

    try {
      const [regularResponse, boldResponse] = await Promise.all([
        fetch(ibmPlexMonoRegularUrl),
        fetch(ibmPlexMonoBoldUrl),
      ]);

      const [regularFontBytes, boldFontBytes] = await Promise.all([
        regularResponse.arrayBuffer(),
        boldResponse.arrayBuffer(),
      ]);

      ibmPlexMonoFont = await pdfDoc.embedFont(
        new Uint8Array(regularFontBytes),
      );
      ibmPlexMonoBold = await pdfDoc.embedFont(new Uint8Array(boldFontBytes));
      ibmPlexMonoItalic = ibmPlexMonoFont; // Use regular for italic as fallback
    } catch (fontError) {
      console.warn(
        "Failed to load IBM Plex Mono, falling back to system fonts:",
        fontError,
      );
      // Fallback to system fonts
      ibmPlexMonoFont = await pdfDoc.embedFont(StandardFonts.Courier);
      ibmPlexMonoBold = await pdfDoc.embedFont(StandardFonts.CourierBold);
      ibmPlexMonoItalic = await pdfDoc.embedFont(StandardFonts.CourierOblique);
    }

    const { width, height } = page.getSize();
    const margin = 50;
    let currentY = height - margin;

    // Colors
    const primaryColor = rgb(0.2, 0.3, 0.4);
    const accentColor = rgb(0.3, 0.5, 0.8);
    const darkGray = rgb(0.3, 0.3, 0.3);
    const mediumGray = rgb(0.5, 0.5, 0.5);
    const lightGray = rgb(0.9, 0.9, 0.9);
    const tableHeaderBg = rgb(0.96, 0.96, 0.98);
    const borderColor = rgb(0.85, 0.85, 0.85);

    // Helper functions
    const formatCurrency = (amount: number): string => {
      return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };
    const formatImage = async (file: File) => {
      const imgBytes = await file.arrayBuffer();

      const header = new Uint8Array(imgBytes).slice(0, 8);

      // PNG signature
      const isPng =
        header[0] === 0x89 &&
        header[1] === 0x50 &&
        header[2] === 0x4e &&
        header[3] === 0x47;

      if (isPng) {
        return await pdfDoc.embedPng(imgBytes);
      } else {
        return await pdfDoc.embedJpg(imgBytes);
      }
    };
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    // Draw header background
    page.drawRectangle({
      x: 0,
      y: height - 120,
      width: width,
      height: 120,
      color: rgb(0.98, 0.98, 0.99),
    });

    // Location pin icon (circle)
    if (data.logoFile) {
      const pdfLogo = await formatImage(data.logoFile);

      page.drawImage(pdfLogo, {
        x: margin,
        y: currentY - 55,
        width: 80,
        height: 80,
      });
    } // Invoice Title
    page.drawText(data.companyName, {
      x: margin + 80,
      y: currentY - 30,
      size: 36,
      font: ibmPlexMonoBold,
      color: accentColor,
    });

    // Invoice details box (top right)
    const invoiceBoxX = width - margin - 200;
    const invoiceBoxY = currentY - 55;
    const invoiceBoxWidth = 180;
    const invoiceBoxHeight = 50;

    // Invoice box background
    page.drawRectangle({
      x: invoiceBoxX,
      y: invoiceBoxY,
      width: invoiceBoxWidth,
      height: invoiceBoxHeight,
      color: rgb(1, 1, 1),
      borderColor: borderColor,
      borderWidth: 1,
    });

    // Invoice number and date
    page.drawText(`Invoice #${data.invoiceNumber}`, {
      x: invoiceBoxX + 10,
      y: invoiceBoxY + 30,
      size: 11,
      font: ibmPlexMonoBold,
      color: primaryColor,
    });

    page.drawText(`Date: ${formatDate(data.invoiceDate)}`, {
      x: invoiceBoxX + 10,
      y: invoiceBoxY + 15,
      size: 10,
      font: ibmPlexMonoFont,
      color: darkGray,
    });

    currentY -= 100;

    // Company and Client Information Section
    const infoSectionY = currentY;

    let companyY = infoSectionY - 25;

    page.drawText(`Due: ${formatDate(data.dueDate)}`, {
      x: margin,
      y: companyY,
      size: 10,
      font: ibmPlexMonoFont,
      color: accentColor,
    });

    companyY -= 25;

    // From section
    page.drawText("From:", {
      x: margin,
      y: companyY,
      size: 11,
      font: ibmPlexMonoBold,
      color: darkGray,
    });

    companyY -= 15;

    page.drawText(data.companyName || "Your Company Name", {
      x: margin,
      y: companyY,
      size: 10,
      font: ibmPlexMonoFont,
      color: darkGray,
    });

    if (data.companyEmail) {
      companyY -= 12;
      page.drawText(data.companyEmail, {
        x: margin,
        y: companyY,
        size: 10,
        font: ibmPlexMonoFont,
        color: darkGray,
      });
    }

    if (data.companyPhone) {
      companyY -= 12;
      page.drawText(data.companyPhone, {
        x: margin,
        y: companyY,
        size: 10,
        font: ibmPlexMonoFont,
        color: darkGray,
      });
    }

    // Client section (right)
    const clientX = width / 2 + 20;
    let clientY = infoSectionY - 50;

    page.drawText("Bill To:", {
      x: clientX,
      y: clientY,
      size: 11,
      font: ibmPlexMonoBold,
      color: darkGray,
    });

    clientY -= 15;

    page.drawText(data.clientName || "Client Company Inc.", {
      x: clientX,
      y: clientY,
      size: 12,
      font: ibmPlexMonoBold,
      color: primaryColor,
    });

    if (data.clientEmail) {
      clientY -= 15;
      page.drawText(data.clientEmail, {
        x: clientX,
        y: clientY,
        size: 10,
        font: ibmPlexMonoFont,
        color: darkGray,
      });
    }

    if (data.clientPhone) {
      clientY -= 12;
      page.drawText(data.clientPhone, {
        x: clientX,
        y: clientY,
        size: 10,
        font: ibmPlexMonoFont,
        color: darkGray,
      });
    }

    // Move to items section
    currentY = Math.min(companyY, clientY) - 40;

    // Items table
    const tableStartX = margin;
    const tableWidth = width - 2 * margin;
    const rowHeight = 35;
    const headerHeight = 40;

    // Table header background
    page.drawRectangle({
      x: tableStartX,
      y: currentY - headerHeight,
      width: tableWidth,
      height: headerHeight,
      color: tableHeaderBg,
      borderColor: borderColor,
      borderWidth: 1,
    });

    // Column widths
    const descWidth = tableWidth * 0.5;
    const qtyWidth = tableWidth * 0.15;
    const priceWidth = tableWidth * 0.175;
    const totalWidth = tableWidth * 0.175;

    // Table headers
    page.drawText("Description", {
      x: tableStartX + 15,
      y: currentY - 25,
      size: 11,
      font: ibmPlexMonoBold,
      color: primaryColor,
    });

    page.drawText("Qty", {
      x: tableStartX + descWidth + 15,
      y: currentY - 25,
      size: 11,
      font: ibmPlexMonoBold,
      color: primaryColor,
    });

    page.drawText("Unit Price", {
      x: tableStartX + descWidth + qtyWidth + 15,
      y: currentY - 25,
      size: 11,
      font: ibmPlexMonoBold,
      color: primaryColor,
    });

    page.drawText("Total", {
      x: tableStartX + descWidth + qtyWidth + priceWidth + 15,
      y: currentY - 25,
      size: 11,
      font: ibmPlexMonoBold,
      color: primaryColor,
    });

    currentY -= headerHeight;

    // Draw vertical lines for table
    const drawVerticalLine = (x: number, startY: number, endY: number) => {
      page.drawLine({
        start: { x, y: startY },
        end: { x, y: endY },
        thickness: 1,
        color: borderColor,
      });
    };

    // Calculate total table height
    const tableBodyHeight = data.items.length * rowHeight;
    const tableEndY = currentY - tableBodyHeight;

    // Draw table borders
    drawVerticalLine(tableStartX, currentY + headerHeight, tableEndY);
    drawVerticalLine(
      tableStartX + descWidth,
      currentY + headerHeight,
      tableEndY,
    );
    drawVerticalLine(
      tableStartX + descWidth + qtyWidth,
      currentY + headerHeight,
      tableEndY,
    );
    drawVerticalLine(
      tableStartX + descWidth + qtyWidth + priceWidth,
      currentY + headerHeight,
      tableEndY,
    );
    drawVerticalLine(
      tableStartX + tableWidth,
      currentY + headerHeight,
      tableEndY,
    );

    // Items rows
    let subtotal = 0;
    data.items.forEach((item, index) => {
      const rowY = currentY - index * rowHeight;
      const isEven = index % 2 === 0;

      // Alternating row background
      if (!isEven) {
        page.drawRectangle({
          x: tableStartX,
          y: rowY - rowHeight,
          width: tableWidth,
          height: rowHeight,
          color: rgb(0.99, 0.99, 0.99),
        });
      }

      // Row bottom border
      page.drawLine({
        start: { x: tableStartX, y: rowY - rowHeight },
        end: { x: tableStartX + tableWidth, y: rowY - rowHeight },
        thickness: 0.5,
        color: borderColor,
      });

      // Item data
      page.drawText(item.description || "Service", {
        x: tableStartX + 15,
        y: rowY - 22,
        size: 10,
        font: ibmPlexMonoFont,
        color: darkGray,
      });

      page.drawText(item.quantity.toString(), {
        x: tableStartX + descWidth + 15,
        y: rowY - 22,
        size: 10,
        font: ibmPlexMonoFont,
        color: darkGray,
      });

      page.drawText(formatCurrency(item.unitPrice), {
        x: tableStartX + descWidth + qtyWidth + 15,
        y: rowY - 22,
        size: 10,
        font: ibmPlexMonoFont,
        color: darkGray,
      });

      page.drawText(formatCurrency(item.total), {
        x: tableStartX + descWidth + qtyWidth + priceWidth + 15,
        y: rowY - 22,
        size: 10,
        font: ibmPlexMonoBold,
        color: primaryColor,
      });

      subtotal += item.total;
    });

    currentY = tableEndY - 40;

    // Notes section
    if (data.notes) {
      page.drawText("Notes:", {
        x: margin,
        y: currentY,
        size: 10,
        font: ibmPlexMonoBold,
        color: darkGray,
      });

      const maxWidth = width - 2 * margin - 200;
      const words = data.notes.split(" ");
      let line = "";
      let noteY = currentY - 15;

      words.forEach((word) => {
        const testLine = line + (line ? " " : "") + word;
        const textWidth = ibmPlexMonoFont.widthOfTextAtSize(testLine, 9);

        if (textWidth > maxWidth && line) {
          page.drawText(line, {
            x: margin,
            y: noteY,
            size: 9,
            font: ibmPlexMonoFont,
            color: mediumGray,
          });
          line = word;
          noteY -= 12;
        } else {
          line = testLine;
        }
      });

      if (line) {
        page.drawText(line, {
          x: margin,
          y: noteY,
          size: 9,
          font: ibmPlexMonoFont,
          color: mediumGray,
        });
      }
    }

    // Total section
    const totalBoxWidth = 200;
    const totalBoxHeight = 60;
    const totalBoxX = width - margin - totalBoxWidth;
    const totalBoxY = currentY - 20;

    // Total box background
    page.drawRectangle({
      x: totalBoxX,
      y: totalBoxY - totalBoxHeight,
      width: totalBoxWidth,
      height: totalBoxHeight,
      color: rgb(0.98, 0.99, 1),
      borderColor: accentColor,
      borderWidth: 2,
    });

    // Total amount
    page.drawText("Total Due:", {
      x: totalBoxX + 15,
      y: totalBoxY - 25,
      size: 14,
      font: ibmPlexMonoBold,
      color: primaryColor,
    });

    const totalAmount = formatCurrency(subtotal);
    page.drawText(totalAmount, {
      x: totalBoxX + 15,
      y: totalBoxY - 45,
      size: 20,
      font: ibmPlexMonoBold,
      color: accentColor,
    });

    // Footer
    const footerY = 60;

    // Footer separator line
    page.drawLine({
      start: { x: margin, y: footerY + 20 },
      end: { x: width - margin, y: footerY + 20 },
      thickness: 0.5,
      color: borderColor,
    });

    // UPI ID if provided
    if (data.upiId) {
      page.drawText(`UPI ID: ${data.upiId}`, {
        x: margin,
        y: footerY + 10,
        size: 9,
        font: ibmPlexMonoFont,
        color: primaryColor,
      });
    }

    page.drawText(`Generated on ${new Date().toLocaleDateString()}`, {
      x: width - margin - 120,
      y: footerY,
      size: 9,
      font: ibmPlexMonoFont,
      color: mediumGray,
    });

    // Generate and download PDF
    const pdfBytes = await pdfDoc.save();

    // Create blob and download
    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice-${data.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  }
}

// Export for backward compatibility
export default generateInvoicePDF;
