import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// 🔹 Generate Two Tokens: Short-Lived and Long-Lived
export const generateTokens = (admin, rememberMe = false) => {
  const shortLivedToken = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Short-lived token
  );

  const longLivedToken = rememberMe
    ? jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: "15d" } // Long-lived token
      )
    : null;

  return { shortLivedToken, longLivedToken };
};

// ✅ JWT Verification (for server context)
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.warn("Invalid or expired JWT:", err.message);
    return null;
  }
};

// ✅ Password Comparison
export const comparePassword = async (input, hash) => {
  console.log("🔐 Comparing password:", input, "WITH HASH:", hash);
  return await bcrypt.compare(input, hash);
};

// ✅ OTP Generation
export const generateSecureOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
};

// ✅ Hash OTP before saving to DB
export const hashOTP = async (otp) => {
  return await bcrypt.hash(otp, 10);
};

// ✅ Verify hashed OTP
export const verifyHashedOTP = async (inputOtp, storedHash) => {
  return await bcrypt.compare(inputOtp, storedHash);
};

// ✅ Nodemailer setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ✅ Send OTP Email
export const sendOTP = async (to, otp) => {
  const mailOptions = {
    from: `"${process.env.SMTP_SENDER_NAME}" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Your OTP Code',
    html: `<h2>OTP Verification</h2>
           <p>Your OTP Code is: <strong>${otp}</strong></p>
           <p>This code is valid for 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

// ✅ General Email Sender
export const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"${process.env.SMTP_SENDER_NAME}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};