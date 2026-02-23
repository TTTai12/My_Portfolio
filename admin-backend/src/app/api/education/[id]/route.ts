import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Education from "@/lib/models/Education";
import { educationUpdateSchema } from "@/lib/validations";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const education = await Education.findById(id);

    if (!education) {
      return NextResponse.json(
        { success: false, error: "Not found", message: "Education not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: education });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Server error", message: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await req.json();

    const validationResult = educationUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return NextResponse.json(
        { success: false, error: "Validation failed", errors },
        { status: 400 },
      );
    }

    const education = await Education.findByIdAndUpdate(
      id,
      validationResult.data,
      { new: true },
    );

    if (!education) {
      return NextResponse.json(
        { success: false, error: "Not found", message: "Education not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: education,
      message: "Education updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Server error", message: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await context.params;
  await Education.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted successfully" });
}
