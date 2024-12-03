import { ResourceNotFound, ServerError } from "../middlewares";
import { prismaClient } from "..";
import { IBook } from "../types";
export class BookService {
  public async addBook(
    payload: IBook,
    userId: string
  ): Promise<{ message: string; book: IBook }> {
    const book = await prismaClient.book.create({
      data: {
        ...payload,
        author: userId,
      },
    });
    return {
      message: "Book added successfully ",
      book,
    };
  }
  public async getBooks(
    userId?: string
  ): Promise<{ books: IBook[]; message?: string }> {
    const books = await prismaClient.book.findMany({
      where: { author: userId },
    });

    if (books.length === 0) {
      return {
        message: "No book uploaded yet",
        books: [],
      };
    }
    return { books };
  }
}
