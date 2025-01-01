import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  updateProfile,
  updateUserProfile,
} from "../controllers";
import { adminMiddleware, authMiddleware, validateData } from "../middlewares";

const userRouter = Router();

userRouter.get("/", authMiddleware, adminMiddleware, getAllUsers);
userRouter.patch("/profile", authMiddleware, updateProfile); // for users
userRouter.patch(
  "/:id/profile",
  authMiddleware,
  adminMiddleware,
  updateUserProfile
); // for admin

userRouter.delete("/:id", authMiddleware, adminMiddleware, deleteUser);
export { userRouter };
