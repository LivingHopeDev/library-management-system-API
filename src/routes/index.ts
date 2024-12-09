import { Router } from "express";
import { authRouter } from "./auth.route";
import { bookRouter } from "./book.route";
import { reserverRouter } from "./reserve.route";
import { historyRouter } from "./history.route";
const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/books", bookRouter);
rootRouter.use("/reserve", reserverRouter);
rootRouter.use("/history", historyRouter);

export default rootRouter;
