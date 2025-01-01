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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FineService = void 0;
const __1 = require("..");
class FineService {
    retrieveFines(userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = query;
            const [fines, totalRecords] = yield Promise.all([
                __1.prismaClient.fine.findMany({
                    where: { userId },
                    skip: (page - 1) * limit,
                }),
                __1.prismaClient.fine.count(),
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
        });
    }
}
exports.FineService = FineService;
