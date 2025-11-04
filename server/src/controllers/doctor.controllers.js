import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

import { generatePublicId } from "../utils/generatePublicId.js";
import { timeStringToDate } from "../utils/setTimeZone.js";

/**
 * @route   POST /api/admin/add-doctor
 * @desc    Add a new doctor (Admin only)
 * @access  Private
 * @expects Validated via Zod middleware
 * @returns Status code, Success/Error Message, Doctor object (on success)
 */
export const addDoctor = async (req, res) => {
  try {
    // Destructuring values
    const {
      fullName,
      email,
      password,
      gender,
      contact,
      address,
      latestDegree,
      designation,
      salary,
      startTime,
      endTime,
    } = req.body;

    console.log(startTime, endTime);

    // 1️⃣ Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email already exists.",
      });
    }

    // 2️⃣ Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3️⃣ Get or create the Doctor role
    let doctorRole = await prisma.role.findUnique({
      where: { name: "Doctor" },
    });

    if (!doctorRole) {
      doctorRole = await prisma.role.create({
        data: { name: "Doctor", prefix: "D" },
      });
      console.log("✅ Doctor role created");
    }

    // 4️⃣ Generate a unique public ID
    const publicId = await generatePublicId("Doctor", fullName);

    // 5️⃣ Convert working hours to DateTime (Pakistan timezone handled in utils/time.js)
    const workingStart = timeStringToDate(startTime);
    const workingEnd = timeStringToDate(endTime);

    // 6️⃣ Transaction: create User → Doctor → Salary
    const newDoctor = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          publicId,
          name: fullName,
          email,
          passwordHash,
          gender,
          contact,
          address,
          roleId: doctorRole.id,
        },
      });

      const doctor = await tx.doctor.create({
        data: {
          userId: user.id,
          degree: latestDegree,
          designation,
          workingStart,
          workingEnd,
        },
        include: { user: true },
      });

      const createdSalary = await tx.salary.create({
        data: {
          userId: user.id,
          amount: parseFloat(salary),
        },
      });

      doctor.salary = createdSalary;
      return doctor;
    });

    console.log("Doctor added successfully.");

    // 7️⃣ Flat structured response
    return res.status(201).json({
      message: "Doctor added successfully.",
      doctor: {
        publicId: newDoctor.user.publicId,
        name: newDoctor.user.name,
        email: newDoctor.user.email,
        gender: newDoctor.user.gender,
        contact: newDoctor.user.contact,
        address: newDoctor.user.address,
        degree: newDoctor.degree,
        designation: newDoctor.designation,
        workingStart: newDoctor.workingStart,
        workingEnd: newDoctor.workingEnd,
        salary: newDoctor.salary.amount,
        isDeleted: newDoctor.user.isDeleted,
      },
    });
  } catch (error) {
    console.error("❌ Error in addDoctor:", error);
    return res.status(500).json({
      message: "An internal error occurred. Please try again later.",
    });
  }
};

/**
 * @route   GET /api/admin/doctors/:publicId
 * @desc    Get full doctor details by publicId (Admin only)
 * @access  Private
 * @returns Status code, Success/Error Message, Full Doctor object (on success)
 */
