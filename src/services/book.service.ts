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
  public async getBooks(): Promise<{ books: IBook[]; message?: string }> {
    const books = await prismaClient.book.findMany();

    if (books.length === 0) {
      return {
        message: "No book uploaded yet",
        books: [],
      };
    }
    return { books };
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
}
