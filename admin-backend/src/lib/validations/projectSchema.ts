import { z } from "zod";

/**
 * Project validation schema
 * Validates all required fields for creating/updating projects
 */
export const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .trim(),

  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters")
    .trim(),

  tech: z
    .array(z.string().trim())
    .min(1, "At least one technology is required")
    .max(20, "Maximum 20 technologies allowed"),

  image: z.string().trim().default(""),

  codeUrl: z
    .string()
    .url("Code URL must be a valid URL")
    .or(z.literal(""))
    .transform((val) => val || ""),

  liveUrl: z
    .string()
    .url("Live URL must be a valid URL")
    .or(z.literal(""))
    .transform((val) => val || ""),
});

/**
 * Partial schema for updates (all fields optional)
 */
export const projectUpdateSchema = projectSchema.partial();

/**
 * TypeScript type inferred from schema
 */
export type ProjectValidation = z.infer<typeof projectSchema>;
