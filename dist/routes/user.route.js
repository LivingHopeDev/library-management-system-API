"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
userRouter.get("/", middlewares_1.authMiddleware, middlewares_1.adminMiddleware, controllers_1.getAllUsers);
userRouter.patch("/profile", middlewares_1.authMiddleware, controllers_1.updateProfile); // for users
userRouter.patch("/:id/profile", middlewares_1.authMiddleware, middlewares_1.adminMiddleware, controllers_1.updateUserProfile); // for admin
userRouter.delete("/:id", middlewares_1.authMiddleware, middlewares_1.adminMiddleware, controllers_1.deleteUser);
