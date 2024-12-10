import { User } from "@prisma/client";
import { prismaClient } from "..";

export class UserService {
  public async getAllUsers(query: {
    page: number;
    limit: number;
  }): Promise<{ message: string; users: User[]; totalPages: number }> {
    const { page = 1, limit = 10 } = query;

    const [users, totalRecords] = await Promise.all([
      prismaClient.user.findMany({ skip: (page - 1) * limit, take: limit }),
      prismaClient.user.count(),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);
    if (users.length === 0) {
      return {
        message: "No user record found",
        users: [],
        totalPages,
      };
    }
    return {
      message: "Users retrieved successfully",
      users,
      totalPages,
    };
  }
}
