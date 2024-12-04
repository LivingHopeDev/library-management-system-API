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
    message,
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

export const borrowBook = asyncHandler(async (req: Request, res: Response) => {
  const { bookId } = req.body;
  const userId = req.user.id;

  const { message, borrowedBook } = await bookService.borrowBook(
    bookId,
    userId
  );

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
        copies: borrowedBook.book.copies,
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

  res.status(201).json(formattedResponse);
});

export const returnBook = asyncHandler(async (req: Request, res: Response) => {
  const { bookId } = req.body;
  const userId = req.user.id;

  const { message, returnedBook } = await bookService.returnBook(
    bookId,
    userId
  );

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
        copies: returnedBook.book.copies,
      },
    },
  };

  res.status(201).json(formattedResponse);
});

export const renewBook = asyncHandler(async (req: Request, res: Response) => {
  const { bookId } = req.body;
  const userId = req.user.id;

  const { message } = await bookService.renewBook(bookId, userId);

  res.status(200).json({
    status: 200,
    message,
    data: [],
  });
});
