export const getBorrowingHistory = `
/**
 * @swagger
 * /api/v1/history:
 *   get:
 *     summary: Get a user's borrowing history
 *     tags: [History]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: The page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: The number of records per page for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: filterBy
 *         in: query
 *         description: The field to filter by (e.g., "bookId")
 *         required: false
 *         schema:
 *           type: string
 *           example: "bookId"
 *       - name: filterValue
 *         in: query
 *         description: The value to filter the field by
 *         required: false
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *       - name: sortBy
 *         in: query
 *         description: The field to sort by
 *         required: false
 *         schema:
 *           type: string
 *           example: "borrowedAt"
 *       - name: sortOrder
 *         in: query
 *         description: The sort order (asc or dsc)
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, dsc]
 *           default: "asc"
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
 *                             description: The ID of the book
 *                             example: "123e4567-e89b-12d3-a456-426614174000"
 *                           borrowedAt:
 *                             type: string
 *                             format: date-time
 *                             description: The date the book was borrowed
 *                             example: "2024-12-01T10:00:00Z"
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages
 *                       example: 5
 *                     page:
 *                       type: integer
 *                       description: The current page number
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       description: The number of records per page
 *                       example: 10
 *       400:
 *         description: Invalid query parameters
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
 *                   example: "Failed to retrieve borrowing history."
 */
`;
