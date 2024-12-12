import { Profile, User } from "@prisma/client";
import { prismaClient } from "..";
import { ResourceNotFound, Conflict } from "../middlewares";

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

  public async updateProfile(
    userId: string,
    profileData: Partial<Profile>
  ): Promise<{ message: string; data: Profile }> {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new ResourceNotFound("User not found");
    }

    if (!user.profile) {
      const newProfile = await prismaClient.profile.create({
        data: {
          userId,
          name: profileData.name,
          address: profileData.address,
          phone: profileData.phone,
          country: profileData.country,
          state: profileData.state,
          countryCode: profileData.countryCode,
        },
      });
      return { message: "Profile update successfully", data: newProfile };
    }

    const updatedProfile = await prismaClient.profile.update({
      where: { userId },
      data: profileData,
    });

    return { message: "Profile update successfully", data: updatedProfile };
  }

  public async updateUserProfile(
    userId: string,
    profileData: Partial<Profile & User>
  ): Promise<{ message: string; data: { user: User; profile: Profile } }> {
    const { username, email, accountType, ...profileDetails } = profileData;
    const { name, address, phone, country, state, countryCode } =
      profileDetails;

    // Fetch the user and include their profile
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new ResourceNotFound("User not found");
    }

    // Update User model fields (if provided)
    let updatedUser: Profile | User = user;
    if (username || email || accountType) {
      updatedUser = await prismaClient.user.update({
        where: { id: userId },
        data: { username, email, accountType },
      });
    }

    // Handle Profile fields
    let updatedProfile = user.profile;
    if (Object.keys(profileDetails).length > 0) {
      if (!user.profile) {
        updatedProfile = await prismaClient.profile.create({
          data: {
            userId,
            name,
            address,
            phone,
            country,
            state,
            countryCode,
          },
        });
      } else {
        updatedProfile = await prismaClient.profile.update({
          where: { userId },
          data: profileDetails,
        });
      }
    }

    return {
      message: "User details updated successfully",
      data: { user: updatedUser, profile: updatedProfile },
    };
  }
}
