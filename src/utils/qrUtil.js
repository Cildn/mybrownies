import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import PDFDocument from "pdfkit";

const prisma = new PrismaClient();

export const generateQRCodes = async (count) => {
  const dir = 'public/uploads/qr-codes';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const qrCodesWithImages = [];
  const qrCodesPerRow = 3;
  const qrCodesPerCol = 3;

  for (let i = 0; i < count; i++) {
    const code = Math.random().toString(36).substring(2, 15);
    const url = `https://www.mybrownies.com.ng/brownie-city/ticket/${code}`;
    const imageUrl = await QRCode.toDataURL(url);

    const qrCode = await prisma.qRCode.create({
      data: {
        code
      },
    });

    qrCodesWithImages.push({
      ...qrCode,
      imageUrl
    });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const fileName = `qr-codes-${timestamp}.pdf`;
  const filePath = path.join(dir, fileName);
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(filePath));

  // Create title
  doc
    .fontSize(18)
    .text('Brownie City QR Codes', { align: 'center' })
    .moveDown(1);

  // Create grid layout for A4 size with smaller text
  qrCodesWithImages.forEach((qr, index) => {
    if (index % (qrCodesPerRow * qrCodesPerCol) === 0 && index !== 0) {
      doc.addPage();
    }

    const col = index % qrCodesPerRow;
    const row = Math.floor(index / qrCodesPerRow) % qrCodesPerCol;
    const x = 50 + col * 150;
    const y = 100 + row * 150;

    doc.image(qr.imageUrl, x, y, { width: 100, height: 100 });

    // Smaller text size
    doc.fontSize(8).text(`https://www.mybrownies.com.ng/brownie-city/ticket/${qr.code}`, x, y + 95, { width: 100, align: 'center' });
  });

  doc.end();
  return qrCodesWithImages;
};