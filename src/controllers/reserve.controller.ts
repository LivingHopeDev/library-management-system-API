import asyncHandler from "../middlewares/asyncHandler";
import { Request, Response } from "express";
import { ReserveService } from "../services/reserve.service";

const reserveService = new ReserveService();
export const reserveBook = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const { message } = await reserveService.reserveBook(userId, req.body);
  res.status(201).json({ message, data: [] });
});
