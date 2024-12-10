import asyncHandler from "../middlewares/asyncHandler";
import { Request, Response } from "express";
import { UserService } from "../services";

const userService = new UserService();
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const { message, users, totalPages } = await userService.getAllUsers({
    page: page ? parseInt(page as string, 10) : undefined,
    limit: limit ? parseInt(limit as string, 10) : undefined,
  });
  res.status(200).json({
    message,
    data: users,
    totalPages,
    page: page || 1,
    limit: limit || 10,
  });
});
