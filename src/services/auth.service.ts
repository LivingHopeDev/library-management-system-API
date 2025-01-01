import { prismaClient } from "..";
import {
  Conflict,
  ResourceNotFound,
  Expired,
  BadRequest,
  Unauthorised,
} from "../middlewares";
import { IUserLogin, IUserSignUp } from "../types";
import { accountType, User } from "@prisma/client";
import {
  comparePassword,
  generateAccessToken,
  hashPassword,
  generateNumericOTP,
} from "../utils";
import { addEmailToQueue } from "../utils/queue";
import { OtpService, EmailService } from ".";
import config from "../config";

export class AuthService {
  private otpService = new OtpService();
  private emailService = new EmailService();
  public async signUp(payload: IUserSignUp): Promise<{
    message: string;
    user: Partial<User>;
  }> {
    const { username, email, password } = payload;
    const hashedPassword = await hashPassword(password);
    let user = await prismaClient.user.findFirst({ where: { email } });
    if (user) {
      throw new Conflict("User already exists");
    }

    const newUser = await prismaClient.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    const otp = await this.otpService.createOtp(newUser.id);

    const { emailBody, emailText } =
      await this.emailService.verifyEmailTemplate(username, otp!.token);
    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };
    await addEmailToQueue({
      from: config.GOOGLE_SENDER_MAIL,
      to: email,
      subject: "Email Verification",
      text: emailText,
      html: emailBody,
    });
    return {
      user: userResponse,
      message:
        "User Created Successfully. Kindly check your mail for your verification token.",
    };
  }

  public async login(payload: IUserLogin): Promise<{
    message: string;
    user: Partial<User>;
    token: string;
  }> {
    const { email, password } = payload;
    const userExist = await prismaClient.user.findFirst({ where: { email } });

    if (!userExist) {
      throw new ResourceNotFound("Authentication failed");
    }
    const isPassword = await comparePassword(password, userExist.password);
    if (!isPassword) {
      throw new ResourceNotFound("Authentication failed");
    }
    if (!userExist.is_verified) {
      throw new Unauthorised(
        "Email verification required. Please verify your email to proceed."
      );
    }
    const accessToken = await generateAccessToken(userExist.id);
    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + parseInt(config.TOKEN_EXPIRY.replace("d", ""), 10)
    );
    await prismaClient.session.upsert({
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
  }

  public async logout(userId: string, token: string): Promise<{ message }> {
    await prismaClient.session.delete({
      where: { userId, sessionToken: token },
    });

    return {
      message: "Logout sucessful",
    };
  }
  public async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await prismaClient.user.findFirst({
      where: { email: email },
    });
    if (!user) {
      throw new ResourceNotFound("User not found");
    }

    const token = generateNumericOTP(6);
    const otp_expires = new Date(Date.now() + 15 * 60 * 1000);

    const otp = await prismaClient.otp.create({
      data: {
        token: token,
        expiry: otp_expires,
        userId: user.id,
      },
    });
    const { emailBody, emailText } =
      await this.emailService.resetPasswordTemplate(user.username, otp!.token);

    await addEmailToQueue({
      from: `${config.GOOGLE_SENDER_MAIL}`,
      to: email,
      subject: "Password Reset",
      text: emailText,
      html: emailBody,
    });
    return {
      message: "OTP sent successfully",
    };
  }

  resetPassword = async (
    token: string,
    new_password: string,
    confirm_password: string
  ): Promise<{ message: string }> => {
    if (new_password !== confirm_password) {
      throw new BadRequest("Password doesn't match");
    }
    const otp = await prismaClient.otp.findFirst({
      where: { token },
      include: { user: true },
    });
    if (!otp) {
      throw new ResourceNotFound("Invalid OTP");
    }

    if (otp.expiry < new Date()) {
      // Delete the expired OTP
      await prismaClient.otp.delete({
        where: { id: otp.id },
      });
      throw new Expired("OTP has expired");
    }

    const hashedPassword = await hashPassword(new_password);
    await prismaClient.$transaction([
      prismaClient.user.update({
        where: { id: otp.userId },
        data: { password: hashedPassword },
      }),
      prismaClient.otp.delete({
        where: { id: otp.id },
      }),
    ]);

    return {
      message: "Password reset successfully.",
    };
  };

  public async resendOtp(email: string): Promise<{ message: string }> {
    const user = await prismaClient.user.findFirst({
      where: { email: email },
    });
    if (!user) {
      throw new ResourceNotFound("User not found");
    }

    const token = generateNumericOTP(6);
    const otp_expires = new Date(Date.now() + 15 * 60 * 1000);

    const otp = await prismaClient.otp.create({
      data: {
        token: token,
        expiry: otp_expires,
        userId: user.id,
      },
    });
    const { emailBody, emailText } =
      await this.emailService.resetPasswordTemplate(user.username, otp!.token);

    await addEmailToQueue({
      from: config.GOOGLE_SENDER_MAIL,
      to: email,
      subject: "Email Verification",
      text: emailText,
      html: emailBody,
    });
    return {
      message: "OTP sent successfully",
    };
  }
}
