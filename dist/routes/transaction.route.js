"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const transactionRouter = (0, express_1.Router)();
exports.transactionRouter = transactionRouter;
transactionRouter.get("/", middlewares_1.authMiddleware, controllers_1.getAllTransactions);
transactionRouter.get("/me", middlewares_1.authMiddleware, controllers_1.getAllTransactions); // For Users
transactionRouter.get("/:id", middlewares_1.authMiddleware, controllers_1.getTransactionById);
transactionRouter.delete("/:id", middlewares_1.authMiddleware, middlewares_1.adminMiddleware, controllers_1.deleteTransaction);
