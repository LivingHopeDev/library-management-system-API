import { Router } from "express";
import { cancelReservedBook, reserveBook } from "../controllers";
import { authMiddleware, validateData } from "../middlewares";

const transactionRouter = Router();

transactionRouter.post("/", authMiddleware, reserveBook);

// transactionRouter.delete("/:id", authMiddleware, cancelReservedBook);
export { transactionRouter };
