import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 3000,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",

  JWT_SECRET: process.env.JWT_SECRET,

  adminId: process.env.INIT_ADMIN_ID,
  adminPassword: process.env.INIT_ADMIN_PASSWORD,
  adminName: process.env.INIT_ADMIN_NAME,
};

// ✅ Basic validation for critical env vars
if (!env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables");
}
