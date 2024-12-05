import asyncHandler from "../middlewares/asyncHandler";
import { Request, Response } from "express";
import { ReserveService } from "../services/reserve.service";

const reserveService = new ReserveService();
export const reserveBook = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const { message } = await reserveService.reserveBook(userId, req.body);
  res.status(201).json({ message, data: [] });
});

export const cancelReservedBook = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const reserveId = req.params.id;
    const { message } = await reserveService.cancelReservedBook(
      userId,
      reserveId
    );
    res.status(200).json({ message, data: [] });
  }
);
