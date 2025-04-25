// utils/generateOrdersCSV.js
import fs from 'fs';
import path from 'path';
import { Parser } from 'json2csv';

export const generateOrdersCSV = async (orders) => {
  const csvDir = path.resolve('public', 'exports');
  if (!fs.existsSync(csvDir)) fs.mkdirSync(csvDir, { recursive: true });

  const csvPath = path.join(csvDir, `orders-${Date.now()}.csv`);

  const data = orders.map(order => ({
    OrderID: order.id,
    Status: order.status,
    Total: order.total,
    CreatedAt: new Date(order.createdAt).toLocaleDateString(),
    Items: order.orderItems.map(i => `${i.product?.name || i.collection?.name} (x${i.quantity})`).join('; ')
  }));

  const json2csv = new Parser();
  const csv = json2csv.parse(data);
  fs.writeFileSync(csvPath, csv);

  return `/exports/${path.basename(csvPath)}`; // ✅ Relative path
};