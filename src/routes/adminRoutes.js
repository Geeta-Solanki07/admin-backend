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

const router = express.Router();

// AUTH
router.post("/login", adminLogin);

// ADMIN MANAGEMENT
router.post("/create", protect, isSuperAdmin, createAdmin);

router.get("/list", protect, isSuperAdmin, listAdmins);

router.get("/details/:id", protect, getAdminDetails);

router.put("/update/:id", protect, updateAdmin);

router.delete("/delete/:id", protect, isSuperAdmin, deleteAdmin);

export default router;
