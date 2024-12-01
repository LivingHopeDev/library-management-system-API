import { prismaClient } from "..";
import { Conflict, ResourceNotFound } from "../middlewares";
import { IUserLogin, IUserSignUp } from "../types";
import { User } from "@prisma/client";
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
      subject: "Email VERIFICATION",
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
    const accessToken = await generateAccessToken(userExist.id);
    const user = {
      username: userExist.username,
      email: userExist.email,
    };
    return {
      message: "Login Successfully",
      user,
      token: accessToken,
    };
  }
}
