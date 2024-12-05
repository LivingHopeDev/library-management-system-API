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
        select: { id: true },
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
}
