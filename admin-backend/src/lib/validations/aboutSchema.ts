import { z } from "zod";

/**
 * About/Profile validation schema
 */
export const aboutSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),

  bio: z
    .string()
    .min(1, "Bio is required")
    .max(1000, "Bio must be less than 1000 characters")
    .trim(),

  avatar: z
    .string()
    .url("Avatar must be a valid URL")
    .or(z.literal(""))
    .transform((val) => val || ""),

  location: z
    .string()
    .min(1, "Location is required")
    .max(100, "Location must be less than 100 characters")
    .trim(),

  email: z
    .string()
    .email("Invalid email address")
    .trim()
    .toLowerCase(),

  phone: z
    .string()
    .min(1, "Phone is required")
    .max(20, "Phone must be less than 20 characters")
    .trim(),

  experienceYears: z
    .number()
    .int("Experience years must be an integer")
    .min(0, "Experience years must be at least 0")
    .max(50, "Experience years must be less than 50"),

  projectsCompleted: z
    .number()
    .int("Projects completed must be an integer")
    .min(0, "Projects completed must be at least 0")
    .max(10000, "Projects completed must be less than 10000"),
});

/**
 * Partial schema for updates
 */
export const aboutUpdateSchema = aboutSchema.partial();

/**
 * TypeScript type inferred from schema
 */
export type AboutValidation = z.infer<typeof aboutSchema>;
