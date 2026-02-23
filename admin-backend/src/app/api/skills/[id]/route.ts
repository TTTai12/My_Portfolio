import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Skill from "@/lib/models/Skill";
import mongoose from "mongoose";
import { skillUpdateSchema } from "@/lib/validations";

export async function GET(req: Request, context: any) {
  try {
    await connectDB();
    const params =
      typeof context.params.then === "function"
        ? await context.params
        : context.params;
    const id = params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID", message: "Invalid ID format" },
        { status: 400 },
      );
    }

    const item = await Skill.findById(id);

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Not found", message: "Skill not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Server error", message: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request, context: any) {
  try {
    await connectDB();
    const params =
      typeof context.params.then === "function"
        ? await context.params
        : context.params;
    const id = params.id;
    const body = await req.json();

    const validationResult = skillUpdateSchema.safeParse(body);

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

    const updated = await Skill.findByIdAndUpdate(id, validationResult.data, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Not found", message: "Skill not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Skill updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Server error", message: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request, context: any) {
  await connectDB();
  const params =
    typeof context.params.then === "function"
      ? await context.params
      : context.params;
  const id = params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  await Skill.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
