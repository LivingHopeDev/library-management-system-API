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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryService = void 0;
const middlewares_1 = require("../middlewares");
const __1 = require("..");
class HistoryService {
    getBorrowingHistory(userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = query;
            const [borrowedBooks, totalRecords] = yield Promise.all([
                __1.prismaClient.borrowedBook.findMany({
                    where: { borrowedBy: userId },
                    skip: (page - 1) * limit,
                    take: limit,
                    include: { book: true },
                }),
                __1.prismaClient.borrowedBook.count({ where: { borrowedBy: userId } }),
            ]);
            const totalPages = Math.ceil(totalRecords / limit);
            if (borrowedBooks.length === 0) {
                throw new middlewares_1.ResourceNotFound("No borrowing history found");
            }
            return {
                message: "Retrieved all borrowed books history successfully",
                borrowedBooks,
                totalPages,
            };
        });
    }
}
exports.HistoryService = HistoryService;
