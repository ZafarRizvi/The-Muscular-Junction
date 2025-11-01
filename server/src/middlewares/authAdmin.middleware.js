import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const authAdminMiddleware = (req, res, next) => {
  try {
    // 1️⃣ Get token (support both custom and standard headers)
    const token =
      req.headers.atoken ||
      req.cookies?.token || // ✅ add this line
      req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // 3️⃣ Check role
    if (!decoded || decoded.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden: Admin access only." });
    }

    // 4️⃣ Attach admin data to request
    req.admin = decoded;
    console.log("✅ Admin verified:", req.admin);

    next();
  } catch (error) {
    console.error("❌ JWT verification failed:", error.message);

    // Differentiate error types
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }

    return res.status(500).json({ message: "Internal server error." });
  }
};

export default authAdminMiddleware;
