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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const https_1 = __importDefault(require("https"));
const config_1 = __importDefault(require("../config"));
const middlewares_1 = require("../middlewares");
const axios_1 = __importDefault(require("axios"));
const __1 = require("..");
class PaymentService {
    payFine(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const FINE_PAY_DAY = 1; // $1 fine per day
            const { email, bookId, preferredCurrency = "NGN" } = payload;
            const borrowedBookExist = yield __1.prismaClient.borrowedBook.findFirst({
                where: { bookId, borrowedBy: userId },
            });
            if (!borrowedBookExist) {
                throw new middlewares_1.ResourceNotFound("No record of borrowed book!");
            }
            if (!borrowedBookExist.returnedAt) {
                const currentDate = new Date();
                const isOverdue = currentDate > borrowedBookExist.dueDate;
                if (isOverdue) {
                    const daysLate = Math.ceil((currentDate.getTime() - borrowedBookExist.dueDate.getTime()) /
                        (24 * 60 * 60 * 1000));
                    const rateInPreferredCurrency = yield this.getExchangeRate("USD", preferredCurrency);
                    // Calculate fine in the preferred currency
                    const fineAmountInPreferredCurrency = daysLate * FINE_PAY_DAY * rateInPreferredCurrency;
                    //  Convert amount to smallest currency unit
                    const smallestUnitAmount = Math.round(fineAmountInPreferredCurrency * 100); // Paystack requires smallest unit (e.g., kobo, pesewas)
                    const params = JSON.stringify({
                        email,
                        amount: smallestUnitAmount,
                        currency: preferredCurrency, // Currency (e.g., NGN, GHS, USD)
                        metadata: {
                            bookId: bookId,
                            userId: userId,
                        },
                    });
                    const options = {
                        hostname: "api.paystack.co",
                        port: 443,
                        path: "/transaction/initialize",
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${config_1.default.PAYSTACK_SECRET_KEY}`,
                            "Content-Type": "application/json",
                        },
                    };
                    return new Promise((resolve, reject) => {
                        const reqPaystack = https_1.default.request(options, (res) => {
                            let data = "";
                            // Collect response chunks
                            res.on("data", (chunk) => {
                                data += chunk;
                            });
                            // Handle response completion
                            res.on("end", () => {
                                try {
                                    const parsedData = JSON.parse(data);
                                    // Handle errors from Paystack response
                                    if (res.statusCode >= 400) {
                                        reject(new middlewares_1.BadRequest(`Paystack API error: ${parsedData.message || "Unknown error"}`));
                                    }
                                    else {
                                        // Successfully resolve with parsed Paystack response
                                        resolve(parsedData);
                                    }
                                }
                                catch (err) {
                                    reject(new Error("Failed to parse response from Paystack"));
                                }
                            });
                        });
                        reqPaystack.on("error", (error) => {
                            reject(new Error(`Paystack request failed: ${error.message}`));
                        });
                        // Write the request payload and end the request
                        reqPaystack.write(params);
                        reqPaystack.end();
                    });
                }
            }
            return {
                message: "No fine required; book has been returned on time.",
            };
        });
    }
    getExchangeRate(fromCurrency, toCurrency) {
        return __awaiter(this, void 0, void 0, function* () {
            const API_KEY = config_1.default.EXCHANGE_RATE_API_KEY;
            const apiUrl = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;
            try {
                const response = yield axios_1.default.get(apiUrl);
                const rates = response.data.conversion_rates;
                if (!rates || !rates[toCurrency]) {
                    throw new Error(`Exchange rate for ${fromCurrency} to ${toCurrency} not found.`);
                }
                return rates[toCurrency];
            }
            catch (err) {
                throw new Error(`Failed to fetch exchange rate. Please try again later. ${err} `);
            }
        });
    }
    processPaymentVerification(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactionData = yield this.verifyPayment(payload);
            const result = yield this.updateModelsAfterPayment(transactionData);
            return result;
        });
    }
    verifyPayment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reference } = payload;
            if (!reference) {
                throw new middlewares_1.BadRequest("Reference is required for payment verification.");
            }
            const options = {
                hostname: "api.paystack.co",
                port: 443,
                path: `/transaction/verify/${reference}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${config_1.default.PAYSTACK_SECRET_KEY}`,
                },
            };
            return new Promise((resolve, reject) => {
                const reqPaystack = https_1.default.request(options, (res) => {
                    let data = "";
                    res.on("data", (chunk) => {
                        data += chunk;
                    });
                    res.on("end", () => {
                        var _a, _b;
                        const statusCode = res.statusCode || 500;
                        if (statusCode >= 400) {
                            return reject(new middlewares_1.BadRequest(`Paystack API responded with status code ${statusCode}`));
                        }
                        try {
                            const parsedData = JSON.parse(data);
                            if (parsedData.status !== true) {
                                return reject(new middlewares_1.BadRequest(`Payment verification failed: ${parsedData.message || "Unknown error"}`));
                            }
                            // Ensure metadata contains required info (bookId, userId)
                            const transactionData = parsedData.data;
                            if (!((_a = transactionData.metadata) === null || _a === void 0 ? void 0 : _a.bookId) ||
                                !((_b = transactionData.metadata) === null || _b === void 0 ? void 0 : _b.userId)) {
                                return reject(new middlewares_1.BadRequest("Invalid metadata: bookId and userId are required."));
                            }
                            resolve(transactionData); // Resolve with the full transaction data
                        }
                        catch (err) {
                            reject(new Error("Failed to parse Paystack verification response."));
                        }
                    });
                });
                reqPaystack.on("error", (error) => {
                    reject(error);
                });
                reqPaystack.end();
            });
        });
    }
    updateModelsAfterPayment(transactionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { metadata, amount, currency } = transactionData;
            const { bookId, userId } = metadata;
            const borrowedBookExist = yield __1.prismaClient.borrowedBook.findFirst({
                where: { bookId },
            });
            const borrowedBook = yield __1.prismaClient.borrowedBook.update({
                where: { id: borrowedBookExist.id },
                data: {
                    isFinePaid: true,
                },
            });
            if (!borrowedBook) {
                throw new middlewares_1.ResourceNotFound("No borrowed book found with the provided bookId.");
            }
            const fine = yield __1.prismaClient.fine.create({
                data: {
                    userId,
                    bookId,
                    amount: amount / 100, // Convert back from smallest unit
                    currency,
                },
            });
            return {
                message: "Payment verified and records updated successfully.",
                borrowedBook,
                fine,
            };
        });
    }
}
exports.PaymentService = PaymentService;
