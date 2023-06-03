import { z } from "zod";

export const inputFields = z.object({
  title: z
    .string()
    .min(5, { message: "min 5 characters" })
    .max(50, { message: "max 50 characters" })
    .trim(),
  description: z
    .string()
    .min(5, { message: "min 5 characters" })
    .max(500, { message: "max 500 characters" })
    .trim(),
  id: z.string().optional(),
});
