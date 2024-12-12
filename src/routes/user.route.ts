import { Router } from "express";
import { getAllUsers, updateProfile, updateUserProfile } from "../controllers";
import { adminMiddleware, authMiddleware, validateData } from "../middlewares";

const userRouter = Router();

userRouter.get("/", authMiddleware, adminMiddleware, getAllUsers);
userRouter.patch("/profile", authMiddleware, updateProfile); // for users
userRouter.patch("/:id", authMiddleware, adminMiddleware, updateUserProfile); // for admin

// userRouter.delete("/:id", authMiddleware, cancelReservedBook);
export { userRouter };
