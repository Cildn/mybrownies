// routes/paystack.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { generateInvoice } from "../utils/generateInvoice.js";

const prisma = new PrismaClient();
dotenv.config();

const router = express.Router();

// Initialize transaction
router.post('/paystack/initialize', async (req, res) => {
  const { email, amount, reference, callback_url, sessionId } = req.body;

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      { email, amount, reference, callback_url, metadata: { sessionId } },
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' } }
    );

    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error initializing transaction:', error.response?.data || error.message);
    return res.status(500).json({ success: false, error: 'Failed to initialize transaction' });
  }
});

// Verify transaction
router.get('/paystack/verify/:reference', async (req, res) => {
  const { reference } = req.params;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    );

    const { status, data } = response.data;
    // Ensure Paystack call succeeded and transaction is successful
    if (status && data.status === 'success') {
        const cf = Array.isArray(data.metadata?.custom_fields)
        ? data.metadata.custom_fields.find(f => f.variable_name === 'session_id')
        : null;
  
      const sessionId = cf?.value;
      if (!sessionId) {
        return res.status(400).json({ success: false, error: 'Session ID not found in metadata.custom_fields' });
      }
      // Fetch cart items
      const cartItems = await prisma.cartItem.findMany({ where: { sessionId }, include: { product: true } });
      if (!cartItems.length) {
        return res.status(400).json({ success: false, error: 'Cart is empty or already processed' });
      }

      // Build order displayId
      const today = new Date();
      const formattedDate = today.toISOString().slice(0, 10).replace(/-/g, '');
      const siteConfig = await prisma.siteConfig.findUnique({ where: { id: 'site-settings' } });
      if (!siteConfig) return res.status(400).json({ success: false, error: 'Site configuration not found' });
      const newCounter = siteConfig.orderCounter + 1;
      const paddedCounter = String(newCounter).padStart(3, '0');
      const displayId = `ORD-${formattedDate}-${paddedCounter}`;
      await prisma.siteConfig.update({ where: { id: 'site-settings' }, data: { orderCounter: newCounter } });

      // Create order and items
      const order = await prisma.order.create({
        data: {
          status: 'Paid',
          total: parseFloat((data.amount / 100).toFixed(2)),
          displayId,
          orderItems: {
            create: cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.prices[item.selectedSizeIndex] || 0,
              productVariants: `${item.product.name} - ${item.product.sizes[item.selectedSizeIndex]} - ${item.product.colors[item.selectedColorIndex]}`,
            })),
          },
        },
        include: { orderItems: { include: { product: true } } }
      });

      // Generate invoice, clean up cart
      generateInvoice(order, 'receipt');
      await prisma.cartItem.deleteMany({ where: { sessionId } });

      console.log('Transaction successful, order created:', order);
      return res.status(200).json({ success: true, message: 'Transaction successful, order created', order });
    }

    // Transaction failed
    return res.status(400).json({ success: false, message: 'Transaction failed, order NOT created', details: data });
  } catch (error) {
    console.error('Error verifying transaction:', error.response?.data || error.message);
    return res.status(500).json({ success: false, error: 'Failed to verify transaction' });
  }
});

export default router;
