import { z } from "zod";

/**
 * Message validation schema (for contact form)
 */
export const messageSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),

  email: z
    .string()
    .email("Invalid email address")
    .trim()
    .toLowerCase(),

  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject must be less than 200 characters")
    .trim(),

  content: z
    .string()
    .min(1, "Message content is required")
    .max(5000, "Message must be less than 5000 characters")
    .trim(),
});

/**
 * TypeScript type inferred from schema
 */
export type MessageValidation = z.infer<typeof messageSchema>;
