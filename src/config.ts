import dotenv from "dotenv";
import ms from "ms";

dotenv.config();

export const clientHostProduction = process.env.CLIENT_HOST_PRODUCTION ?? 'http://localhost:5173';
export const port = process.env.PORT ?? 8080;

export const dbName = process.env.DB_NAME;
export const dbUrl = process.env.DB_URL;
export const dbToken = process.env.DB_TOKEN;

export const secretJwtWord = process.env.SECRET_JWT;

export const cldName = process.env.CLD_NAME;
export const cldKey = process.env.CLD_API_KEY;
export const cldSecret = process.env.CLD_API_SECRET;

export const convertIoApiKey = process.env.CONVERT_API_KEY;

export const HALF_HOUR = new Date(Date.now() + ms("30m"));

export const COOKIE_NAME = "session";
export const COOKIE_CONFIG = {
  maxAge: ms("30m"),
  httpOnly: true,
  secure: true,
};
