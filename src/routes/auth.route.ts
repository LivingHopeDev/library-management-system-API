import { Router } from "express";
import { validateData } from "../middlewares";
import { loginSchema, SignUpSchema } from "../schema/user.schema";
import { forgetPassword, login, resetPassword, signUp } from "../controllers";
const authRouter: Router = Router();

authRouter.post("/register", validateData(SignUpSchema), signUp);
authRouter.post("/login", validateData(loginSchema), login);
authRouter.post("/password/reset", resetPassword);
authRouter.post("/password/email-request", forgetPassword);

export { authRouter };
