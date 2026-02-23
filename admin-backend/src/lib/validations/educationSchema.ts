import { z } from "zod";

/**
 * Education validation schema
 */
export const educationSchema = z.object({
  school: z
    .string()
    .min(1, "School name is required")
    .max(200, "School name must be less than 200 characters")
    .trim(),

  degree: z
    .string()
    .min(1, "Degree is required")
    .max(100, "Degree must be less than 100 characters")
    .trim(),

  field: z
    .string()
    .min(1, "Field of study is required")
    .max(100, "Field must be less than 100 characters")
    .trim(),

  startDate: z
    .string()
    .min(1, "Start date is required")
    .regex(
      /^\d{4}-\d{2}(-\d{2})?$/,
      "Start date must be in YYYY-MM or YYYY-MM-DD format"
    ),

  endDate: z
    .string()
    .min(1, "End date is required")
    .regex(
      /^\d{4}-\d{2}(-\d{2})?$|^Present$/i,
      "End date must be in YYYY-MM, YYYY-MM-DD format, or 'Present'"
    ),

  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .trim()
    .optional()
    .or(z.literal("")),
});

/**
 * Partial schema for updates
 */
export const educationUpdateSchema = educationSchema.partial();

/**
 * TypeScript type inferred from schema
 */
export type EducationValidation = z.infer<typeof educationSchema>;
