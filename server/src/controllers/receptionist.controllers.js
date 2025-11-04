import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { generatePublicId } from "../utils/generatePublicId.js";

/**
 * @route   POST /api/admin/add-receptionist
 * @desc    Add a new receptionist (Admin only)
 * @access  Private
 * @expects Validated via Zod middleware
 * @returns JSON: Status code, message, and created receptionist details
 */
export const addReceptionist = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      gender,
      contact,
      address,
      salaryAmount,
    } = req.body;

    // 1️⃣ Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // 2️⃣ Get or create Receptionist role
    const receptionistRole =
      (await prisma.role.findUnique({ where: { name: "Receptionist" } })) ||
      (await prisma.role.create({
        data: { name: "Receptionist", prefix: "R" },
      }));

    // 3️⃣ Generate a unique public ID
    const publicId = await generatePublicId("Receptionist", fullName);

    // 4️⃣ Hash password securely
    const passwordHash = await bcrypt.hash(password, 12);

    // 5️⃣ Transaction: Create User + Receptionist + Salary
    const { user, salary } = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: fullName,
          email,
          passwordHash,
          gender,
          contact,
          address,
          publicId,
          roleId: receptionistRole.id,
        },
      });

      await tx.receptionist.create({
        data: { userId: user.id },
      });

      const salary = await tx.salary.create({
        data: {
          userId: user.id,
          amount: salaryAmount,
        },
      });

      return { user, salary };
    });

    // 6️⃣ Return structured, safe response
    return res.status(201).json({
      success: true,
      message: "Receptionist added successfully.",
      data: {
        id: user.id,
        publicId: user.publicId,
        fullName: user.name,
        email: user.email,
        contact: user.contact,
        address: user.address,
        gender: user.gender,
        salary: salary.amount,
        role: receptionistRole.name,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Error in addReceptionist:", error);

    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

/**
 * @route   DELETE /api/admin/receptionist/:publicId
 * @desc    Soft delete receptionist by publicId
 * @access  Private
 */
export const deleteReceptionistByPublicId = async (req, res) => {
  const { publicId } = req.params;
  console.log("🧾 Delete Receptionist request for:", publicId);

  try {
    // 1️⃣ Find user by publicId
    const receptionistUser = await prisma.user.findUnique({
      where: { publicId },
      include: { receptionist: true },
    });

    if (!receptionistUser) {
      return res.status(404).json({
        success: false,
        message: "Receptionist not found.",
      });
    }

    // 2️⃣ Apply soft delete
    const updatedUser = await prisma.user.update({
      where: { publicId },
      data: { isDeleted: true },
    });

    console.info(`✅ Receptionist ${publicId} marked as deleted.`);

    return res.status(200).json({
      success: true,
      message: "Receptionist deleted successfully (soft delete applied).",
      data: {
        publicId: updatedUser.publicId,
        name: updatedUser.name,
        isDeleted: updatedUser.isDeleted,
        deletedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("❌ Error in deleteReceptionistByPublicId:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while deleting Receptionist.",
    });
  }
};
