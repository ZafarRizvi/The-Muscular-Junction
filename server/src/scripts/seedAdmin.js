import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import { env } from "../config/env.js";

export const seedAdmin = async () => {
  try {
    let adminRole = await prisma.role.findUnique({
      where: { name: "Admin" },
    });

    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: { name: "Admin", prefix: "A" },
      });
      console.log("✅ Admin role created");
    }

    const existingAdmin = await prisma.user.findUnique({
      where: { publicId: env.adminId },
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists, skipping seeding");
      return;
    }

    const hashedPassword = await bcrypt.hash(env.adminPassword, 10);

    await prisma.user.create({
      data: {
        publicId: env.adminId,
        name: env.adminName,
        passwordHash: hashedPassword,
        roleId: adminRole.id,
      },
    });

    console.log("✅ Admin user seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  }
};
