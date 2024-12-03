import { Router } from "express";
import { addBook } from "../controllers/book.controller";
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
bookRouter.get("/", authMiddleware, addBook);
bookRouter.get("/:id", authMiddleware, addBook);

bookRouter.patch(
  "/:id",
  validateData(BookSchema),
  authMiddleware,
  adminMiddleware,
  addBook
);

bookRouter.delete("/:id", authMiddleware, adminMiddleware, addBook);

export { bookRouter };
