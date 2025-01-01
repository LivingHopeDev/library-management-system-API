import { Router } from "express";
import {
  getAllTransactions,
  getTransactionById,
  deleteTransaction,
} from "../controllers";
import { adminMiddleware, authMiddleware, validateData } from "../middlewares";

const transactionRouter = Router();

transactionRouter.get("/", authMiddleware, getAllTransactions);
transactionRouter.get("/me", authMiddleware, getAllTransactions); // For Users

transactionRouter.get("/:id", authMiddleware, getTransactionById);
transactionRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteTransaction
);

export { transactionRouter };
