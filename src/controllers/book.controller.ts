import asyncHandler from "../middlewares/asyncHandler";
import { Request, Response } from "express";
import { BookService } from "../services/book.service";
const bookService = new BookService();
export const addBook = asyncHandler(async (req: Request, res: Response) => {
  const { message, book } = await bookService.addBook(req.body);
  res.status(201).json({ message, data: book });
});

export const getBooks = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, genre, availability } = req.query;

  const { books, total, message } = await bookService.getBooks({
    page: page ? parseInt(page as string, 10) : undefined,
    limit: limit ? parseInt(limit as string, 10) : undefined,
    genre: genre as string,
    availability: availability as string,
  });

  res.status(200).json({
    message: message || "Books retrieved successfully.",
    data: {
      books,
      total,
      page: page || 1,
      limit: limit || 10,
    },
  });
});

export const getBookById = asyncHandler(async (req: Request, res: Response) => {
  const bookId = req.params.id;
  const { book } = await bookService.getBookById(bookId);
  res.status(200).json({ data: book });
});

export const updateBook = asyncHandler(async (req: Request, res: Response) => {
  const bookId = req.params.id;

  const { message, book } = await bookService.updateBook(bookId, req.body);
  res.status(200).json({ message, data: book });
});

export const deleteBook = asyncHandler(async (req: Request, res: Response) => {
  const bookId = req.params.id;

  const { message } = await bookService.deleteBook(bookId);
  res.status(200).json({ message });
});
