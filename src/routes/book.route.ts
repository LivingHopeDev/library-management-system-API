import { Router } from "express";
import { addBook, getBookById, getBooks } from "../controllers/book.controller";
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
  addBook
);

bookRouter.delete("/:id", authMiddleware, adminMiddleware, addBook);

export { bookRouter };
