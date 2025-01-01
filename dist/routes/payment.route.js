"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const payment_controller_1 = require("../controllers/payment.controller");
const paymentRouter = (0, express_1.Router)();
exports.paymentRouter = paymentRouter;
paymentRouter.post("/", middlewares_1.authMiddleware, payment_controller_1.payFine);
paymentRouter.get("/verify", middlewares_1.authMiddleware, payment_controller_1.verifyPayment);
