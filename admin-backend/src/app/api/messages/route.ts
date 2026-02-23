// src/app/api/messages/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/lib/models/Message";
import { sendMail } from "@/lib/sendMail"; // ← THÊM DÒNG NÀY

// ← THÊM FUNCTION NÀY
function buildEmailHTML(payload: {
  name: string;
  email: string;
  content: string;
  createdAt: Date;
}) {
  const { name, email, content, createdAt } = payload;
  const dateStr = createdAt.toLocaleString("vi-VN", { hour12: false });
  return `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333">
    <h2 style="margin: 0 0 12px; color: #1890ff;">Bạn có tin nhắn mới từ website</h2>
    <p style="margin: 4px 0;"><strong>Tên người gửi:</strong> ${name}</p>
    <p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p>
    <p style="margin: 12px 0;"><strong>Nội dung:</strong></p>
    <div style="padding: 12px; background: #fafafa; border: 1px solid #eee; border-radius: 6px;">
      ${content.replace(/\n/g, "<br />")}
    </div>
    <p style="margin-top: 12px; color: #888;">Thời gian gửi: ${dateStr}</p>
  </div>
  `;
}

export async function GET(req: Request) {
  // ... GIỮ NGUYÊN CODE CŨ ...
  await connectDB();
  const { searchParams } = new URL(req.url);
  const unread = searchParams.get("unread");
  const summary = searchParams.get("summary");

  if (summary === "true") {
    const unreadCount = await Message.countDocuments({ read: false });
    return NextResponse.json({ unreadCount });
  }

  const filter = unread === "true" ? { read: false } : {};
  const messages = await Message.find(filter).sort({ createdAt: -1 });
  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, subject, content } = body || {};

    if (!name || !email || !content) {
      return NextResponse.json(
        { message: "Thiếu trường bắt buộc" },
        { status: 400 },
      );
    }

    // Lưu vào DB
    const doc = await Message.create({
      name,
      email,
      subject: subject || "Liên hệ từ website",
      content,
      read: false,
    });

    // Gửi email thông báo
    const html = buildEmailHTML({
      name,
      email,
      content,
      createdAt: new Date(doc.createdAt),
    });

    const to = process.env.EMAIL_TO || process.env.EMAIL_USER || "";
    if (to) {
      await sendMail({
        to,
        subject: subject || "Bạn có tin nhắn mới từ website",
        html,
      });
    }

    return NextResponse.json({ ok: true, id: doc._id }, { status: 201 });
  } catch (err) {
    console.error("❌ POST /api/messages error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 },
    );
  }
}
