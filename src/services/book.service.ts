import { ResourceNotFound, ServerError } from "../middlewares";
import { prismaClient } from "..";
import { IBook } from "../types";
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

    return { books, total };
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
}
