import dotenv from "dotenv";
import path from "path";

// Find the root .env file RELATIVE to this file's location
dotenv.config({ path: path.join(__dirname, "../../../.env") });

export const JWT_SECRET = process.env.JWT_SECRET;
export const DATABASE_URL = process.env.DATABASE_URL;