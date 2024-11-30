import { Router } from "express";

const authRouter: Router = Router();

authRouter.post("/register");

export { authRouter };
