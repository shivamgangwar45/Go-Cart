import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (order, currency = "₹") => {
  const doc = new jsPDF();

  // Brand Header
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235); // Blue
  doc.text("GoCart", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Tax Invoice / Cash Receipt", 14, 26);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 31);

  // Invoice & Order Metadata (Right Aligned)
  doc.setFontSize(9);
  doc.setTextColor(50);
  const invoiceNo = `INV-${order.id.slice(-6).toUpperCase()}`;
  doc.text(`Invoice No: ${invoiceNo}`, 140, 20);
  doc.text(`Order ID: ${order.id}`, 140, 25);
  doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 140, 30);
  doc.text(`Payment: ${order.paymentMethod || "COD"} (${order.isPaid ? "PAID" : "PENDING"})`, 140, 35);

  doc.setDrawColor(220, 220, 220);
  doc.line(14, 40, 196, 40);

  // Billing Address Section
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text("Billed To:", 14, 48);

  doc.setFontSize(9);
  doc.setTextColor(70);
  const addr = order.address || {};
  doc.text(`${addr.name || "Customer"}`, 14, 54);
  doc.text(`${addr.street || ""}`, 14, 59);
  doc.text(`${addr.city || ""}, ${addr.state || ""} - ${addr.zip || ""}`, 14, 64);
  doc.text(`Phone: ${addr.phone || "N/A"}`, 14, 69);

  // Items Table
  const tableRows = (order.orderItems || []).map((item, index) => [
    index + 1,
    item.product?.name || "Product",
    `${currency}${item.price}`,
    item.quantity,
    `${currency}${(item.price * item.quantity).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 76,
    head: [["#", "Item Description", "Unit Price", "Qty", "Total"]],
    body: tableRows,
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 90 },
      2: { cellWidth: 28, halign: "right" },
      3: { cellWidth: 20, halign: "center" },
      4: { cellWidth: 32, halign: "right" },
    },
  });

  // Total Summary Box
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.setTextColor(30);

  doc.text("Subtotal:", 140, finalY);
  doc.text(`${currency}${order.total}`, 180, finalY, { align: "right" });

  doc.text("Shipping Fee:", 140, finalY + 6);
  doc.text("FREE", 180, finalY + 6, { align: "right" });

  doc.setFontSize(12);
  doc.setTextColor(37, 99, 235);
  doc.text("Grand Total:", 140, finalY + 14);
  doc.text(`${currency}${order.total}`, 180, finalY + 14, { align: "right" });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(140);
  doc.text("Thank you for shopping with GoCart! For support, contact support@gocart.com", 14, 285);

  // Trigger Save/Download
  doc.save(`Invoice_${invoiceNo}.pdf`);
};