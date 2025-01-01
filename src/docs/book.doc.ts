export const addBook = `
/**
 * @swagger
 * /api/v1/books:
 *   post:
 *     summary: Add a new book to the collection
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Great Gatsby"
 *               author:
 *                 type: string
 *                 example: "F. Scott Fitzgerald"
 *               genre:
 *                 type: string
 *                 example: "Classic Literature"
 *               publishedDate:
 *                 type: string
 *                 format: date
 *                 example: "1925-04-10"
 *               totalCopies:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: The book was successfully added to the collection
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     author:
 *                       type: string
 *                     genre:
 *                       type: string
 *                     publishedDate:
 *                       type: string
 *                       format: date
 *                     totalCopies:
 *                       type: number
 *                     availableCopies:
 *                       type: number
 *       400:
 *         description: Bad request, invalid input data
 *       500:
 *         description: Some server error
 */
`;

export const getBooks = `
/**
 * @swagger
 * /api/v1/books:
 *   get:
 *     summary: Retrieve a list of books with optional filters
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: The number of books per page
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *           example: "Science Fiction"
 *         description: Filter books by genre
 *       - in: query
 *         name: availability
 *         schema:
 *           type: string
 *           enum: [true, false]
 *           example: "true"
 *         description: Filter books by availability
 *     responses:
 *       200:
 *         description: A list of books matching the query criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Books retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     books:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           author:
 *                             type: string
 *                           genre:
 *                             type: string
 *                           publishedDate:
 *                             type: string
 *                             format: date
 *                           totalCopies:
 *                             type: number
 *                           availableCopies:
 *                             type: number
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
 *         description: Bad request, invalid query parameters
 *       404:
 *         description: No books match the specified criteria
 *       500:
 *         description: Some server error
 */
`;

export const getBookById = `
/**
 * @swagger
 * /api/v1/books/{id}:
 *   get:
 *     summary: Retrieve a specific book by its ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: The ID of the book to retrieve
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     title:
 *                       type: string
 *                       example: "The Catcher in the Rye"
 *                     author:
 *                       type: string
 *                       example: "J.D. Salinger"
 *                     genre:
 *                       type: string
 *                       example: "Classic Literature"
 *                     publishedDate:
 *                       type: string
 *                       format: date
 *                       example: "1951-07-16"
 *                     totalCopies:
 *                       type: number
 *                       example: 10
 *                     availableCopies:
 *                       type: number
 *                       example: 4
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
 *         description: Some server error
 */
`;

export const updateBook = `
/**
 * @swagger
 * /api/v1/books/{id}:
 *   patch:
 *     summary: Update a specific book by its ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: The ID of the book to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Book Title"
 *               author:
 *                 type: string
 *                 example: "Updated Author Name"
 *               genre:
 *                 type: string
 *                 example: "Updated Genre"
 *               publishedDate:
 *                 type: string
 *                 format: date
 *                 example: "2000-01-01"
 *               totalCopies:
 *                 type: number
 *                 example: 15
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     author:
 *                       type: string
 *                     genre:
 *                       type: string
 *                     publishedDate:
 *                       type: string
 *                       format: date
 *                     totalCopies:
 *                       type: number
 *                     availableCopies:
 *                       type: number
 *       404:
 *         description: Book not found or access denied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book not found or access denied"
 *       500:
 *         description: Some server error
 */
`;

export const deleteBook = `
/**
 * @swagger
 * /api/v1/books/{id}:
 *   delete:
 *     summary: Delete a specific book by its ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: The ID of the book to delete
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book deleted successfully"
 *       404:
 *         description: Book not found or access denied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book not found or access denied"
 *       500:
 *         description: Some server error
 */
`;

export const borrowBook = `
/**
 * @swagger
 * /api/v1/books/borrow:
 *   post:
 *     summary: Borrow a book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *             required:
 *               - bookId
 *     responses:
 *       201:
 *         description: Book borrowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Book borrowed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     book:
 *                       type: object
 *                       properties:
 *                         title:
 *                           type: string
 *                           example: "The Great Gatsby"
 *                         author:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                               example: "F. Scott Fitzgerald"
 *                         genre:
 *                           type: string
 *                           example: "Classic Literature"
 *                         description:
 *                           type: string
 *                           example: "A novel set in the Jazz Age about the enigmatic Jay Gatsby."
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-01-01T10:00:00.000Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-01-15T10:00:00.000Z"
 *                         availability:
 *                           type: boolean
 *                           example: true
 *                         copies:
 *                           type: number
 *                           example: 4
 *                     dateBorrow:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-31T12:00:00.000Z"
 *                     expectedReturnDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-14T12:00:00.000Z"
 *                     borrowedBy:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         email:
 *                           type: string
 *                           example: "john.doe@example.com"
 *       409:
 *         description: The book is already borrowed or no copies are available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No copies available for this book."
 *       404:
 *         description: Book or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book not found."
 *       500:
 *         description: Some server error
 */
`;

