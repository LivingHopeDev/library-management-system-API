import { Router } from "express";
import { authMiddleware, validateData } from "../middlewares";
import {
  loginSchema,
  SignUpSchema,
  otpSchema,
  resetPasswordSchema,
} from "../schema/user.schema";
import {
  forgetPassword,
  login,
  logout,
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
authRouter.post("/password/email-request", forgetPassword);
authRouter.post("/verify-otp", validateData(otpSchema), verifyOtp);
authRouter.post("/logout", authMiddleware, logout);

export { authRouter };
