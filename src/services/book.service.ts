import { Conflict, ResourceNotFound } from "../middlewares";
import { prismaClient } from "..";
import { IBook } from "../types";
import { Book, BorrowedBook, User } from "@prisma/client";
export class BookService {
  public async addBook(
    payload: IBook
  ): Promise<{ message: string; book: IBook }> {
    const book = await prismaClient.book.create({
      data: {
        ...payload,
        availableCopies: payload.totalCopies,
      },
    });

    return {
      message: "Book added successfully",
      book,
    };
  }

  public async getBooks(query: {
    page?: number;
    limit?: number;
    genre?: string;
    availability?: string;
  }): Promise<{ books: IBook[]; totalPages: number; message?: string }> {
    const { page = 1, limit = 10, genre, availability } = query;

    const filters: Record<string, any> = {};
    if (genre) filters.genre = genre;
    if (availability) filters.availability = availability === "true";

    const [books, totalRecords] = await Promise.all([
      prismaClient.book.findMany({
        where: filters,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prismaClient.book.count({ where: filters }),
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
      dueDate: Date;
    };
  }> {
    const result = await prismaClient.$transaction(async (tx) => {
      const book = await tx.book.findUnique({ where: { id: bookId } });
      const borrowedBookExist = await tx.borrowedBook.findFirst({
        where: { bookId, borrowedBy: userId },
      });

      if (borrowedBookExist) {
        throw new Conflict("You have already borrowed this book.");
      }

      // Check if there are available copies to borrow
      if (!book || book.availableCopies <= 0) {
        throw new Conflict("No copies available for this book.");
      }

      // Decrease available copies and update the book
      const updatedBook = await tx.book.update({
        where: { id: bookId },
        data: {
          availableCopies: book.availableCopies - 1,
        },
      });

      const currentDate = new Date();
      const expectedReturnDate = new Date(
        currentDate.getTime() + 14 * 24 * 60 * 60 * 1000 // 14 days borrow period
      );

      // Create the borrowed book record
      const borrowedBook = await tx.borrowedBook.create({
        data: {
          borrowedBy: userId,
          bookId,
          borrowedAt: new Date(),
          dueDate: expectedReturnDate,
        },
      });

      const user = await tx.user.findUnique({ where: { id: userId } });

      return {
        book: updatedBook,
        user,
        borrowedAt: borrowedBook.borrowedAt,
        dueDate: borrowedBook.dueDate,
      };
    });

    return {
      message: "Book borrowed successfully",
      borrowedBook: result,
    };
  }

  public async getBorrowedBooks(
    userId: string,
    query: { page: number; limit: number }
  ): Promise<{ message: string; data: BorrowedBook[]; totalPages: number }> {
    const { page = 1, limit = 10 } = query;
    const [borrowedBooks, totalRecords] = await Promise.all([
      prismaClient.borrowedBook.findMany({
        where: { borrowedBy: userId },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          book: true,
        },
      }),
      prismaClient.borrowedBook.count(),
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
  }
  // For Admin
  public async getAllBorrowedBooks(query: {
    page: number;
    limit: number;
  }): Promise<{ message: string; data: BorrowedBook[]; totalPages: number }> {
    const { page = 1, limit = 10 } = query;
    const [borrowedBooks, totalRecords] = await Promise.all([
      prismaClient.borrowedBook.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: true,
          book: true,
        },
      }),
      prismaClient.borrowedBook.count(),
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
      const FINE_PAY_DAY = 1; // $ 1
      const book = await tx.book.findUnique({ where: { id: bookId } });
      const borrowedBookExist = await tx.borrowedBook.findFirst({
        where: { bookId, borrowedBy: userId },
      });

      if (!borrowedBookExist) {
        throw new ResourceNotFound("No record of borrowed book!");
      }
      if (!borrowedBookExist.returnedAt) {
        const currentDate = new Date();
        const isOverDue = currentDate > borrowedBookExist.dueDate;
        if (isOverDue) {
          const daysLate = Math.ceil(
            (currentDate.getTime() - borrowedBookExist.dueDate.getTime()) /
              (24 * 60 * 60 * 1000)
          );
          const fineAmount = daysLate * FINE_PAY_DAY;

          if (!borrowedBookExist.isFinePaid) {
            throw new Conflict(
              `Return blocked: Your book is ${daysLate} days overdue. Pay the fine of $${fineAmount}.`
            );
          }
        }
      }

      // Update the borrowedBook record to mark it as returned
      await tx.borrowedBook.update({
        where: { id: borrowedBookExist.id },
        data: {
          returnedAt: new Date(),
        },
      });

      // Increment availableCopies when a book is returned
      const updatedBook = await tx.book.update({
        where: { id: bookId },
        data: {
          availableCopies: book.availableCopies + 1,
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

  public async renewBook(
    bookId: string,
    userId: string
  ): Promise<{
    message: string;
  }> {
    const result = await prismaClient.$transaction(async (tx) => {
      const borrowedBook = await tx.borrowedBook.findFirst({
        where: { bookId, borrowedBy: userId, returnedAt: null },
      });

      if (!borrowedBook) {
        throw new ResourceNotFound(
          "You have not borrowed this book or it has been returned."
        );
      }

      // Check if the due date is already passed, denying renewal
      // I want users to be allowed to renew only if they are within the due date
      if (borrowedBook.dueDate < new Date()) {
        throw new Conflict(
          "Your borrow period has expired. Please return the book."
        );
      }

      // Retrieve any reservation data for the book
      const reservedBook = await tx.reservedBook.findFirst({
        where: { bookId },
      });

      const currentDate = new Date();
      let newDueDate = new Date();
      let remainingDays = 14; // I chose the default borrowing period to be 14 days

      if (reservedBook) {
        const reservedDate = reservedBook.dateReserved;
        const timeDiff =
          new Date(reservedDate).getTime() - currentDate.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24); // Convert milliseconds to days

        // If the days difference is less than 14, calculate the remaining days
        if (daysDiff < 14) {
          // Remove 2 days from the remaining days to avoid story because of the user that has reserved it
          const remainingDaysBeforePenalty = daysDiff - 2;

          // If the remaining days after subtracting 2 are <= 0, deny renewal
          if (remainingDaysBeforePenalty <= 0) {
            throw new Conflict("The book will not be available for renewal.");
          }

          remainingDays = remainingDaysBeforePenalty;
          newDueDate = new Date(
            currentDate.getTime() + remainingDays * 24 * 60 * 60 * 1000
          ); // Set the new due date
        }
      } else {
        // No reservation: Default is to give the full 14 days
        newDueDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      }

      await tx.borrowedBook.update({
        where: { id: borrowedBook.id },
        data: {
          dueDate: newDueDate,
        },
      });

      return {
        remainingDays,
      };
    });

    return {
      message: `Book renewed successfully. You can borrow the book for ${result.remainingDays} more day(s).`,
    };
  }
}
