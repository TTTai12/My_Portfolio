// src/app/api/messages/summary/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/lib/models/Message";

export async function GET() {
  try {
    await connectDB();

    const [unreadCount, latestMessages] = await Promise.all([
      Message.countDocuments({ read: false }),
      Message.find({ read: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .select({ name: 1, subject: 1, createdAt: 1, read: 1 }), // chỉ trường cần thiết
    ]);
    console.log("API summary:", { unreadCount, latestMessages });
    return NextResponse.json({
      unreadCount: unreadCount || 0,
      latestMessages: Array.isArray(latestMessages) ? latestMessages : [],
    });
  } catch (err) {
    console.error("summary error:", err);
    // Đảm bảo luôn trả JSON để FE không crash
    return NextResponse.json(
      { unreadCount: 0, latestMessages: [] },
      { status: 500 }
    );
  }
}
