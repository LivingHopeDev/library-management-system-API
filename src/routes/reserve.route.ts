import { Router } from "express";
import { cancelReservedBook, reserveBook } from "../controllers";
import { authMiddleware, validateData } from "../middlewares";
import { ReservedBookSchema } from "../schema/book.schema";

const reserverRouter = Router();

reserverRouter.post(
  "/",
  validateData(ReservedBookSchema),
  authMiddleware,
  reserveBook
);

reserverRouter.delete("/:id/cancel", authMiddleware, cancelReservedBook);
export { reserverRouter };
