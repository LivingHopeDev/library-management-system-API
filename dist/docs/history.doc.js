"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBorrowingHistory = void 0;
exports.getBorrowingHistory = `
/**
 * @swagger
 * /api/v1/history:
 *   get:
 *     summary: Retrieve borrowing history for a user
 *     tags: [Borrowing History]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           description: The page number to retrieve (default is 1)
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: The number of records to return per page (default is 10)
 *           example: 10
 *     responses:
 *       200:
 *         description: Borrowing history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Retrieved all borrowed books history successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     borrowedBooks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           bookId:
 *                             type: string
 *                             example: "123e4567-e89b-12d3-a456-426614174000"
 *                           bookTitle:
 *                             type: string
 *                             example: "The Great Gatsby"
 *                           borrowedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-01-01T00:00:00.000Z"
 *                           dueDate:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-01-15T00:00:00.000Z"
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid query parameters"
 *       404:
 *         description: No borrowing history found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No borrowing history found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve borrowing history"
 */
`;
