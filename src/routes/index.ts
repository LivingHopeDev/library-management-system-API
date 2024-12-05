import { Router } from "express";
import { authRouter } from "./auth.route";
import { bookRouter } from "./book.route";
import { reserverRouter } from "./reserve.route";
const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/books", bookRouter);
rootRouter.use("/reserve", reserverRouter);

export default rootRouter;