export const getBorrowedBooks = `
/**
 * @swagger
 * /api/v1/books/borrow/retrieve:
 *   get:
 *     summary: Retrieve the list of books borrowed by the authenticated user
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: The number of items per page for pagination
 *     responses:
 *       200:
 *         description: List of borrowed books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Borrowed books retrieved"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       book:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                             example: "The Great Gatsby"
 *                           author:
 *                             type: string
 *                             example: "F. Scott Fitzgerald"
 *                           genre:
 *                             type: string
 *                             example: "Classic Literature"
 *                           description:
 *                             type: string
 *                             example: "A novel set in the Jazz Age about the enigmatic Jay Gatsby."
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-01-01T10:00:00.000Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-01-15T10:00:00.000Z"
 *                       borrowedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-31T12:00:00.000Z"
 *                       dueDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-14T12:00:00.000Z"
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *       404:
 *         description: No borrowed books found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No book has been borrowed"
 *       500:
 *         description: Some server error
 */
`;
export const getAllBorrowedBooks = `
/**
 * @swagger
 * /api/v1/books/borrow/retrieve-all:
 *   get:
 *     summary: Retrieve the list of all borrowed books (admin)
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: The number of items per page for pagination
 *     responses:
 *       200:
 *         description: List of all borrowed books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Borrowed books retrieved"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       book:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                             example: "The Great Gatsby"
 *                           author:
 *                             type: string
 *                             example: "F. Scott Fitzgerald"
 *                           genre:
 *                             type: string
 *                             example: "Classic Literature"
 *                           description:
 *                             type: string
 *                             example: "A novel set in the Jazz Age about the enigmatic Jay Gatsby."
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-01-01T10:00:00.000Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-01-15T10:00:00.000Z"
 *                       borrowedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-31T12:00:00.000Z"
 *                       dueDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-14T12:00:00.000Z"
 *                       borrowedBy:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           email:
 *                             type: string
 *                             example: "john.doe@example.com"
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *       404:
 *         description: No borrowed books found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No book has been borrowed"
 *       500:
 *         description: Some server error
 */
`;

export const returnBook = `
/**
 * @swagger
 * /api/v1/books/return:
 *   post:
 *     summary: Return a borrowed book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: The book was returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Book returned successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     book:
 *                       type: object
 *                       properties:
 *                         title:
 *                           type: string
 *                           example: "The Great Gatsby"
 *                         author:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "123e4567-e89b-12d3-a456-426614174001"
 *                             name:
 *                               type: string
 *                               example: "F. Scott Fitzgerald"
 *                         genre:
 *                           type: string
 *                           example: "Classic Literature"
 *                         description:
 *                           type: string
 *                           example: "A novel set in the Jazz Age about the enigmatic Jay Gatsby."
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-01-01T10:00:00.000Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-01-15T10:00:00.000Z"
 *                         availability:
 *                           type: boolean
 *                           example: true
 *                         copies:
 *                           type: integer
 *                           example: 10
 *       400:
 *         description: Return blocked due to overdue fine or missing record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Return blocked: Your book is 5 days overdue. Pay the fine of $5."
 *       404:
 *         description: Borrowed book record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No record of borrowed book!"
 *       500:
 *         description: Some server error
 */
`;
export const renewBook = `
/**
 * @swagger
 * /api/v1/books/renew:
 *   post:
 *     summary: Renew a borrowed book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: The book was renewed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Book renewed successfully. You can borrow the book for 14 more day(s)."
 *                 data:
 *                   type: array
 *                   items: {}
 *       400:
 *         description: Renewal blocked due to overdue book or reserved book conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Your borrow period has expired. Please return the book."
 *       404:
 *         description: Book not found or user hasn't borrowed the book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You have not borrowed this book or it has been returned."
 *       409:
 *         description: Book cannot be renewed due to reservation or overdue status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The book will not be available for renewal."
 *       500:
 *         description: Some server error
 */
`;
