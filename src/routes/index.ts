import { Router } from "express";
import { authRouter } from "./auth.route";
import { bookRouter } from "./book.route";
import { reserverRouter } from "./reserve.route";
import { historyRouter } from "./history.route";
import { fineRouter } from "./fine.route";
import { transactionRouter } from "./transaction.route";
import { paymentRouter } from "./payment.route";
import { userRouter } from "./user.route";
const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/books", bookRouter);
rootRouter.use("/reserve", reserverRouter);
rootRouter.use("/history", historyRouter);
rootRouter.use("/fines", fineRouter);
rootRouter.use("/transactions", transactionRouter);
rootRouter.use("/payments", paymentRouter);
rootRouter.use("/users", userRouter);

export default rootRouter;
