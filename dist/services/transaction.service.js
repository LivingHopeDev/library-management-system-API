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
exports.transactionService = exports.TransactionService = void 0;
const __1 = require("..");
const middlewares_1 = require("../middlewares");
class TransactionService {
    // For Users
    getUserTransactions() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, userId) {
            const [transactions, totalRecords] = yield Promise.all([
                __1.prismaClient.fine.findMany({
                    where: { userId },
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        user: true,
                        book: true,
                    },
                }),
                __1.prismaClient.fine.count(),
            ]);
            const totalPages = Math.ceil(totalRecords / limit);
            return {
                message: "Transactions retrieved successfully.",
                data: transactions,
                totalPages,
                page,
                limit,
            };
        });
    }
    // For Admin
    getAllTransactions() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10) {
            const [transactions, totalRecords] = yield Promise.all([
                __1.prismaClient.fine.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        user: true,
                        book: true,
                    },
                }),
                __1.prismaClient.fine.count(),
            ]);
            const totalPages = Math.ceil(totalRecords / limit);
            return {
                message: "Transactions retrieved successfully.",
                data: transactions,
                totalPages,
                page,
                limit,
            };
        });
    }
    getTransactionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield __1.prismaClient.fine.findUnique({
                where: { id },
                include: {
                    user: true,
                    book: true,
                },
            });
            if (!transaction) {
                throw new middlewares_1.ResourceNotFound(`Transaction with id ${id} not found.`);
            }
            return {
                message: "Transaction retrieved successfully.",
                data: transaction,
            };
        });
    }
    deleteTransaction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield __1.prismaClient.fine.findUnique({
                where: { id },
            });
            if (!transaction) {
                throw new middlewares_1.ResourceNotFound(`Transaction with id ${id} not found.`);
            }
            yield __1.prismaClient.fine.delete({
                where: { id },
            });
            return {
                message: `Transaction with id ${id} has been successfully deleted.`,
            };
        });
    }
}
exports.TransactionService = TransactionService;
exports.transactionService = new TransactionService();
