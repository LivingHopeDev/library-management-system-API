import { prismaClient } from "..";
import { Fine } from "@prisma/client";
export class FineService {
  public async retrieveFines(
    userId: string,
    query: {
      page: number;
      limit: number;
    }
  ): Promise<{ message: string; fines: Fine[]; totalPages: number }> {
    const { page = 1, limit = 10 } = query;
    const [fines, totalRecords] = await Promise.all([
      prismaClient.fine.findMany({
        where: { userId },
        skip: (page - 1) * limit,
      }),
      prismaClient.fine.count(),
    ]);
    const totalPages = Math.ceil(totalRecords / limit);
    if (fines.length === 0) {
      return { message: "No records found", fines: [], totalPages };
    }
    return {
      message: "Fines retrieved successfully",
      fines,
      totalPages,
    };
  }
}
