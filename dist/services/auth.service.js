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
exports.AuthService = void 0;
const __1 = require("..");
const middlewares_1 = require("../middlewares");
const utils_1 = require("../utils");
const queue_1 = require("../utils/queue");
const _1 = require(".");
const config_1 = __importDefault(require("../config"));
class AuthService {
    constructor() {
        this.otpService = new _1.OtpService();
        this.emailService = new _1.EmailService();
        this.resetPassword = (token, new_password, confirm_password) => __awaiter(this, void 0, void 0, function* () {
            if (new_password !== confirm_password) {
                throw new middlewares_1.BadRequest("Password doesn't match");
            }
            const otp = yield __1.prismaClient.otp.findFirst({
                where: { token },
                include: { user: true },
            });
            if (!otp) {
                throw new middlewares_1.ResourceNotFound("Invalid OTP");
            }
            if (otp.expiry < new Date()) {
                // Delete the expired OTP
                yield __1.prismaClient.otp.delete({
                    where: { id: otp.id },
                });
                throw new middlewares_1.Expired("OTP has expired");
            }
            const hashedPassword = yield (0, utils_1.hashPassword)(new_password);
            yield __1.prismaClient.$transaction([
                __1.prismaClient.user.update({
                    where: { id: otp.userId },
                    data: { password: hashedPassword },
                }),
                __1.prismaClient.otp.delete({
                    where: { id: otp.id },
                }),
            ]);
            return {
                message: "Password reset successfully.",
            };
        });
    }
    signUp(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password } = payload;
            const hashedPassword = yield (0, utils_1.hashPassword)(password);
            let user = yield __1.prismaClient.user.findFirst({ where: { email } });
            if (user) {
                throw new middlewares_1.Conflict("User already exists");
            }
            const newUser = yield __1.prismaClient.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                },
            });
            const otp = yield this.otpService.createOtp(newUser.id);
            const { emailBody, emailText } = yield this.emailService.verifyEmailTemplate(username, otp.token);
            const userResponse = {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            };
            yield (0, queue_1.addEmailToQueue)({
                from: config_1.default.GOOGLE_SENDER_MAIL,
                to: email,
                subject: "Email Verification",
                text: emailText,
                html: emailBody,
            });
            return {
                user: userResponse,
                message: "User Created Successfully. Kindly check your mail for your verification token.",
            };
        });
    }
    login(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = payload;
            const userExist = yield __1.prismaClient.user.findFirst({ where: { email } });
            if (!userExist) {
                throw new middlewares_1.ResourceNotFound("Authentication failed");
            }
            const isPassword = yield (0, utils_1.comparePassword)(password, userExist.password);
            if (!isPassword) {
                throw new middlewares_1.ResourceNotFound("Authentication failed");
            }
            if (!userExist.is_verified) {
                throw new middlewares_1.Unauthorised("Email verification required. Please verify your email to proceed.");
            }
            const accessToken = yield (0, utils_1.generateAccessToken)(userExist.id);
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + parseInt(config_1.default.TOKEN_EXPIRY.replace("d", ""), 10));
            yield __1.prismaClient.session.upsert({
                where: { userId: userExist.id },
                update: { sessionToken: accessToken, expiresAt },
                create: { userId: userExist.id, sessionToken: accessToken, expiresAt },
            });
            const user = {
                username: userExist.username,
                email: userExist.email,
                accountType: userExist.accountType,
            };
            return {
                message: "Login Successfully",
                user,
                token: accessToken,
            };
        });
    }
    logout(userId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.prismaClient.session.delete({
                where: { userId, sessionToken: token },
            });
            return {
                message: "Logout sucessful",
            };
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield __1.prismaClient.user.findFirst({
                where: { email: email },
            });
            if (!user) {
                throw new middlewares_1.ResourceNotFound("User not found");
            }
            const token = (0, utils_1.generateNumericOTP)(6);
            const otp_expires = new Date(Date.now() + 15 * 60 * 1000);
            const otp = yield __1.prismaClient.otp.create({
                data: {
                    token: token,
                    expiry: otp_expires,
                    userId: user.id,
                },
            });
            const { emailBody, emailText } = yield this.emailService.resetPasswordTemplate(user.username, otp.token);
            yield (0, queue_1.addEmailToQueue)({
                from: `${config_1.default.GOOGLE_SENDER_MAIL}`,
                to: email,
                subject: "Password Reset",
                text: emailText,
                html: emailBody,
            });
            return {
                message: "OTP sent successfully",
            };
        });
    }
    resendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield __1.prismaClient.user.findFirst({
                where: { email: email },
            });
            if (!user) {
                throw new middlewares_1.ResourceNotFound("User not found");
            }
            const token = (0, utils_1.generateNumericOTP)(6);
            const otp_expires = new Date(Date.now() + 15 * 60 * 1000);
            const otp = yield __1.prismaClient.otp.create({
                data: {
                    token: token,
                    expiry: otp_expires,
                    userId: user.id,
                },
            });
            const { emailBody, emailText } = yield this.emailService.resetPasswordTemplate(user.username, otp.token);
            yield (0, queue_1.addEmailToQueue)({
                from: config_1.default.GOOGLE_SENDER_MAIL,
                to: email,
                subject: "Email Verification",
                text: emailText,
                html: emailBody,
            });
            return {
                message: "OTP sent successfully",
            };
        });
    }
}
exports.AuthService = AuthService;