export const getDoctorByPublicId = async (req, res) => {
  try {
    const { publicId } = req.params;

    // 1️⃣ Find doctor (with full nested details)
    const doctorData = await prisma.user.findUnique({
      where: { publicId },
      include: {
        role: true,
        salaries: true, // ✅ salary belongs to User, not Doctor
        doctor: {
          include: {
            sessions: true, // ✅ sessions belong to Doctor
          },
        },
      },
    });

    // 2️⃣ Check if doctor exists and has the correct role
    if (!doctorData || doctorData.role.name !== "Doctor") {
      return res.status(404).json({
        message: "Doctor not found.",
      });
    }

    // 3️⃣ Combine all details (unfiltered for admin)
    const fullDoctor = {
      id: doctorData.id,
      publicId: doctorData.publicId,
      name: doctorData.name,
      email: doctorData.email,
      gender: doctorData.gender,
      contact: doctorData.contact,
      address: doctorData.address,
      isDeleted: doctorData.isDeleted,
      createdAt: doctorData.createdAt,
      updatedAt: doctorData.updatedAt,
      role: {
        id: doctorData.role.id,
        name: doctorData.role.name,
        prefix: doctorData.role.prefix,
      },
      doctorDetails: doctorData.doctor
        ? {
            id: doctorData.doctor.id,
            degree: doctorData.doctor.degree,
            designation: doctorData.doctor.designation,
            workingStart: doctorData.doctor.workingStart,
            workingEnd: doctorData.doctor.workingEnd,
          }
        : null,
      salaries: doctorData.salaries?.map((s) => ({
        id: s.id,
        amount: s.amount,
        paidTill: s.paidTill,
      })),
    };

    // 4️⃣ Send response
    return res.status(200).json({ doctor: fullDoctor });
  } catch (err) {
    console.error("❌ Error in getDoctorByPublicId:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

/**
 * @route   GET /api/admin/doctors/count
 * @desc    Get total number of doctors in the system
 * @access  Private (Admin only)
 * @returns {Number} totalDoctors
 */
export const getDoctorCount = async (req, res) => {
  try {
    // 1️⃣ Find the Doctor role ID (cached via DB query)
    const doctorRole = await prisma.role.findUnique({
      where: { name: "Doctor" },
    });

    if (!doctorRole) {
      return res.status(404).json({
        message: "Doctor role not found. Please ensure roles are initialized.",
      });
    }

    // 2️⃣ Count total users assigned to the Doctor role
    const totalDoctors = await prisma.user.count({
      where: {
        roleId: doctorRole.id,
        isDeleted: false, // Optional: exclude soft-deleted doctors
      },
    });

    // 3️⃣ Return clean structured response
    return res.status(200).json({
      message: "Doctor count retrieved successfully.",
      totalDoctors,
    });
  } catch (error) {
    console.error("❌ Error in getDoctorCount:", error);
    return res.status(500).json({
      message: "An internal error occurred. Please try again later.",
    });
  }
};

/**
 * @route   GET /api/admin/doctors
 * @desc    Get all doctors with pagination, search, and joined info
 * @access  Private (Admin only)
 * @query   ?page=1&limit=10&search=ali
 * @returns {Object} Paginated list of doctors
 */
export const getAllDoctors = async (req, res) => {
  try {
    // 1️⃣ Extract & sanitize query params
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
    const search = (req.query.search || "").toString().trim();

    // 2️⃣ Ensure Doctor role exists
    const doctorRole = await prisma.role.findUnique({
      where: { name: "Doctor" },
    });

    if (!doctorRole) {
      return res.status(404).json({
        message: "Doctor role not found. Please ensure roles are initialized.",
      });
    }

    // 3️⃣ Build where clause
    const whereClause = {
      roleId: doctorRole.id,
      isDeleted: false,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          {
            doctor: {
              designation: { contains: search, mode: "insensitive" },
            },
          },
        ],
      }),
    };

    // 4️⃣ Count total doctors for pagination
    const totalDoctors = await prisma.user.count({ where: whereClause });

    // 5️⃣ Query paginated users with relations
    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        doctor: {
          select: {
            degree: true,
            designation: true,
            workingStart: true,
            workingEnd: true,
          },
        },
        // salaries is an array in your schema; fetch latest one by id desc
        salaries: {
          select: { amount: true, paidTill: true, id: true },
          orderBy: { id: "desc" }, // use existing field
          take: 1,
        },
        role: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // 6️⃣ Format records
    const formattedDoctors = users.map((u) => {
      const latestSalary =
        u.salaries && u.salaries.length > 0 ? u.salaries[0].amount : null;

      // Convert workingStart/End datetimes to "HH:mm" (Pakistan or server local)
      const formatTime = (dt) => {
        if (!dt) return null;
        try {
          const d = new Date(dt);
          // produce "HH:mm" zero-padded 24-hour format
          const hh = String(d.getHours()).padStart(2, "0");
          const mm = String(d.getMinutes()).padStart(2, "0");
          return `${hh}:${mm}`;
        } catch {
          return null;
        }
      };

      return {
        publicId: u.publicId,
        name: u.name,
        email: u.email,
        gender: u.gender,
        contact: u.contact,
        address: u.address,
        degree: u.doctor?.degree ?? null,
        designation: u.doctor?.designation ?? null,
        workingStart: formatTime(u.doctor?.workingStart ?? null),
        workingEnd: formatTime(u.doctor?.workingEnd ?? null),
        salary: latestSalary ?? null,
        isDeleted: u.isDeleted,
      };
    });

    // 7️⃣ Send response
    return res.status(200).json({
      message: "Doctors retrieved successfully.",
      pagination: {
        total: totalDoctors,
        page,
        limit,
        totalPages: Math.ceil(totalDoctors / limit),
      },
      data: formattedDoctors,
    });
  } catch (err) {
    console.error("❌ Error in getAllDoctors:", err);
    return res.status(500).json({
      message: "An internal error occurred. Please try again later.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * @route   PUT /api/admin/edit-doctor/:publicId
 * @desc    Update existing doctor (Admin only)
 * @access  Private
 * @expects Body: {
 *  fullName, email, gender, contact, address,
 *  latestDegree, designation, salary, startTime, endTime, password?
 * }
 */
export const editDoctorByPublicId = async (req, res) => {
  try {
    const { publicId } = req.params;
    const {
      fullName,
      email,
      gender,
      contact,
      address,
      latestDegree,
      designation,
      salary,
      startTime,
      endTime,
      password, // optional
    } = req.body;

    // 1️⃣ Fetch doctor with relations
    const doctorData = await prisma.user.findUnique({
      where: { publicId },
      include: {
        role: true,
        doctor: true,
        salaries: {
          orderBy: { id: "desc" }, // ✅ FIXED: order by id instead of createdAt
          take: 1,
        },
      },
    });

    if (!doctorData || doctorData.role.name !== "Doctor") {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // 2️⃣ Prepare update objects
    const userUpdates = {};
    const doctorUpdates = {};
    let salaryUpdateNeeded = false;
    let newSalaryValue = null;

    // --- User fields ---
    if (fullName && fullName !== doctorData.name) userUpdates.name = fullName;
    if (email && email !== doctorData.email) userUpdates.email = email;
    if (gender && gender !== doctorData.gender) userUpdates.gender = gender;
    if (contact && contact !== doctorData.contact)
      userUpdates.contact = contact;
    if (address && address !== doctorData.address)
      userUpdates.address = address;

    // --- Doctor fields ---
    if (latestDegree && latestDegree !== doctorData.doctor?.degree)
      doctorUpdates.degree = latestDegree;
    if (designation && designation !== doctorData.doctor?.designation)
      doctorUpdates.designation = designation;

    const newStart = timeStringToDate(startTime);
    const newEnd = timeStringToDate(endTime);

    if (
      newStart.toISOString() !==
        doctorData.doctor?.workingStart?.toISOString() ||
      newEnd.toISOString() !== doctorData.doctor?.workingEnd?.toISOString()
    ) {
      doctorUpdates.workingStart = newStart;
      doctorUpdates.workingEnd = newEnd;
    }

    // --- Password ---
    if (password && password.trim() !== "") {
      const isSame = await bcrypt.compare(password, doctorData.passwordHash);
      if (!isSame) {
        userUpdates.passwordHash = await bcrypt.hash(password, 10);
      }
    }

    // --- Salary ---
    const currentSalary = doctorData.salaries?.[0]?.amount || 0;
    if (parseFloat(salary) !== currentSalary) {
      salaryUpdateNeeded = true;
      newSalaryValue = parseFloat(salary);
    }

    // 3️⃣ If no changes
    if (
      Object.keys(userUpdates).length === 0 &&
      Object.keys(doctorUpdates).length === 0 &&
      !salaryUpdateNeeded
    ) {
      return res.status(200).json({ message: "No changes detected." });
    }

    // 4️⃣ Transaction update
    const updatedDoctor = await prisma.$transaction(async (tx) => {
      let updatedUser = null;
      let updatedDoctorData = null;
      let updatedSalary = null;

      if (Object.keys(userUpdates).length > 0) {
        updatedUser = await tx.user.update({
          where: { id: doctorData.id },
          data: userUpdates,
        });
      }

      if (Object.keys(doctorUpdates).length > 0) {
        updatedDoctorData = await tx.doctor.update({
          where: { id: doctorData.doctor.id },
          data: doctorUpdates,
        });
      }

      if (salaryUpdateNeeded) {
        updatedSalary = await tx.salary.create({
          data: {
            userId: doctorData.id,
            amount: newSalaryValue,
          },
        });
      }

      return { updatedUser, updatedDoctorData, updatedSalary };
    });

    // 5️⃣ Send response
    return res.status(200).json({
      message: "Doctor updated successfully.",
      updates: {
        ...(updatedDoctor.updatedUser && { user: userUpdates }),
        ...(updatedDoctor.updatedDoctorData && { doctor: doctorUpdates }),
        ...(updatedDoctor.updatedSalary && {
          salary: updatedDoctor.updatedSalary.amount,
        }),
      },
    });
  } catch (error) {
    console.error("❌ Error in editDoctorByPublicId:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
