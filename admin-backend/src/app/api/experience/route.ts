import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Experience from "@/lib/models/Experience";
import { experienceSchema } from "@/lib/validations";
import type { ZodIssue } from "zod";

export async function GET() {
  try {
    await connectDB();
    const items = await Experience.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Server error", message: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const validationResult = experienceSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: ZodIssue) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return NextResponse.json(
        { success: false, error: "Validation failed", errors },
        { status: 400 },
      );
    }

    const item = await Experience.create(validationResult.data);
    return NextResponse.json({
      success: true,
      data: item,
      message: "Experience created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Server error", message: error.message },
      { status: 500 },
    );
  }
}
