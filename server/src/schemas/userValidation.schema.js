import { z } from "zod";

/**
 * ✅ Common base schema (only optional shared structure)
 */
const baseUserSchema = {
  fullName: z.string().min(2, "Full name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["Male", "Female", "Other"]),
  contact: z.string().min(5),
  address: z.string().min(5),
};

/**
 * ✅ Admin Login Schema
 */
export const adminLoginSchema = z.object({
  publicId: z.string().trim().nonempty("publicId is required"),
  password: z.string().nonempty("Password is required"),
});

/**
 * ✅ Doctor Creation Schema
 */
export const addDoctorSchema = z.object({
  fullName: baseUserSchema.fullName,
  email: baseUserSchema.email,
  password: baseUserSchema.password,
  gender: baseUserSchema.gender,
  contact: baseUserSchema.contact,
  address: baseUserSchema.address,
  latestDegree: z.string().nonempty("Latest degree is required"),
  designation: z.string().nonempty("Designation is required"),
  salary: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().positive("Salary must be a positive number")
  ),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "startTime must be in HH:MM format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "endTime must be in HH:MM format"),
});
