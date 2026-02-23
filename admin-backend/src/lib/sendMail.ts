// src/lib/sendMail.ts
import nodemailer from "nodemailer";

type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
};

export function createTransporter() {
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.EMAIL_PORT || 465);
  const secure = String(process.env.EMAIL_SECURE || "true") === "true";

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error(
      "Missing EMAIL_USER or EMAIL_PASS in environment variables"
    );
  }

  console.log("📧 Email config:", {
    host,
    port,
    secure,
    user,
    passLength: pass.length, // Log độ dài password để check
  });

  // Khởi tạo transporter với SMTP
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure, // true → dùng SSL/TLS (port 465), false → STARTTLS (port 587)
    auth: { user, pass },
  });

  return transporter;
}

export async function sendMail({
  to,
  subject,
  html,
}: SendMailOptions): Promise<boolean> {
  try {
    console.log("📤 Attempting to send email to:", to);
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    
    console.log("✅ Message sent successfully:", info.messageId);
    return true;
  } catch (err) {
    console.error("❌ sendMail error:", err);
    // Log chi tiết lỗi
    if (err instanceof Error) {
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
    }
    return false;
  }
}

/**
 * Gợi ý: Nếu dùng Gmail, hãy tạo App Password:
 * - Google Account > Security > App passwords
 * - Chọn "Mail" + "Other" (đặt tên) → lấy 16 ký tự app password
 * - Dán vào EMAIL_PASS (KHÔNG có dấu cách)
 */