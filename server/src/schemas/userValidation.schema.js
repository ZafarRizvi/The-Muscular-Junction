import { z } from "zod";

// Base User Schema (shared structure)
const baseUserSchema = {
  fullName: z.string().trim().min(2, "Full name too short"),
  email: z.string().trim().email("Invalid email"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["Male", "Female", "Other"]),
  contact: z.string().trim().min(5, "Invalid contact number"),
  address: z.string().trim().min(5, "Address too short"),
};

// Admin Login Schema
export const adminLoginSchema = z.object({
  publicId: z.string().trim().nonempty("publicId is required"),
  password: z.string().trim().nonempty("Password is required"),
});

// Doctor Creation Schema
export const addDoctorSchema = z.object({
  fullName: baseUserSchema.fullName,
  email: baseUserSchema.email,
  password: baseUserSchema.password,
  gender: baseUserSchema.gender,
  contact: baseUserSchema.contact,
  address: baseUserSchema.address,
  latestDegree: z.string().trim().nonempty("Latest degree is required"),
  designation: z.string().trim().nonempty("Designation is required"),
  salary: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().positive("Salary must be a positive number")
  ),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "startTime must be in HH:MM format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "endTime must be in HH:MM format"),
});

// Receptionist Creation Schema
export const addReceptionistSchema = z.object({
  fullName: baseUserSchema.fullName,
  email: baseUserSchema.email,
  password: baseUserSchema.password,
  gender: baseUserSchema.gender,
  contact: baseUserSchema.contact,
  address: baseUserSchema.address,
  salaryAmount: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().positive("Salary must be a positive number")
  ),
});
