import { Router } from "express";
import { authMiddleware, validateData } from "../middlewares";
import {
  loginSchema,
  SignUpSchema,
  otpSchema,
  resetPasswordSchema,
  resendOtpSchema,
} from "../schema/user.schema";
import {
  forgetPassword,
  login,
  logout,
  resendOtp,
  resetPassword,
  signUp,
  verifyOtp,
} from "../controllers";
const authRouter: Router = Router();

authRouter.post("/register", validateData(SignUpSchema), signUp);
authRouter.post("/login", validateData(loginSchema), login);
authRouter.post(
  "/password/reset",
  validateData(resetPasswordSchema),
  resetPassword
);
authRouter.post(
  "/password/email-request",
  validateData(resendOtpSchema),
  forgetPassword
);
authRouter.post("/verify-otp", validateData(otpSchema), verifyOtp);
authRouter.post("/resend-otp", validateData(resendOtpSchema), resendOtp);

authRouter.post("/logout", authMiddleware, logout);

export { authRouter };
