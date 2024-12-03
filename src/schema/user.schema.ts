import { z } from "zod";

export const SignUpSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});
export const otpSchema = z.object({
  token: z.string(),
});
export const resetPasswordSchema = z.object({
  token: z.string(),
  new_password: z.string().min(6),
  confirm_password: z.string().min(6),
});
