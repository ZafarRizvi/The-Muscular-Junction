import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { env } from "../config/env.js";

// Admin Login Controller
// POST /api/admin/login
// Expects: { publicId, password }
// Returns: message + admin details (cookie is automatically stored)
export const adminLogin = async (req, res) => {
  const { publicId, password } = req.body;

  try {
    // 1️⃣ Find user and include role
    const adminUser = await prisma.user.findUnique({
      where: { publicId },
      include: { role: true },
    });

    if (!adminUser || adminUser.role.name !== "Admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 2️⃣ Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      adminUser.passwordHash
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Generate JWT
    const token = jwt.sign(
      {
        id: adminUser.publicId,
        name: adminUser.name,
        role: adminUser.role.name,
      },
      env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4️⃣ Set JWT as HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // ✅ 1 day
    });

    // 5️⃣ Success response (no token in JSON)
    return res.status(200).json({
      message: "Login successful",
      admin: {
        id: adminUser.publicId,
        name: adminUser.name,
        role: adminUser.role.name,
      },
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Admin Logout Controller
// POST /api/admin/logout
// Expects: nothing
// Returns: message (clears the auth cookie)
export const adminLogout = async (req, res) => {
  try {
    // ✅ Clear the cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Admin Profile Controller
// GET /api/admin/me
// Expects: auth cookie
// Returns: admin details
export const getAdminProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, env.JWT_SECRET);

    const adminUser = await prisma.user.findUnique({
      where: { publicId: decoded.id },
      include: { role: true },
    });

    if (!adminUser) return res.status(404).json({ message: "User not found" });

    res.json({
      admin: {
        id: adminUser.publicId,
        name: adminUser.name,
        role: adminUser.role.name,
      },
    });
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
