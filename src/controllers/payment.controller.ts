import asyncHandler from "../middlewares/asyncHandler";
import { Request, Response } from "express";
import { PaymentService } from "../services";

const paymentService = new PaymentService();
export const payFine = asyncHandler(async (req: Request, res: Response) => {
  const response = await paymentService.payFine(req.body);
  res.status(201).json({
    message: "Payment initialized successfully",
    data: response,
  });
});

export const verifyPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const response = await paymentService.verifyPayment(req.body);
    res.status(201).json({
      message: "Payment verified successfully",
      data: response,
    });
  }
);
