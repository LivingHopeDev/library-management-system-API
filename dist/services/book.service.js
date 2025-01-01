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
exports.BookService = void 0;
const middlewares_1 = require("../middlewares");
const __1 = require("..");
class BookService {
    addBook(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield __1.prismaClient.book.create({
                data: Object.assign(Object.assign({}, payload), { availableCopies: payload.totalCopies }),
            });
            return {
                message: "Book added successfully",
                book,
            };
        });
    }
    getBooks(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10, genre, availability } = query;
            const filters = {};
            if (genre)
                filters.genre = genre;
            if (availability)
                filters.availability = availability === "true";
            const [books, totalRecords] = yield Promise.all([
                __1.prismaClient.book.findMany({
                    where: filters,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { createdAt: "desc" },
                }),
                __1.prismaClient.book.count({ where: filters }),
            ]);
            const totalPages = Math.ceil(totalRecords / limit);
            if (books.length === 0) {
                return {
                    message: "No books match the specified criteria.",
                    books: [],
                    totalPages,
                };
            }
            return { message: "Books retrieved successfully.", books, totalPages };
        });
    }
    getBookById(bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield __1.prismaClient.book.findUnique({
                where: { id: bookId },
            });
            if (!book) {
                throw new middlewares_1.ResourceNotFound("Book not found");
            }
            return { book };
        });
    }
    updateBook(bookId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingBook = yield __1.prismaClient.book.findFirst({
                where: { id: bookId },
            });
            if (!existingBook) {
                throw new middlewares_1.ResourceNotFound("Book not found or access denied");
            }
            const updatedBook = yield __1.prismaClient.book.update({
                where: { id: bookId },
                data: payload,
            });
            return {
                message: "Book updated successfully",
                book: updatedBook,
            };
        });
    }
    deleteBook(bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingBook = yield __1.prismaClient.book.findUnique({
                where: { id: bookId },
            });
            if (!existingBook) {
                throw new middlewares_1.ResourceNotFound("Book not found or access denied");
            }
            yield __1.prismaClient.book.delete({
                where: { id: bookId },
            });
            return { message: "Book deleted successfully" };
        });
    }
    borrowBook(bookId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield __1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const book = yield tx.book.findUnique({ where: { id: bookId } });
                const borrowedBookExist = yield tx.borrowedBook.findFirst({
                    where: { bookId, borrowedBy: userId },
                });
                if (borrowedBookExist) {
                    throw new middlewares_1.Conflict("You have already borrowed this book.");
                }
                // Check if there are available copies to borrow
                if (!book || book.availableCopies <= 0) {
                    throw new middlewares_1.Conflict("No copies available for this book.");
                }
                // Decrease available copies and update the book
                const updatedBook = yield tx.book.update({
                    where: { id: bookId },
                    data: {
                        availableCopies: book.availableCopies - 1,
                    },
                });
                const currentDate = new Date();
                const expectedReturnDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000 // 14 days borrow period
                );
                // Create the borrowed book record
                const borrowedBook = yield tx.borrowedBook.create({
                    data: {
                        borrowedBy: userId,
                        bookId,
                        borrowedAt: new Date(),
                        dueDate: expectedReturnDate,
                    },
                });
                const user = yield tx.user.findUnique({ where: { id: userId } });
                return {
                    book: updatedBook,
                    user,
                    borrowedAt: borrowedBook.borrowedAt,
                    dueDate: borrowedBook.dueDate,
                };
            }));
            return {
                message: "Book borrowed successfully",
                borrowedBook: result,
            };
        });
    }
    getBorrowedBooks(userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = query;
            const [borrowedBooks, totalRecords] = yield Promise.all([
                __1.prismaClient.borrowedBook.findMany({
                    where: { borrowedBy: userId },
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        book: true,
                    },
                }),
                __1.prismaClient.borrowedBook.count(),
            ]);
            const totalPages = Math.ceil(totalRecords / limit);
            if (borrowedBooks.length === 0) {
                return {
                    message: "No book has been borrowed",
                    data: borrowedBooks,
                    totalPages,
                };
            }
            return {
                message: "Borrowed books retrieved",
                data: borrowedBooks,
                totalPages,
            };
        });
    }
    // For Admin
    getAllBorrowedBooks(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = query;
            const [borrowedBooks, totalRecords] = yield Promise.all([
                __1.prismaClient.borrowedBook.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        user: true,
                        book: true,
                    },
                }),
                __1.prismaClient.borrowedBook.count(),
            ]);
            const totalPages = Math.ceil(totalRecords / limit);
            if (borrowedBooks.length === 0) {
                return {
                    message: "No book has been borrowed",
                    data: borrowedBooks,
                    totalPages,
                };
            }
            return {
                message: "Borrowed books retrieved",
                data: borrowedBooks,
                totalPages,
            };
        });
    }
    returnBook(bookId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield __1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const FINE_PAY_DAY = 1; // $ 1
                const book = yield tx.book.findUnique({ where: { id: bookId } });
                const borrowedBookExist = yield tx.borrowedBook.findFirst({
                    where: { bookId, borrowedBy: userId },
                });
                if (!borrowedBookExist) {
                    throw new middlewares_1.ResourceNotFound("No record of borrowed book!");
                }
                if (!borrowedBookExist.returnedAt) {
                    const currentDate = new Date();
                    const isOverDue = currentDate > borrowedBookExist.dueDate;
                    if (isOverDue) {
                        const daysLate = Math.ceil((currentDate.getTime() - borrowedBookExist.dueDate.getTime()) /
                            (24 * 60 * 60 * 1000));
                        const fineAmount = daysLate * FINE_PAY_DAY;
                        if (!borrowedBookExist.isFinePaid) {
                            throw new middlewares_1.Conflict(`Return blocked: Your book is ${daysLate} days overdue. Pay the fine of $${fineAmount}.`);
                        }
                    }
                }
                // Update the borrowedBook record to mark it as returned
                yield tx.borrowedBook.update({
                    where: { id: borrowedBookExist.id },
                    data: {
                        returnedAt: new Date(),
                    },
                });
                // Increment availableCopies when a book is returned
                const updatedBook = yield tx.book.update({
                    where: { id: bookId },
                    data: {
                        availableCopies: book.availableCopies + 1,
                    },
                });
                return {
                    book: updatedBook,
                };
            }));
            return {
                message: "Book returned successfully",
                returnedBook: result,
            };
        });
    }
    renewBook(bookId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield __1.prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const borrowedBook = yield tx.borrowedBook.findFirst({
                    where: { bookId, borrowedBy: userId, returnedAt: null },
                });
                if (!borrowedBook) {
                    throw new middlewares_1.ResourceNotFound("You have not borrowed this book or it has been returned.");
                }
                // Check if the due date is already passed, denying renewal
                // I want users to be allowed to renew only if they are within the due date
                if (borrowedBook.dueDate < new Date()) {
                    throw new middlewares_1.Conflict("Your borrow period has expired. Please return the book.");
                }
                // Retrieve any reservation data for the book
                const reservedBook = yield tx.reservedBook.findFirst({
                    where: { bookId },
                });
                const currentDate = new Date();
                let newDueDate = new Date();
                let remainingDays = 14; // I chose the default borrowing period to be 14 days
                if (reservedBook) {
                    const reservedDate = reservedBook.dateReserved;
                    const timeDiff = new Date(reservedDate).getTime() - currentDate.getTime();
                    const daysDiff = timeDiff / (1000 * 3600 * 24); // Convert milliseconds to days
                    // If the days difference is less than 14, calculate the remaining days
                    if (daysDiff < 14) {
                        // Remove 2 days from the remaining days to avoid story because of the user that has reserved it
                        const remainingDaysBeforePenalty = daysDiff - 2;
                        // If the remaining days after subtracting 2 are <= 0, deny renewal
                        if (remainingDaysBeforePenalty <= 0) {
                            throw new middlewares_1.Conflict("The book will not be available for renewal.");
                        }
                        remainingDays = remainingDaysBeforePenalty;
                        newDueDate = new Date(currentDate.getTime() + remainingDays * 24 * 60 * 60 * 1000); // Set the new due date
                    }
                }
                else {
                    // No reservation: Default is to give the full 14 days
                    newDueDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000);
                }
                yield tx.borrowedBook.update({
                    where: { id: borrowedBook.id },
                    data: {
                        dueDate: newDueDate,
                    },
                });
                return {
                    remainingDays,
                };
            }));
            return {
                message: `Book renewed successfully. You can borrow the book for ${result.remainingDays} more day(s).`,
            };
        });
    }
}
exports.BookService = BookService;
