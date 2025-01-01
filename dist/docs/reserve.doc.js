"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelReservedBook = exports.reserveBook = void 0;
exports.reserveBook = `
/**
 * @swagger
 * /api/v1/reserve:
 *   post:
 *     summary: Reserve a book
 *     tags: [Reserve]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *                 description: The ID of the book to reserve
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               dateReserved:
 *                 type: string
 *                 format: date-time
 *                 description: The date the book is reserved
 *                 example: "2024-12-31T10:00:00Z"
 *     responses:
 *       201:
 *         description: Book reserved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book reserved successfully"
 *                 data:
 *                   type: array
 *                   example: []
 *       400:
 *         description: Invalid data or request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No available copies to reserve."
 *       409:
 *         description: Conflict (e.g., user already reserved or borrowed the book)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You have already reserved this book!"
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to reserve the book"
 */
`;
exports.cancelReservedBook = `
/**
 * @swagger
 * /api/v1/reserve/{id}/cancel:
 *   delete:
 *     summary: Cancel a reserved book
 *     tags: [Reserve]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the reservation to cancel
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Reservation successfully canceled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book reservation has been cancelled successfully."
 *                 data:
 *                   type: array
 *                   example: []
 *       400:
 *         description: Invalid request or data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid reserve ID."
 *       404:
 *         description: Reservation not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You didn't reserve this book!"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to cancel reservation."
 */
`;
