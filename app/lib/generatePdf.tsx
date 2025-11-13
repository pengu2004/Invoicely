import { PDFDocument, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";

interface InvoiceData {
  yourName: string;
  clientName: string;
  service: string;
  amount: string;
  upi: string;
  invoiceNo: string;
}

export default async function generateInvoicePDF(
  data: InvoiceData,
): Promise<void> {
  const { yourName, clientName, service, amount, upi, invoiceNo } = data;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { height } = page.getSize();

  const upiLink = `upi://pay?pa=${upi}&pn=%20&tr=%20&am=${amount}&cu=INR`;
  const qrUrl = await QRCode.toDataURL(upiLink);
  const qrBytes = await fetch(qrUrl).then((res) => res.arrayBuffer());
  const qrImage = await pdfDoc.embedPng(qrBytes);

  page.drawText("INVOICE", { x: 50, y: height - 60, size: 32, font });

  page.drawText(`Invoice ID: ${invoiceNo}`, {
    x: 50,
    y: height - 100,
    size: 14,
    font,
  });
  page.drawText(`From: ${yourName}`, {
    x: 50,
    y: height - 140,
    size: 14,
    font,
  });
  page.drawText(`To: ${clientName}`, {
    x: 50,
    y: height - 170,
    size: 14,
    font,
  });
  page.drawText(`Service: ${service}`, {
    x: 50,
    y: height - 200,
    size: 14,
    font,
  });
  page.drawText(`Amount: ${amount}`, {
    x: 50,
    y: height - 230,
    size: 14,
    font,
  });
  page.drawText(`UPI ID: ${upi}`, { x: 50, y: height - 260, size: 14, font });

  page.drawImage(qrImage, {
    x: 400,
    y: height - 230,
    width: 130,
    height: 130,
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], {
    type: "application/pdf",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `invoice-${invoiceNo}.pdf`;
  link.click();
}
