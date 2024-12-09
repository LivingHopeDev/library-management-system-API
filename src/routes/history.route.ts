import { Router } from "express";
import { authMiddleware } from "../middlewares";
import { getBorrowingHistory } from "../controllers";

const historyRouter = Router();

historyRouter.get("/", authMiddleware, getBorrowingHistory);

export { historyRouter };
