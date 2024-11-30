import config from "../config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export async function generateAccessToken(userId: string) {
  return await jwt.sign({ userId }, config.TOKEN_SECRET!, {
    expiresIn: config.TOKEN_EXPIRY,
  });
}

export const generateNumericOTP = (length: number): string => {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 9 + 1).toString();
  }
  return otp;
};
