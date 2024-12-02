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
