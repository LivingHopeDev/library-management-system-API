"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelReservedBook = exports.reserveBook = void 0;
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const reserve_service_1 = require("../services/reserve.service");
const reserveService = new reserve_service_1.ReserveService();
exports.reserveBook = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { message } = yield reserveService.reserveBook(userId, req.body);
    res.status(201).json({ message, data: [] });
}));
exports.cancelReservedBook = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const reserveId = req.params.id;
    const { message } = yield reserveService.cancelReservedBook(userId, reserveId);
    res.status(200).json({ message, data: [] });
}));
