"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyRouter = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const historyRouter = (0, express_1.Router)();
exports.historyRouter = historyRouter;
historyRouter.get("/", middlewares_1.authMiddleware, controllers_1.getBorrowingHistory);
