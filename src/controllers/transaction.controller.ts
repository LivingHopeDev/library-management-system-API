import asyncHandler from "../middlewares/asyncHandler";
import { Request, Response } from "express";
import { TransactionService } from "../services";

const transactionService = new TransactionService();

// For Users
export const getUserTransactions = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const userId = req.user.id;
    const transactions = await transactionService.getUserTransactions(
      Number(page) || 1,
      Number(limit) || 10,
      userId
    );
    res.json(transactions);
  }
);
// For Admin
export const getAllTransactions = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const transactions = await transactionService.getAllTransactions(
      Number(page) || 1,
      Number(limit) || 10
    );
    res.json(transactions);
  }
);
export const getTransactionById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const transaction = await transactionService.getTransactionById(id);
    res.json(transaction);
  }
);
export const deleteTransaction = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const message = await transactionService.deleteTransaction(id);
    res.json(message);
  }
);
