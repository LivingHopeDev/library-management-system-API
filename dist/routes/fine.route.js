"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fineRouter = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const fineRouter = (0, express_1.Router)();
exports.fineRouter = fineRouter;
fineRouter.get("/", middlewares_1.authMiddleware, controllers_1.getBorrowingHistory);
