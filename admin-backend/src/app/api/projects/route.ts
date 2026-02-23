import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/lib/models/Project";
import { projectSchema } from "@/lib/validations";
import type { ZodIssue } from "zod";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate request body with Zod
    const validationResult = projectSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: ZodIssue) => ({
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

    // Create project with validated data
    const project = await Project.create(validationResult.data);

    return NextResponse.json({
      success: true,
      data: project,
      message: "Project created successfully",
    });
  } catch (error: any) {
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate entry",
          message: error.message,
        },
        { status: 409 },
      );
    }

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

export async function GET() {
  await connectDB();
  const projects = await Project.find();
  return NextResponse.json(projects);
}
