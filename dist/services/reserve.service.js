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
exports.ReserveService = void 0;
const __1 = require("..");
const middlewares_1 = require("../middlewares");
class ReserveService {
    reserveBook(userId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bookId, dateReserved } = payload;
            const result = yield __1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const book = yield tx.book.findUnique({
                    where: { id: bookId },
                    select: { id: true, availableCopies: true, reservedCopies: true },
                });
                if (!book) {
                    throw new middlewares_1.ResourceNotFound("Book not found");
                }
                const isBookBorrowedByThisUser = yield tx.borrowedBook.findFirst({
                    where: { borrowedBy: userId, bookId },
                });
                if (isBookBorrowedByThisUser) {
                    throw new middlewares_1.Conflict("Permission denied: You are already in possession of this book");
                }
                const isBookReservedByThisUser = yield tx.reservedBook.findFirst({
                    where: { reservedBy: userId, bookId },
                });
                if (isBookReservedByThisUser) {
                    throw new middlewares_1.Conflict("You have already reserved this book!");
                }
                if (book.availableCopies <= 0) {
                    throw new middlewares_1.Conflict("No available copies to reserve.");
                }
                // Update the book's availability and reserved copies
                const updatedBook = yield tx.book.update({
                    where: { id: bookId },
                    data: {
                        availableCopies: book.availableCopies - 1,
                        reservedCopies: book.reservedCopies + 1,
                    },
                });
                const reservedBook = yield tx.reservedBook.create({
                    data: {
                        reservedBy: userId,
                        bookId,
                        dateReserved: new Date(dateReserved),
                    },
                });
                return reservedBook;
            }));
            return {
                message: "Book reserved successfully",
                reservedBook: result,
            };
        });
    }
    cancelReservedBook(userId, reserveId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield __1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const reservedBook = yield tx.reservedBook.findFirst({
                    where: { reservedBy: userId, id: reserveId },
                    include: {
                        book: {
                            select: { id: true, reservedCopies: true, availableCopies: true },
                        },
                    },
                });
                if (!reservedBook) {
                    throw new middlewares_1.Conflict("You didn't reserve this book!");
                }
                const updatedBook = yield tx.book.update({
                    where: { id: reservedBook.book.id },
                    data: {
                        reservedCopies: reservedBook.book.reservedCopies - 1,
                        availableCopies: reservedBook.book.availableCopies + 1,
                    },
                });
                yield tx.reservedBook.delete({
                    where: { id: reserveId },
                });
                return updatedBook;
            }));
            return {
                message: "Book reservation has been cancelled successfully.",
            };
        });
    }
}
exports.ReserveService = ReserveService;
