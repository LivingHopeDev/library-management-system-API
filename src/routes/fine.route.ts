import { Router } from "express";
import { authMiddleware } from "../middlewares";
import { getBorrowingHistory } from "../controllers";

const fineRouter = Router();

fineRouter.get("/", authMiddleware, getBorrowingHistory);

export { fineRouter };
