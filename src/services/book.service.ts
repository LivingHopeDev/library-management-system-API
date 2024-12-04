import { Conflict, ResourceNotFound, ServerError } from "../middlewares";
import { prismaClient } from "..";
import { IBook } from "../types";
import { BorrowedBook } from "@prisma/client";
import { Book, User } from "@prisma/client";
export class BookService {
  public async addBook(
    payload: IBook
  ): Promise<{ message: string; book: IBook }> {
    const book = await prismaClient.book.create({
      data: {
        ...payload,
      },
    });
    return {
      message: "Book added successfully ",
      book,
    };
  }
  public async getBooks(query: {
    page?: number;
    limit?: number;
    genre?: string;
    availability?: string;
  }): Promise<{ books: IBook[]; total: number; message?: string }> {
    const { page = 1, limit = 10, genre, availability } = query;

    const filters: Record<string, any> = {};
    if (genre) filters.genre = genre;
    if (availability) filters.availability = availability === "true";

    const [books, total] = await Promise.all([
      prismaClient.book.findMany({
        where: filters,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prismaClient.book.count({ where: filters }),
    ]);

    if (books.length === 0) {
      return {
        message: "No books match the specified criteria.",
        books: [],
        total,
      };
    }

    return { message: "Books retrieved successfully.", books, total };
  }

  public async getBookById(bookId: string): Promise<{ book: Partial<IBook> }> {
    const book = await prismaClient.book.findUnique({
      where: { id: bookId },
    });
    if (!book) {
      throw new ResourceNotFound("Book not found");
    }
    return { book };
  }

  public async updateBook(
    bookId: string,
    payload: Partial<IBook>
  ): Promise<{ message: string; book: IBook }> {
    const existingBook = await prismaClient.book.findFirst({
      where: { id: bookId },
    });
    if (!existingBook) {
      throw new ResourceNotFound("Book not found or access denied");
    }

    const updatedBook = await prismaClient.book.update({
      where: { id: bookId },
      data: payload,
    });

    return {
      message: "Book updated successfully",
      book: updatedBook,
    };
  }
  public async deleteBook(bookId: string): Promise<{ message: string }> {
    const existingBook = await prismaClient.book.findUnique({
      where: { id: bookId },
    });
    if (!existingBook) {
      throw new ResourceNotFound("Book not found or access denied");
    }

    await prismaClient.book.delete({
      where: { id: bookId },
    });

    return { message: "Book deleted successfully" };
  }

  public async borrowBook(
    bookId: string,
    userId: string
  ): Promise<{
    message: string;
    borrowedBook: {
      book: Partial<Book>;
      user: Partial<User>;
      borrowedAt: Date;
    };
  }> {
    const result = await prismaClient.$transaction(async (tx) => {
      const book = await tx.book.findUnique({ where: { id: bookId } });

      if (!book || book.copies <= 0) {
        throw new Conflict("No copies available for this book.");
      }

      const updatedBook = await tx.book.update({
        where: { id: bookId },
        data: {
          copies: book.copies - 1,
          availability: book.copies - 1 > 0,
        },
      });

      const borrowedBook = await tx.borrowedBook.create({
        data: {
          borrowedBy: userId,
          bookId,
          borrowedAt: new Date(),
        },
      });

      const user = await tx.user.findUnique({ where: { id: userId } });

      return {
        book: updatedBook,
        user,
        borrowedAt: borrowedBook.borrowedAt,
      };
    });

    return {
      message: "Book borrowed successfully",
      borrowedBook: result,
    };
  }
  public async returnBook(
    bookId: string,
    userId: string
  ): Promise<{
    message: string;
    returnedBook: {
      book: Partial<Book>;
    };
  }> {
    const result = await prismaClient.$transaction(async (tx) => {
      const book = await tx.book.findUnique({ where: { id: bookId } });
      const borrowedBookExist = await tx.borrowedBook.findFirst({
        where: { bookId, borrowedBy: userId },
      });

      if (!borrowedBookExist) {
        throw new ResourceNotFound("No record of borrowed Book!");
      }
      await tx.borrowedBook.update({
        where: { id: borrowedBookExist.id },
        data: {
          returnedAt: new Date(),
        },
      });
      const updatedBook = await tx.book.update({
        where: { id: bookId },
        data: {
          copies: book.copies + 1,
          availability: book.copies + 1 > 0,
        },
      });

      return {
        book: updatedBook,
      };
    });

    return {
      message: "Book returned successfully",
      returnedBook: result,
    };
  }
}
