import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT ?? 8000,
  NODE_ENV: process.env.NODE_ENV,
  TOKEN_SECRET: process.env.AUTH_SECRET,
  TOKEN_EXPIRY: process.env.AUTH_EXPIRY,
  GOOGLE_USER: process.env.GOOGLE_USER,
  GOOGLE_SENDER_MAIL: process.env.GOOGLE_SENDER_MAIL,
  GOOGLE_APP_PASSWORD: process.env.GOOGLE_APP_PASSWORD,
  BULL_PASSKEY: process.env.BULL_PASSKEY,
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || null, // Optional,
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
};

export default config;
