import { z } from "zod";

/**
 * Skill validation schema
 */
export const skillSchema = z.object({
  name: z
    .string()
    .min(1, "Skill name is required")
    .max(50, "Skill name must be less than 50 characters")
    .trim(),

  level: z
    .number()
    .int("Level must be an integer")
    .min(0, "Level must be at least 0")
    .max(100, "Level must be at most 100"),
});

/**
 * Partial schema for updates
 */
export const skillUpdateSchema = skillSchema.partial();

/**
 * TypeScript type inferred from schema
 */
export type SkillValidation = z.infer<typeof skillSchema>;
