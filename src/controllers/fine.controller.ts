import asyncHandler from "../middlewares/asyncHandler";
import { Request, Response } from "express";
import { FineService } from "../services";

const fineService = new FineService();
export const retrieveFines = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user;
    const { page, limit } = req.query;
    const { message, fines, totalPages } = await fineService.retrieveFines(
      userId,
      {
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      }
    );
    res.status(200).json({
      message,
      data: fines,
      totalPages,
      page: page || 1,
      limit: limit || 10,
    });
  }
);
