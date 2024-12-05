import { Router } from "express";
import { reserveBook } from "../controllers";
import { authMiddleware, validateData } from "../middlewares";
import { ReservedBookSchema } from "../schema/book.schema";

const reserverRouter = Router();

reserverRouter.post(
  "/",
  validateData(ReservedBookSchema),
  authMiddleware,
  reserveBook
);

export { reserverRouter };
