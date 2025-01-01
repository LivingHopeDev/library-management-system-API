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
exports.renewBook = exports.returnBook = exports.getAllBorrowedBooks = exports.getBorrowedBooks = exports.borrowBook = exports.deleteBook = exports.updateBook = exports.getBookById = exports.getBooks = exports.addBook = void 0;
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const services_1 = require("../services");
const bookService = new services_1.BookService();
exports.addBook = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message, book } = yield bookService.addBook(req.body);
    res.status(201).json({ message, data: book });
}));
exports.getBooks = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, genre, availability } = req.query;
    const { books, totalPages, message } = yield bookService.getBooks({
        page: page ? parseInt(page, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
        genre: genre,
        availability: availability,
    });
    res.status(200).json({
        message,
        data: {
            books,
            totalPages,
            page: page || 1,
            limit: limit || 10,
        },
    });
}));
exports.getBookById = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.id;
    const { book } = yield bookService.getBookById(bookId);
    res.status(200).json({ data: book });
}));
exports.updateBook = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.id;
    const { message, book } = yield bookService.updateBook(bookId, req.body);
    res.status(200).json({ message, data: book });
}));
exports.deleteBook = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.id;
    const { message } = yield bookService.deleteBook(bookId);
    res.status(200).json({ message });
}));
exports.borrowBook = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.body;
    const userId = req.user.id;
    const { message, borrowedBook } = yield bookService.borrowBook(bookId, userId);
    const formattedResponse = {
        status: 201,
        message,
        data: {
            book: {
                title: borrowedBook.book.title,
                author: {
                    id: borrowedBook.book.id,
                    name: borrowedBook.book.author,
                },
                genre: borrowedBook.book.genre,
                description: borrowedBook.book.description,
                createdAt: borrowedBook.book.createdAt,
                updatedAt: borrowedBook.book.updatedAt,
                availability: borrowedBook.book.availability,
                copies: borrowedBook.book.totalCopies,
            },
            dateBorrow: borrowedBook.borrowedAt,
            expectedReturnDate: borrowedBook.dueDate,
            borrowedBy: {
                id: borrowedBook.user.id,
                name: borrowedBook.user.username,
                email: borrowedBook.user.email,
            },
        },
    };
    res.status(200).json(formattedResponse);
}));
exports.getBorrowedBooks = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { page, limit } = req.query;
    const { message, data, totalPages } = yield bookService.getBorrowedBooks(userId, {
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
    });
    res
        .status(200)
        .json({ message, data, page: page || 1, limit: limit || 10, totalPages });
}));
exports.getAllBorrowedBooks = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = req.query;
    const { message, data, totalPages } = yield bookService.getAllBorrowedBooks({
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
    });
    res
        .status(200)
        .json({ message, data, page: page || 1, limit: limit || 10, totalPages });
}));
exports.returnBook = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.body;
    const userId = req.user.id;
    const { message, returnedBook } = yield bookService.returnBook(bookId, userId);
    const formattedResponse = {
        status: 201,
        message,
        data: {
            book: {
                title: returnedBook.book.title,
                author: {
                    id: returnedBook.book.id,
                    name: returnedBook.book.author,
                },
                genre: returnedBook.book.genre,
                description: returnedBook.book.description,
                createdAt: returnedBook.book.createdAt,
                updatedAt: returnedBook.book.updatedAt,
                availability: returnedBook.book.availability,
                copies: returnedBook.book.totalCopies,
            },
        },
    };
    res.status(201).json(formattedResponse);
}));
exports.renewBook = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = req.body;
    const userId = req.user.id;
    const { message } = yield bookService.renewBook(bookId, userId);
    res.status(200).json({
        status: 200,
        message,
        data: [],
    });
}));
