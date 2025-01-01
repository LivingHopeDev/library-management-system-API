"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const __1 = require("..");
const middlewares_1 = require("../middlewares");
class UserService {
    getAllUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = query;
            const [users, totalRecords] = yield Promise.all([
                __1.prismaClient.user.findMany({ skip: (page - 1) * limit, take: limit }),
                __1.prismaClient.user.count(),
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
        });
    }
    updateProfile(userId, profileData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield __1.prismaClient.user.findUnique({
                where: { id: userId },
                include: { profile: true },
            });
            if (!user) {
                throw new middlewares_1.ResourceNotFound("User not found");
            }
            if (!user.profile) {
                const newProfile = yield __1.prismaClient.profile.create({
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
            const updatedProfile = yield __1.prismaClient.profile.update({
                where: { userId },
                data: profileData,
            });
            return { message: "Profile update successfully", data: updatedProfile };
        });
    }
    updateUserProfile(userId, profileData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, accountType } = profileData, profileDetails = __rest(profileData, ["username", "email", "accountType"]);
            const { name, address, phone, country, state, countryCode } = profileDetails;
            // Fetch the user and include their profile
            const user = yield __1.prismaClient.user.findUnique({
                where: { id: userId },
                include: { profile: true },
            });
            if (!user) {
                throw new middlewares_1.ResourceNotFound("User not found");
            }
            // Update User model fields (if provided)
            let updatedUser = user;
            if (username || email || accountType) {
                updatedUser = yield __1.prismaClient.user.update({
                    where: { id: userId },
                    data: { username, email, accountType },
                });
            }
            // Handle Profile fields
            let updatedProfile = user.profile;
            if (Object.keys(profileDetails).length > 0) {
                if (!user.profile) {
                    updatedProfile = yield __1.prismaClient.profile.create({
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
                }
                else {
                    updatedProfile = yield __1.prismaClient.profile.update({
                        where: { userId },
                        data: profileDetails,
                    });
                }
            }
            return {
                message: "User details updated successfully",
                data: { user: updatedUser, profile: updatedProfile },
            };
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield __1.prismaClient.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new middlewares_1.ResourceNotFound("User not found");
            }
            const userDeleted = yield __1.prismaClient.user.delete({
                where: { id: userId },
            });
            if (!userDeleted) {
                return {
                    message: "Failed to delete User",
                };
            }
            return {
                message: "User deleted successfully",
            };
        });
    }
}
exports.UserService = UserService;
