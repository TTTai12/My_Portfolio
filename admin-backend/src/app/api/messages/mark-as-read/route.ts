// src/app/api/messages/read-all/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/lib/models/Message";
import mongoose from "mongoose";

type Payload = { ids?: string[] };

export async function PATCH(req: Request) {
  await connectDB();

  const body = (await req.json().catch(() => ({}))) as Payload;
  const ids = Array.isArray(body.ids) ? body.ids : [];

  // Nếu truyền ids: cập nhật những tin đó
  if (ids.length) {
    const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (!validIds.length) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }
    const res = await Message.updateMany(
      { _id: { $in: validIds } },
      { $set: { read: true } }
    );
    return NextResponse.json({ success: true, updated: res.modifiedCount });
  }

  // Nếu không truyền ids: đánh dấu tất cả unread thành đã đọc
  const res = await Message.updateMany(
    { read: false },
    { $set: { read: true } }
  );
  return NextResponse.json({ success: true, updated: res.modifiedCount });
}
