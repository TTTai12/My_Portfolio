import { z } from "zod";

/**
 * Experience validation schema
 */
export const experienceSchema = z.object({
  company: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name must be less than 100 characters")
    .trim(),

  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position must be less than 100 characters")
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
    .max(2000, "Description must be less than 2000 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  tags: z
    .array(z.string().trim())
    .max(10, "Maximum 10 tags allowed")
    .default([]),
});

/**
 * Partial schema for updates
 */
export const experienceUpdateSchema = experienceSchema.partial();

/**
 * TypeScript type inferred from schema
 */
export type ExperienceValidation = z.infer<typeof experienceSchema>;
