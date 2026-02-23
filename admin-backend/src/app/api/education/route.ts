import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Education from "@/lib/models/Education";
import { educationSchema } from "@/lib/validations";
import type { ZodIssue } from "zod";

// Lấy tất cả education
export async function GET() {
  try {
    await connectDB();
    const educations = await Education.find();
    return NextResponse.json({ success: true, data: educations });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Server error", message: error.message },
      { status: 500 },
    );
  }
}

// Tạo education mới
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const validationResult = educationSchema.safeParse(body);

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

    const education = await Education.create(validationResult.data);
    return NextResponse.json({
      success: true,
      data: education,
      message: "Education created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Server error", message: error.message },
      { status: 500 },
    );
  }
}
