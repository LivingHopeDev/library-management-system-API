import { Router } from "express";
import { getAllUsers } from "../controllers";
import { adminMiddleware, authMiddleware, validateData } from "../middlewares";

const userRouter = Router();

userRouter.get("/", authMiddleware, adminMiddleware, getAllUsers);

// userRouter.delete("/:id", authMiddleware, cancelReservedBook);
export { userRouter };
