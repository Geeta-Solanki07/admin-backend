// import express from "express";
// import {
//   adminLogin,
//   createAdmin,
//   listAdmins,
//   getAdminDetails,
//   updateAdmin,
//   deleteAdmin,
// } from "../controllers/adminController.js";
// import { protect, isSuperAdmin } from "../middleware/adminMiddleware.js";
// import { upload } from "../controllers/adminController.js";

// const router = express.Router();

// router.post("/login", adminLogin);
// router.post("/create", protect, isSuperAdmin, upload.single("profilePic"), createAdmin);
// router.get("/list", protect, isSuperAdmin, listAdmins);
// router.get("/details/:id", protect, getAdminDetails);
// router.put("/update/:id", protect, upload.single("profilePic"), updateAdmin);
// router.delete("/delete/:id", protect, isSuperAdmin, deleteAdmin);

// export default router;


import express from "express";
import {
  adminLogin,
  createAdmin,
  listAdmins,
  getAdminDetails,
  updateAdmin,
  deleteAdmin,
} from "../controllers/adminController.js";
import { protect, isSuperAdmin } from "../middleware/adminMiddleware.js";
import multer from "multer";

const router = express.Router();

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ AUTH
router.post("/login", adminLogin);

// ✅ ADMIN MANAGEMENT
router.post("/create", protect, isSuperAdmin, upload.single("profilePic"), createAdmin);
router.post("/list", protect, isSuperAdmin, listAdmins); // POST method for listing admins
router.get("/details/:id", protect, getAdminDetails);
router.put("/update/:id", protect, upload.single("profilePic"), updateAdmin);
router.delete("/delete/:id", protect, isSuperAdmin, deleteAdmin);

export default router;
