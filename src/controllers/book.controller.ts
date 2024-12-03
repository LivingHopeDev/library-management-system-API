import asyncHandler from "../middlewares/asyncHandler";
import { Request, Response } from "express";
import { BookService } from "../services/book.service";
const bookService = new BookService();
export const addBook = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { message, book } = await bookService.addBook(req.body, userId);
  res.status(201).json({ message, data: book });
});

export const getBooks = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { books } = await bookService.getBooks(userId);
  res.status(200).json({ data: books });
});

export const getBookById = asyncHandler(async (req: Request, res: Response) => {
  const bookId = req.params.id;
  const { book } = await bookService.getBookById(bookId);
  res.status(200).json({ data: book });
});
