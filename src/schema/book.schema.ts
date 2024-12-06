import { parse } from "path";
import { z } from "zod";

export const BookSchema = z.object({
  title: z.string(),
  description: z.string(),
  genre: z.string(),
  availability: z.boolean(),
  author: z.string(),
  copies: z.number().positive().optional(),
});

export const ReservedBookSchema = z.object({
  bookId: z.string(),
  dateReserved: z
    .string()
    .refine(
      (val) => {
        const parseDate = new Date(val);
        return /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(parseDate.getTime());
      },
      {
        message: "Invalid date format. Please use YYYY-MM-DD format.",
      }
    )
    .refine(
      (val) => {
        const reservedDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return reservedDate.getTime() >= today.getTime(); // Ensure the reserved date is today or in the future
      },
      {
        message: "Enter a future date, or today's date!",
      }
    ),
});
