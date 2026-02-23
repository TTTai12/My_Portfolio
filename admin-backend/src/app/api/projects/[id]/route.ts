import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/lib/models/Project";
import { projectUpdateSchema } from "@/lib/validations";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Project not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        message: error.message,
      },
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

    // Validate with partial schema (all fields optional for update)
    const validationResult = projectUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          errors,
        },
        { status: 400 },
      );
    }

    const project = await Project.findByIdAndUpdate(id, validationResult.data, {
      new: true,
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Project not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
      message: "Project updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        message: error.message,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Project not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
