import { ResourceNotFound } from "../middlewares";
import { prismaClient } from "..";
import { BorrowedBook } from "@prisma/client";

export class HistoryService {
  public async getBorrowingHistory(
    userId: string,
    query: {
      page?: number;
      limit?: number;
      filterBy?: string;
      filterValue?: string;
      sortBy?: string;
      sortOrder?: "asc" | "dsc";
    }
  ): Promise<{
    borrowedBooks: BorrowedBook[];
    totalPages: number;
    message: string;
  }> {
    const {
      page = 1,
      limit = 10,
      filterBy,
      filterValue,
      sortBy = "borrowedAt",
      sortOrder = "asc",
    } = query;
    const filterConditions: Record<string, any> = { borrowedBy: userId };
    if (filterBy && filterValue) {
      filterConditions[filterBy] = filterValue;
    }
    const [borrowedBooks, totalRecords] = await Promise.all([
      prismaClient.borrowedBook.findMany({
        where: filterConditions,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
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
