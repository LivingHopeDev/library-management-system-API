"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservedBookSchema = exports.BookSchema = void 0;
const zod_1 = require("zod");
exports.BookSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    genre: zod_1.z.string(),
    availability: zod_1.z.boolean(),
    author: zod_1.z.string(),
    copies: zod_1.z.number().positive().optional(),
});
exports.ReservedBookSchema = zod_1.z.object({
    bookId: zod_1.z.string(),
    dateReserved: zod_1.z
        .string()
        .refine((val) => {
        const parseDate = new Date(val);
        return /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(parseDate.getTime());
    }, {
        message: "Invalid date format. Please use YYYY-MM-DD format.",
    })
        .refine((val) => {
        const reservedDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return reservedDate.getTime() >= today.getTime(); // Ensure the reserved date is today or in the future
    }, {
        message: "Enter a future date, or today's date!",
    }),
});
const borrowedBookQuerySchema = zod_1.z.object({});
