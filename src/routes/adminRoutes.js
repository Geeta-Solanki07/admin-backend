import express from "express";
import {
  adminLogin,
  createAdmin,
  listAdmins,
  getAdminDetails,
  updateAdmin,
  deleteAdmin,
} from "../controllers/adminController.js";

import protect from "../middleware/adminMiddleware.js";
import isSuperAdmin from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/create", protect, isSuperAdmin, createAdmin);
router.post("/list", protect, listAdmins);
router.get("/details/:id", protect, getAdminDetails);
router.put("/update/:id", protect, updateAdmin);
router.delete("/delete/:id", protect, isSuperAdmin, deleteAdmin);

export default router;
