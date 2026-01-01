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

// const router = express.Router();

// // AUTH
// router.post("/login", adminLogin);

// // ADMIN CRUD
// router.post("/create", protect, isSuperAdmin, createAdmin);
// router.post("/list", protect, isSuperAdmin, listAdmins);
// router.get("/details/:id", protect, getAdminDetails);
// router.put("/update/:id", protect, updateAdmin);
// router.delete("/delete/:id", protect, isSuperAdmin, deleteAdmin);

// export default router;


import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  adminLogin,
  createAdmin,
  updateAdmin,
  listAdmins,
  getAdminDetails,
  deleteAdmin,
} from "../controllers/adminController.js";
import { protect, isSuperAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/login", adminLogin);

router.post(
  "/create",
  protect,
  isSuperAdmin,
  upload.single("profilePic"),
  createAdmin
);

router.put(
  "/update/:id",
  protect,
  upload.single("profilePic"),
  updateAdmin
);

router.post("/list", protect, isSuperAdmin, listAdmins);
router.get("/details/:id", protect, getAdminDetails);
router.delete("/delete/:id", protect, isSuperAdmin, deleteAdmin);

export default router;


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
// import multer from "multer";

// const router = express.Router();

// // Multer setup for file upload
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // ✅ AUTH
// router.post("/login", adminLogin);

// // ✅ ADMIN MANAGEMENT
// router.post("/create", protect, isSuperAdmin, upload.single("profilePic"), createAdmin);
// router.post("/list", protect, isSuperAdmin, listAdmins); // POST method for listing admins
// router.get("/details/:id", protect, getAdminDetails);
// router.put("/update/:id", protect, upload.single("profilePic"), updateAdmin);
// router.delete("/delete/:id", protect, isSuperAdmin, deleteAdmin);

// export default router;
