import { Router } from "express";
import {
  addBook,
  borrowBook,
  deleteBook,
  getAllBorrowedBooks,
  getBookById,
  getBooks,
  getBorrowedBooks,
  renewBook,
  returnBook,
  updateBook,
} from "../controllers";
import { adminMiddleware, authMiddleware, validateData } from "../middlewares";
import { BookSchema } from "../schema/book.schema";

const bookRouter = Router();

bookRouter.post(
  "/",
  validateData(BookSchema),
  authMiddleware,
  adminMiddleware,
  addBook
);
bookRouter.get("/", authMiddleware, getBooks);
bookRouter.get("/borrow/retrieve", authMiddleware, getBorrowedBooks);
bookRouter.get(
  "/borrow/retrieve-all",
  authMiddleware,
  adminMiddleware,
  getAllBorrowedBooks
);

bookRouter.get("/:id", authMiddleware, getBookById);

bookRouter.patch(
  "/:id",
  validateData(BookSchema),
  authMiddleware,
  adminMiddleware,
  updateBook
);

bookRouter.delete("/:id", authMiddleware, adminMiddleware, deleteBook);

bookRouter.post("/borrow", authMiddleware, borrowBook);
bookRouter.post("/return", authMiddleware, returnBook);
bookRouter.post("/renew", authMiddleware, renewBook);

export { bookRouter };
