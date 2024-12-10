import { Router } from "express";
import { cancelReservedBook, reserveBook } from "../controllers";
import { authMiddleware, validateData } from "../middlewares";

const paymentRouter = Router();

paymentRouter.post("/", authMiddleware, reserveBook);

// paymentRouter.delete("/:id", authMiddleware, cancelReservedBook);
export { paymentRouter };
