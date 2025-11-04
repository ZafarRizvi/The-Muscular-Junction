import express from "express";
import {
  adminLogin,
  adminLogout,
  getAdminProfile,
} from "../controllers/admin.controllers.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import authAdminMiddleware from "../middlewares/authAdmin.middleware.js";
import {
  addDoctor,
  deleteDoctorByPublicId,
  editDoctorByPublicId,
  getAllDoctors,
  getDoctorByPublicId,
  getDoctorCount,
} from "../controllers/doctor.controllers.js";
import {
  addDoctorSchema,
  addReceptionistSchema,
  adminLoginSchema,
} from "../schemas/userValidation.schema.js";
import {
  addReceptionist,
  deleteReceptionistByPublicId,
} from "../controllers/receptionist.controllers.js";

const router = express.Router();

// Admin Routes
router.post("/login", validationMiddleware(adminLoginSchema), adminLogin);
router.post("/logout", adminLogout);
router.get("/me", getAdminProfile);

// Doctors routes for admin
router.post(
  "/add-doctor",
  authAdminMiddleware,
  validationMiddleware(addDoctorSchema),
  addDoctor
);
router.get("/doctors/count", authAdminMiddleware, getDoctorCount);
router.get("/doctor/:publicId", authAdminMiddleware, getDoctorByPublicId);
router.get("/doctors", authAdminMiddleware, getAllDoctors);
router.put("/edit-doctor/:publicId", authAdminMiddleware, editDoctorByPublicId);
router.delete(
  "/delete-doctor/:publicId",
  authAdminMiddleware,
  deleteDoctorByPublicId
);

// Receptionist routes for admin
router.post(
  "/add-receptionist",
  authAdminMiddleware,
  validationMiddleware(addReceptionistSchema),
  addReceptionist
);
router.delete(
  "/delete-receptionist/:publicId",
  authAdminMiddleware,
  deleteReceptionistByPublicId
);

export default router;
