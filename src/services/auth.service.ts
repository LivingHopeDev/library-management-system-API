import { prismaClient } from "..";
import { Conflict, ResourceNotFound } from "../middlewares";
import { IUserLogin, IUserSignUp } from "../types";
import { User } from "@prisma/client";
import { comparePassword, generateAccessToken, hashPassword } from "../utils";
export class AuthService {
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

    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };
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
