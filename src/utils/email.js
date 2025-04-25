import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// 🔹 Generate a 6-digit secure random OTP
export const generateSecureOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// 🔹 Hash OTP securely
export const hashOTP = async (otp) => {
  return await bcrypt.hash(otp, 10);
};

// 🔹 Verify input OTP against stored hash
export const verifyHashedOTP = async (inputOtp, storedHash) => {
  return await bcrypt.compare(inputOtp, storedHash);
};

// 🔹 Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 🔹 Send OTP email
export const sendOTP = async (to, otp) => {
  const mailOptions = {
    from: `"${process.env.SMTP_SENDER_NAME}" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Your OTP Code',
    html: 
      `<h2>OTP Verification</h2>
      <p>Your OTP Code is: <strong>${otp}</strong></p>
      <p>This code is valid for 10 minutes.</p>`
    ,
  };

  await transporter.sendMail(mailOptions);
};

// 🔹 General email sender
export const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"${process.env.SMTP_SENDER_NAME}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};