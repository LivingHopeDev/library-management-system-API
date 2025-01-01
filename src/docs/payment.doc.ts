export const payFine = `
/**
 * @swagger
 * /api/v1/payment/fine:
 *   post:
 *     summary: Pay fine for a late book return
 *     tags:
 *       - Payment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *                 example: "user@example.com"
 *               bookId:
 *                 type: string
 *                 description: The ID of the borrowed book
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               preferredCurrency:
 *                 type: string
 *                 description: The currency in which to pay the fine (optional, defaults to NGN)
 *                 example: "NGN"
 *     responses:
 *       201:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment initialized successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Payment request initiated."
 *                     response:
 *                       type: object
 *                       example: { "transactionId": "txn_1234567890", "status": "pending" }
 *       400:
 *         description: Invalid request or data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No record of borrowed book!"
 *       404:
 *         description: Book not found or not borrowed by user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No record of borrowed book!"
 *       409:
 *         description: Fine payment conflict (e.g., book has been returned)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No fine required; book has been returned on time."
 *       500:
 *         description: Internal server error during payment initiation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to initialize payment."
 */
`;

export const verifyPayment = `
/**
 * @swagger
 * /api/v1/payment/verify:
 *   post:
 *     summary: Verify a payment for a fine
 *     tags: 
 *       - Payment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reference:
 *                 type: string
 *                 description: The payment reference to verify
 *                 example: "txn_1234567890"
 *     responses:
 *       201:
 *         description: Payment verified successfully and models updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment verified and processed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     borrowedBook:
 *                       type: object
 *                       description: The updated borrowed book information
 *                       example: 
 *                         bookId: "123e4567-e89b-12d3-a456-426614174000"
 *                         dueDate: "2024-12-31"
 *                     fine:
 *                       type: object
 *                       description: The fine details after payment
 *                       example: 
 *                         amountPaid: 500
 *                         currency: "NGN"
 *       400:
 *         description: Invalid payment reference or verification failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reference is required for payment verification."
 *       404:
 *         description: Payment verification failed or no matching transaction found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment verification failed: Unknown error"
 *       500:
 *         description: Internal server error during payment verification process
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to verify payment."
 */
`;
