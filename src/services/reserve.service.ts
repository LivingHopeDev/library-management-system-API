import { ReservedBook } from "@prisma/client";
import { prismaClient } from "..";
import { Conflict, ResourceNotFound } from "../middlewares";

export class ReserveService {
  public async reserveBook(
    userId: string,
    payload: { bookId: string; dateReserved: string }
  ): Promise<{ message: string; reservedBook: ReservedBook }> {
    const { bookId, dateReserved } = payload;

    const result = await prismaClient.$transaction(async (tx) => {
      const book = await tx.book.findUnique({
        where: { id: bookId },
        select: { id: true, availableCopies: true, reservedCopies: true },
      });

      if (!book) {
        throw new ResourceNotFound("Book not found");
      }

      const isBookBorrowedByThisUser = await tx.borrowedBook.findFirst({
        where: { borrowedBy: userId, bookId },
      });

      if (isBookBorrowedByThisUser) {
        throw new Conflict(
          "Permission denied: You are already in possession of this book"
        );
      }

      const isBookReservedByThisUser = await tx.reservedBook.findFirst({
        where: { reservedBy: userId, bookId },
      });

      if (isBookReservedByThisUser) {
        throw new Conflict("You have already reserved this book!");
      }

      if (book.availableCopies <= 0) {
        throw new Conflict("No available copies to reserve.");
      }

      // Update the book's availability and reserved copies
      const updatedBook = await tx.book.update({
        where: { id: bookId },
        data: {
          availableCopies: book.availableCopies - 1,
          reservedCopies: book.reservedCopies + 1,
        },
      });

      const reservedBook = await tx.reservedBook.create({
        data: {
          reservedBy: userId,
          bookId,
          dateReserved: new Date(dateReserved),
        },
      });

      return reservedBook;
    });

    return {
      message: "Book reserved successfully",
      reservedBook: result,
    };
  }

  public async cancelReservedBook(
    userId: string,
    reserveId: string
  ): Promise<{ message: string }> {
    const result = await prismaClient.$transaction(async (tx) => {
      const reservedBook = await tx.reservedBook.findFirst({
        where: { reservedBy: userId, id: reserveId },
        include: {
          book: {
            select: { id: true, reservedCopies: true, availableCopies: true },
          },
        },
      });

      if (!reservedBook) {
        throw new Conflict("You didn't reserve this book!");
      }

      const updatedBook = await tx.book.update({
        where: { id: reservedBook.book.id },
        data: {
          reservedCopies: reservedBook.book.reservedCopies - 1,
          availableCopies: reservedBook.book.availableCopies + 1,
        },
      });

      await tx.reservedBook.delete({
        where: { id: reserveId },
      });

      return updatedBook;
    });

    return {
      message: "Book reservation has been cancelled successfully.",
    };
  }
}
