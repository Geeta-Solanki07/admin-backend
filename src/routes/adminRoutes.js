import express from "express";
import protect from "../middleware/adminMiddleware.js";
import isSuperAdmin from "../middleware/roleMiddleware.js";
import {
  adminLogin,
  createAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", adminLogin);

router.post("/", protect, isSuperAdmin, createAdmin);
router.get("/", protect, getAdmins);
router.get("/:id", protect, getAdminById);
router.put("/:id", protect, updateAdmin);
router.delete("/:id", protect, isSuperAdmin, deleteAdmin);

export default router;
