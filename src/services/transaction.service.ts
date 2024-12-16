import { prismaClient } from "..";
import { ResourceNotFound } from "../middlewares";
export class TransactionService {
  // For Users

  public async getUserTransactions(
    page: number = 1,
    limit: number = 10,
    userId: string
  ): Promise<{
    message: string;
    data: any[];
    totalPages: number;
    page: number;
    limit: number;
  }> {
    const [transactions, totalRecords] = await Promise.all([
      prismaClient.fine.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: true,
          book: true,
        },
      }),
      prismaClient.fine.count(),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    return {
      message: "Transactions retrieved successfully.",
      data: transactions,
      totalPages,
      page,
      limit,
    };
  }

  // For Admin

  public async getAllTransactions(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    message: string;
    data: any[];
    totalPages: number;
    page: number;
    limit: number;
  }> {
    const [transactions, totalRecords] = await Promise.all([
      prismaClient.fine.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: true,
          book: true,
        },
      }),
      prismaClient.fine.count(),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    return {
      message: "Transactions retrieved successfully.",
      data: transactions,
      totalPages,
      page,
      limit,
    };
  }

  public async getTransactionById(
    id: string
  ): Promise<{ message: string; data: any }> {
    const transaction = await prismaClient.fine.findUnique({
      where: { id },
      include: {
        user: true,
        book: true,
      },
    });

    if (!transaction) {
      throw new ResourceNotFound(`Transaction with id ${id} not found.`);
    }

    return {
      message: "Transaction retrieved successfully.",
      data: transaction,
    };
  }

  public async deleteTransaction(id: string): Promise<{ message: string }> {
    const transaction = await prismaClient.fine.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new ResourceNotFound(`Transaction with id ${id} not found.`);
    }

    await prismaClient.fine.delete({
      where: { id },
    });

    return {
      message: `Transaction with id ${id} has been successfully deleted.`,
    };
  }
}

export const transactionService = new TransactionService();
