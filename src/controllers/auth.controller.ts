import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { AuthService, OtpService } from "../services";

const authService = new AuthService();
const otpService = new OtpService();
export const signUp = asyncHandler(async (req: Request, res: Response) => {
  const { message, user } = await authService.signUp(req.body);
  res.status(201).json({ status: 201, message, data: { user } });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { message, user, token } = await authService.login(req.body);
  res.status(200).json({ status: 200, message, data: { token, user } });
});

export const forgetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const { message } = await authService.forgotPassword(email);

    return res.status(200).json({ status_code: 200, message });
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, new_password, confirm_password } = req.body;

    const { message } = await authService.resetPassword(
      token,
      new_password,
      confirm_password
    );

    return res.status(200).json({ status_code: 200, message });
  }
);

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  const { message } = await otpService.verifyOtp(token);
  res.status(200).json({
    status_code: 200,
    message,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  debugger;
});
