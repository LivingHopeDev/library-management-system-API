import { Router } from "express";
import { validateData } from "../middlewares";
import { loginSchema, SignUpSchema } from "../schema/user.schema";
import { login, signUp } from "../controllers/auth.controller";
const authRouter: Router = Router();

authRouter.post("/register", validateData(SignUpSchema), signUp);
authRouter.post("/login", validateData(loginSchema), login);

export { authRouter };
