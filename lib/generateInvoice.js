import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (order) => {
  const doc = new jsPDF();
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

  // Company Brand Header
  doc.setFontSize(22);
  doc.setTextColor(16, 185, 129); // Emerald #10b981
  doc.text('gocart.', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Smart, Fast & Seamless Commerce', 14, 26);
  doc.text('Tax Invoice / Bill of Supply', 14, 31);

  // Invoice Meta
  doc.setFontSize(10);
  doc.setTextColor(50);
  doc.text(`Invoice ID: INV-${order?.id?.slice(-8)?.toUpperCase() || 'DEFAULT'}`, 140, 20);
  doc.text(`Order Date: ${new Date(order?.createdAt || Date.now()).toLocaleDateString()}`, 140, 26);
  doc.text(`Payment Status: ${order?.isPaid ? 'PAID' : 'PENDING / COD'}`, 140, 31);

  doc.setDrawColor(220, 220, 220);
  doc.line(14, 36, 196, 36);

  // Customer / Delivery Address
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text('Deliver To:', 14, 44);
  doc.setFontSize(9);
  doc.setTextColor(80);
  const addr = order?.address;
  doc.text(`${addr?.fullName || order?.user?.name || 'Valued Customer'}`, 14, 50);
  doc.text(`${addr?.street || addr?.address || 'Shipping Address Not Specified'}`, 14, 55);
  doc.text(`${addr?.city || 'Bareilly'}, ${addr?.state || 'UP'} - ${addr?.pincode || addr?.zip || '243001'}`, 14, 60);
  doc.text(`Phone: ${addr?.phone || order?.user?.phone || '+91 8433210134'}`, 14, 65);

  // Products Table
  const tableData = (order?.orderItems || order?.items || []).map((item, idx) => [
    idx + 1,
    item?.product?.name || item?.name || 'Product item',
    `${currency}${item?.price || 0}`,
    item?.quantity || 1,
    `${currency}${(item?.price || 0) * (item?.quantity || 1)}`,
  ]);

  autoTable(doc, {
    startY: 72,
    head: [['#', 'Item Description', 'Unit Price', 'Qty', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [11, 15, 23], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  // Summary Breakdown
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(`Subtotal: ${currency}${order?.totalAmount || order?.amount || 0}`, 140, finalY);
  doc.text('Shipping: Free', 140, finalY + 6);
  doc.setFontSize(12);
  doc.setTextColor(16, 185, 129);
  doc.text(`Final Total: ${currency}${order?.totalAmount || order?.amount || 0}`, 140, finalY + 14);

  // Footer note
  doc.setFontSize(8);
  doc.setTextColor(140);
  doc.text('Thank you for choosing GoCart! For support: contact@gocart.com', 14, 280);

  // Download trigger
  doc.save(`GoCart_Invoice_${order?.id?.slice(-8) || 'Order'}.pdf`);
};