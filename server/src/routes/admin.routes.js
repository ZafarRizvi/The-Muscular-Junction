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
  editDoctorByPublicId,
  getAllDoctors,
  getDoctorByPublicId,
  getDoctorCount,
} from "../controllers/doctor.controllers.js";
import {
  addDoctorSchema,
  adminLoginSchema,
} from "../schemas/userValidation.schema.js";

const router = express.Router();

router.post("/login", validationMiddleware(adminLoginSchema), adminLogin);
router.post("/logout", adminLogout);
router.get("/me", getAdminProfile);

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

export default router;
