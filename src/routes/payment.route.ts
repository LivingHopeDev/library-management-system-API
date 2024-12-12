import { Router } from "express";
import { cancelReservedBook, reserveBook } from "../controllers";
import { authMiddleware, validateData } from "../middlewares";
import { payFine, verifyPayment } from "../controllers/payment.controller";

const paymentRouter = Router();

paymentRouter.post("/", authMiddleware, payFine);
paymentRouter.get("/verify", authMiddleware, verifyPayment);

// paymentRouter.delete("/:id", authMiddleware, cancelReservedBook);
export { paymentRouter };
