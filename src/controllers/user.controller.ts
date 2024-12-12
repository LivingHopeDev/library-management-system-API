import asyncHandler from "../middlewares/asyncHandler";
import { Request, Response } from "express";
import { UserService } from "../services";

const userService = new UserService();

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id;

    const { message, data } = await userService.updateProfile(userId, req.body);
    res.status(200).json({ message, data });
  }
);

//for admin
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
export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const { message, data } = await userService.updateUserProfile(
      userId,
      req.body
    );
    res.status(200).json({ message, data });
  }
);

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  const { message } = await userService.deleteUser(userId);
  res.status(200).json({ message });
});
