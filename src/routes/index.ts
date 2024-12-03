import { Router } from "express";
import { authRouter } from "./auth.route";
import { bookRouter } from "./book.route";
const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/books", bookRouter);

export default rootRouter;
