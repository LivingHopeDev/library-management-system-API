import asyncHandler from "../middlewares/asyncHandler";
import { Request, Response } from "express";
import { HistoryService } from "../services";
import { string } from "zod";

const historyService = new HistoryService();
export const getBorrowingHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { page, limit, filterBy, filterValue, sortBy, sortOrder } = req.query;

    const filterByStr = typeof filterBy === "string" ? filterBy : undefined;
    const filterValueStr =
      typeof filterValue === "string" ? filterValue : undefined;
    const sortByStr = typeof sortBy === "string" ? sortBy : "borrowedAt";
    const sortOrderStr =
      sortOrder === "asc" || sortOrder === "dsc" ? sortOrder : "asc";

    const { message, borrowedBooks, totalPages } =
      await historyService.getBorrowingHistory(userId, {
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        filterBy: filterByStr,
        filterValue: filterValueStr,
        sortBy: sortByStr,
        sortOrder: sortOrderStr,
      });
    res.status(200).json({
      message,
      data: { borrowedBooks, totalPages, page: page || 1, limit: limit || 10 },
    });
  }
);
