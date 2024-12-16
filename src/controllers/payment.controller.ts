import asyncHandler from "../middlewares/asyncHandler";
import { Request, Response } from "express";
import { PaymentService } from "../services";

const paymentService = new PaymentService();
export const payFine = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const response = await paymentService.payFine(req.body, userId);
  res.status(201).json({
    message: "Payment initialized successfully",
    data: response,
  });
});

export const verifyPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { message, borrowedBook, fine } =
      await paymentService.processPaymentVerification(req.body);
    res.status(201).json({
      message,
      data: { borrowedBook, fine },
    });
  }
);
