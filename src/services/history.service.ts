import { ResourceNotFound } from "../middlewares";
import { prismaClient } from "..";
import { BorrowedBook, Fine } from "@prisma/client";

export class HistoryService {
  public async getBorrowingHistory(
    userId: string,
    query: {
      page?: number;
      limit?: number;
    }
  ): Promise<{
    borrowedBooks: BorrowedBook[];
    totalPages: number;
    message: string;
  }> {
    const { page = 1, limit = 10 } = query;

    const [borrowedBooks, totalRecords] = await Promise.all([
      prismaClient.borrowedBook.findMany({
        where: { borrowedBy: userId },
        skip: (page - 1) * limit,
        take: limit,
        include: { book: true },
      }),
      prismaClient.borrowedBook.count({ where: { borrowedBy: userId } }),
    ]);
    const totalPages = Math.ceil(totalRecords / limit);

    if (borrowedBooks.length === 0) {
      throw new ResourceNotFound("No borrowing history found");
    }
    return {
      message: "Retrieved all borrowed books history successfully",
      borrowedBooks,
      totalPages,
    };
  }
}
