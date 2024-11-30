import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { AuthService } from "../services";

const authService = new AuthService();
export const signUp = asyncHandler(async (req: Request, res: Response) => {
  const { message, user } = await authService.signUp(req.body);
  res.status(201).json({ status: 201, message, data: { user } });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { message, user, token } = await authService.login(req.body);
  res.status(200).json({ status: 200, message, data: { token, user } });
});
