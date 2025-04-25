import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

/**
 * Generates a PDF Invoice or Receipt for Les Brownies
 * @param {Object} order - Full order data with orderItems populated
 * @param {String} type - "invoice" or "receipt"
 * @returns {String} - Relative path to the generated PDF
 */
export const generateInvoice = (order, type = "invoice") => {
  const dir = path.resolve("public/uploads/records", "invoices");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const fileName = `${type}-${order.displayId}.pdf`;
  const filePath = path.join(dir, fileName);
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(fs.createWriteStream(filePath));

  // === BRAND HEADER ===
  // Logo at the top
  const logoPath = path.resolve("public", "logo.png");
  doc.image(logoPath, { width: 100, align: "center", valign: "center" }).moveDown(0.5);

  // Brand Name
  doc
    .fontSize(24)
    .text("Les Brownies", { align: "center", bold: true })
    .fontSize(12)
    .fillColor("#666")
    .text("www.mybrownies.com.ng", { align: "center", underline: true })
    .moveDown(1.5)
    .fillColor("#000");

  // === INVOICE INFO ===
  doc.fontSize(18).text(type.toUpperCase(), { align: "center" }).moveDown(0.5);
  doc
    .fontSize(12)
    .text(`Order ID: ${order.displayId}`)
    .text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-GB")}`)
    .text(`Status: ${order.status}`)
    .moveDown(1);

  // === ORDER ITEMS ===
  doc.fontSize(14).text("Order Summary:", { underline: true }).moveDown(0.5);
  order.orderItems.forEach((item, i) => {
    const name = item.product?.name || item.collection?.name || "Unknown Item";
    doc
      .fontSize(12)
      .text(`${i + 1}. ${name} — Qty: ${item.quantity} — NGN${item.price.toLocaleString()}`);
  });

  // === TOTALS ===
  const subtotal = order.orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = 0; // Add logic later if needed
  const tax = 0; // Placeholder if taxes apply

  doc
    .moveDown(1)
    .fontSize(12)
    .text(`Subtotal: NGN${subtotal.toLocaleString()}`, { align: "right" })
    .text(`Shipping: NGN${shipping.toLocaleString()}`, { align: "right" })
    .text(`Tax: NGN${tax.toLocaleString()}`, { align: "right" })
    .moveDown(0.5)
    .fontSize(14)
    .text(`Total: NGN${order.total.toLocaleString()}`, { align: "right", bold: true });

  // === PAYMENT METHOD (Optional) ===
  doc
    .moveDown(1)
    .fontSize(12)
    .text("Payment Method: Online Payment", { align: "left" }); // Adjust if needed

  // === FOOTER ===
  doc
    .moveDown(2)
    .fontSize(10)
    .fillColor("#555")
    .text("Thank you for shopping with Les Brownies!", { align: "center" })
    .text("For returns and inquiries, visit www.mybrownies.com.ng", { align: "center" });

  doc.end();
  return `/invoices/${fileName}`;
};
