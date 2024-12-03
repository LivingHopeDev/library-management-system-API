import { Router } from "express";
import { validateData } from "../middlewares";
import {
  loginSchema,
  SignUpSchema,
  otpSchema,
  resetPasswordSchema,
} from "../schema/user.schema";
import {
  forgetPassword,
  login,
  resetPassword,
  signUp,
  verifyOtp,
} from "../controllers";
const authRouter: Router = Router();

authRouter.post("/register", validateData(SignUpSchema), signUp);
authRouter.post("/login", validateData(loginSchema), login);
authRouter.post("/password/reset", resetPassword);
authRouter.post(
  "/password/email-request",
  validateData(resetPasswordSchema),
  forgetPassword
);
authRouter.post("/verify-otp", validateData(otpSchema), verifyOtp);

export { authRouter };
