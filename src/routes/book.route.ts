import { Router } from "express";
import {
  addBook,
  borrowBook,
  deleteBook,
  getBookById,
  getBooks,
  renewBook,
  returnBook,
  updateBook,
} from "../controllers/book.controller";
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
