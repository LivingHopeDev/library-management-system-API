import { z } from "zod";

export const BookSchema = z.object({
  title: z.string(),
  description: z.string(),
  genre: z.string(),
  availability: z.boolean(),
  author: z.string(),
  copies: z.number().positive().optional(),
});
