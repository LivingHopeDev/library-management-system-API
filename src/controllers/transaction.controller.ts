import asyncHandler from "../middlewares/asyncHandler";
import { Request, Response } from "express";
import { TransactionService } from "../services";

const transactionService = new TransactionService();
export const getTransaction = asyncHandler(
  async (req: Request, res: Response) => {
    const {} = await transactionService.payFine();
    //   res.status(201).json({ message, data: book });
  }
);
