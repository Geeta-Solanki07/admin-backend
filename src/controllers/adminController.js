// import Admin from "../models/admin.Schema.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import { sendResponse } from "../utils/sendResponse.js";
// import cloudinary from "../utils/cloudinary.js";
// import multer from "multer";

// // MULTER SETUP
// const storage = multer.diskStorage({});
// export const upload = multer({ storage });

// // JWT GENERATOR
// const generateToken = (admin) => {
//   return jwt.sign({ adminId: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
// };

// // ADMIN LOGIN
// export const adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return sendResponse(res, 400, "Failed", "Email and password required");

//     const admin = await Admin.findOne({ email }).select("+password");
//     if (!admin) return sendResponse(res, 401, "Failed", "Invalid credentials");

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) return sendResponse(res, 401, "Failed", "Invalid credentials");

//     const token = generateToken(admin);
//     await Admin.findByIdAndUpdate(admin._id, { token }, { new: true });

//     return sendResponse(res, 200, "Success", "Admin login successful", {
//       token,
//       tokenType: "Bearer",
//       admin: { id: admin._id, firstName: admin.firstName, lastName: admin.lastName, email: admin.email, phone: admin.phone, role: admin.role, profilePic: admin.profilePic },
//     });
//   } catch (error) {
//     console.error("ADMIN LOGIN ERROR:", error);
//     return sendResponse(res, 500, "Failed", "Internal server error");
//   }
// };

// // CREATE ADMIN
// export const createAdmin = async (req, res) => {
//   try {
//     let { firstName, lastName, email, password, role, phone } = req.body;
//     if (!firstName || !lastName || !email || !password) return sendResponse(res, 400, "Failed", "Required fields missing");

//     const exists = await Admin.findOne({ email });
//     if (exists) return sendResponse(res, 409, "Failed", "Admin already exists");

//     let profilePic = "";
//     if (req.file) {
//       const uploaded = await cloudinary.uploader.upload(req.file.path, { folder: "adminProfilePics" });
//       profilePic = uploaded.secure_url;
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const admin = await Admin.create({ firstName, lastName, email, password: hashedPassword, role: role || "SUB_ADMIN", phone, profilePic });
//     const adminData = admin.toObject(); delete adminData.password;

//     return sendResponse(res, 201, "Success", "Admin created successfully", adminData);
//   } catch (error) {
//     console.error("CREATE ADMIN ERROR:", error);
//     return sendResponse(res, 500, "Failed", "Internal server error");
//   }
// };

// // LIST ADMINS
// export const listAdmins = async (req, res) => {
//   try {
//     let { page = 1, limit = 10, search = "" } = req.query;
//     page = parseInt(page); limit = parseInt(limit);

//     const query = search
//       ? { $or: [{ firstName: { $regex: search, $options: "i" } }, { lastName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] }
//       : {};

//     const admins = await Admin.find(query).select("-password").skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
//     const total = await Admin.countDocuments(query);

//     return sendResponse(res, 200, "Success", "Admin list fetched", { total, page, pages: Math.ceil(total / limit), admins });
//   } catch (error) {
//     console.error("LIST ADMINS ERROR:", error);
//     return sendResponse(res, 500, "Failed", "Internal server error");
//   }
// };

// // GET ADMIN DETAILS
// export const getAdminDetails = async (req, res) => {
//   try {
//     const admin = await Admin.findById(req.params.id).select("-password");
//     if (!admin) return sendResponse(res, 404, "Failed", "Admin not found");
//     return sendResponse(res, 200, "Success", "Admin details fetched", admin);
//   } catch (error) {
//     console.error("GET ADMIN ERROR:", error);
//     return sendResponse(res, 500, "Failed", "Internal server error");
//   }
// };

// // UPDATE ADMIN
// export const updateAdmin = async (req, res) => {
//   try {
//     const admin = await Admin.findById(req.params.id);
//     if (!admin) return sendResponse(res, 404, "Failed", "Admin not found");

//     if (req.body.email && req.body.email !== admin.email) {
//       const exists = await Admin.findOne({ email: req.body.email });
//       if (exists) return sendResponse(res, 409, "Failed", "Email already in use");
//     }

//     if (req.body.password) req.body.password = await bcrypt.hash(req.body.password, 10);

//     if (req.file && admin.profilePic) {
//       const publicId = admin.profilePic.split("/").pop().split(".")[0];
//       await cloudinary.uploader.destroy(publicId);
//       const uploaded = await cloudinary.uploader.upload(req.file.path, { folder: "adminProfilePics" });
//       req.body.profilePic = uploaded.secure_url;
//     }

//     Object.assign(admin, req.body);
//     await admin.save();

//     const adminData = admin.toObject(); delete adminData.password;
//     return sendResponse(res, 200, "Success", "Admin updated successfully", adminData);
//   } catch (error) {
//     console.error("UPDATE ADMIN ERROR:", error);
//     return sendResponse(res, 500, "Failed", "Internal server error");
//   }
// };

// // DELETE ADMIN
// export const deleteAdmin = async (req, res) => {
//   try {
//     const admin = await Admin.findById(req.params.id);
//     if (!admin) return sendResponse(res, 404, "Failed", "Admin not found");

//     if (admin.profilePic) {
//       const publicId = admin.profilePic.split("/").pop().split(".")[0];
//       await cloudinary.uploader.destroy(publicId);
//     }

//     await admin.deleteOne();
//     return sendResponse(res, 200, "Success", "Admin deleted successfully");
//   } catch (error) {
//     console.error("DELETE ADMIN ERROR:", error);
//     return sendResponse(res, 500, "Failed", "Internal server error");
//   }
// };

import Admin from "../models/admin.Schema.js";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import { sendResponse } from "../utils/sendResponse.js";

/* =========================
   JWT GENERATOR
========================= */
const generateToken = (admin) => {
  return jwt.sign(
    { adminId: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/* =========================
   ADMIN LOGIN
========================= */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return sendResponse(res, 400, "Failed", "Email & password required");

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin || !(await admin.matchPassword(password))) {
      return sendResponse(res, 401, "Failed", "Invalid credentials");
    }

    const token = generateToken(admin);

    return sendResponse(res, 200, "Success", "Login successful", {
      token,
      tokenType: "Bearer",
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        profilePic: admin.profilePic,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return sendResponse(res, 500, "Failed", "Internal server error");
  }
};

/* =========================
   CREATE ADMIN (PHOTO UPLOAD)
========================= */
export const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;

    if (!firstName || !lastName || !email || !password)
      return sendResponse(res, 400, "Failed", "Required fields missing");

    const exists = await Admin.findOne({ email });
    if (exists)
      return sendResponse(res, 409, "Failed", "Admin already exists");

    let profilePic = "";
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "admins",
      });
      profilePic = upload.secure_url;
    }

    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password, // plain password → schema hash karega
      role: role || "SUB_ADMIN",
      phone,
      profilePic,
    });

    const data = admin.toObject();
    delete data.password;

    return sendResponse(res, 201, "Success", "Admin created", data);
  } catch (error) {
    console.error("CREATE ADMIN ERROR:", error);
    return sendResponse(res, 500, "Failed", "Internal server error");
  }
};

/* =========================
   LIST ADMINS (POST)
========================= */
export const listAdmins = async (req, res) => {
  try {
    const { searchKey = "", pageNo = 1, pageCount = 10 } = req.body;

    const query = searchKey
      ? {
          $or: [
            { firstName: { $regex: searchKey, $options: "i" } },
            { lastName: { $regex: searchKey, $options: "i" } },
            { email: { $regex: searchKey, $options: "i" } },
          ],
        }
      : {};

    const admins = await Admin.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((pageNo - 1) * pageCount)
      .limit(pageCount);

    const totalCount = await Admin.countDocuments(query);

    return sendResponse(res, 200, "Success", "Admin list fetched", {
      admins,
      totalCount,
      pageNo,
      pageCount,
    });
  } catch (error) {
    console.error("LIST ADMINS ERROR:", error);
    return sendResponse(res, 500, "Failed", "Internal server error");
  }
};

/* =========================
   GET ADMIN DETAILS
========================= */
export const getAdminDetails = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin)
      return sendResponse(res, 404, "Failed", "Admin not found");

    return sendResponse(res, 200, "Success", "Admin details fetched", admin);
  } catch (error) {
    return sendResponse(res, 500, "Failed", "Internal server error");
  }
};

/* =========================
   UPDATE ADMIN (PHOTO UPDATE)
========================= */
export const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin)
      return sendResponse(res, 404, "Failed", "Admin not found");

    // Email duplicate check
    if (req.body.email && req.body.email !== admin.email) {
      const exists = await Admin.findOne({ email: req.body.email });
      if (exists)
        return sendResponse(res, 409, "Failed", "Email already in use");
    }

    // Photo upload
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "admins",
      });
      req.body.profilePic = upload.secure_url;
    }

    Object.assign(admin, req.body);
    await admin.save();

    const data = admin.toObject();
    delete data.password;

    return sendResponse(res, 200, "Success", "Admin updated", data);
  } catch (error) {
    console.error("UPDATE ADMIN ERROR:", error);
    return sendResponse(res, 500, "Failed", "Internal server error");
  }
};

/* =========================
   DELETE ADMIN
========================= */
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin)
      return sendResponse(res, 404, "Failed", "Admin not found");

    await admin.deleteOne();
    return sendResponse(res, 200, "Success", "Admin deleted");
  } catch (error) {
    return sendResponse(res, 500, "Failed", "Internal server error");
  }
};


// import Admin from "../models/admin.Schema.js";
// import jwt from "jsonwebtoken";
// import { sendResponse } from "../utils/sendResponse.js";

// /* =========================
//    JWT GENERATOR
// ========================= */
// const generateToken = (admin) => {
//   return jwt.sign(
//     { adminId: admin._id, role: admin.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );
// };

// /* =========================
//    ADMIN LOGIN
// ========================= */
// export const adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password)
//       return sendResponse(res, 400, "Failed", "Email and password required");

//     const admin = await Admin.findOne({ email }).select("+password");
//     if (!admin)
//       return sendResponse(res, 401, "Failed", "Invalid credentials");

//     const isMatch = await admin.matchPassword(password);
//     if (!isMatch)
//       return sendResponse(res, 401, "Failed", "Invalid credentials");

//     const token = generateToken(admin);

//     return sendResponse(res, 200, "Success", "Admin login successful", {
//       token,
//       tokenType: "Bearer",
//       admin: {
//         id: admin._id,
//         firstName: admin.firstName,
//         lastName: admin.lastName,
//         email: admin.email,
//         phone: admin.phone,
//         role: admin.role,
//         profilePic: admin.profilePic,
//       },
//     });
//   } catch (error) {
//     console.error("ADMIN LOGIN ERROR:", error);
//     return sendResponse(res, 500, "Failed", "Internal server error");
//   }
// };

// /* =========================
//    CREATE ADMIN (SUPER ADMIN)
// ========================= */
// export const createAdmin = async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, role, phone } = req.body;

//     if (!firstName || !lastName || !email || !password)
//       return sendResponse(res, 400, "Failed", "Required fields missing");

//     const exists = await Admin.findOne({ email });
//     if (exists)
//       return sendResponse(res, 409, "Failed", "Admin already exists");

//     const admin = await Admin.create({
//       firstName,
//       lastName,
//       email,
//       password, // 🔥 plain password (schema hash karega)
//       role: role || "SUB_ADMIN",
//       phone,
//     });

//     const adminData = admin.toObject();
//     delete adminData.password;

//     return sendResponse(
//       res,
//       201,
//       "Success",
//       "Admin created successfully",
//       adminData
//     );
//   } catch (error) {
//     console.error("CREATE ADMIN ERROR:", error);
//     return sendResponse(res, 500, "Failed", "Internal server error");
//   }
// };

// /* =========================
//    LIST ADMINS (POST)
// ========================= */
// export const listAdmins = async (req, res) => {
//   try {
//     const { searchKey = "", pageNo = 1, pageCount = 10 } = req.body;

//     const query = searchKey
//       ? {
//           $or: [
//             { firstName: { $regex: searchKey, $options: "i" } },
//             { lastName: { $regex: searchKey, $options: "i" } },
//             { email: { $regex: searchKey, $options: "i" } },
//           ],
//         }
//       : {};

//     const admins = await Admin.find(query)
//       .select("-password")
//       .sort({ createdAt: -1 })
//       .skip((pageNo - 1) * pageCount)
//       .limit(pageCount);

//     const totalCount = await Admin.countDocuments(query);

//     return sendResponse(res, 200, "Success", "Admin list fetched", {
//       admins,
//       totalCount,
//       pageNo,
//       pageCount,
//     });
//   } catch (error) {
//     console.error("LIST ADMINS ERROR:", error);
//     return sendResponse(res, 500, "Failed", "Internal server error");
//   }
// };

// /* =========================
//    GET ADMIN DETAILS
// ========================= */
// export const getAdminDetails = async (req, res) => {
//   try {
//     const admin = await Admin.findById(req.params.id).select("-password");
//     if (!admin)
//       return sendResponse(res, 404, "Failed", "Admin not found");

//     return sendResponse(res, 200, "Success", "Admin details fetched", admin);
//   } catch (error) {
//     return sendResponse(res, 500, "Failed", "Internal server error");
//   }
// };

// /* =========================
//    UPDATE ADMIN
// ========================= */
// export const updateAdmin = async (req, res) => {
//   try {
//     const admin = await Admin.findById(req.params.id);
//     if (!admin)
//       return sendResponse(res, 404, "Failed", "Admin not found");

//     if (req.body.email && req.body.email !== admin.email) {
//       const exists = await Admin.findOne({ email: req.body.email });
//       if (exists)
//         return sendResponse(res, 409, "Failed", "Email already in use");
//     }

//     Object.assign(admin, req.body);
//     await admin.save();

//     const adminData = admin.toObject();
//     delete adminData.password;

//     return sendResponse(
//       res,
//       200,
//       "Success",
//       "Admin updated successfully",
//       adminData
//     );
//   } catch (error) {
//     return sendResponse(res, 500, "Failed", "Internal server error");
//   }
// };

// /* =========================
//    DELETE ADMIN
// ========================= */
// export const deleteAdmin = async (req, res) => {
//   try {
//     const admin = await Admin.findById(req.params.id);
//     if (!admin)
//       return sendResponse(res, 404, "Failed", "Admin not found");

//     await admin.deleteOne();
//     return sendResponse(res, 200, "Success", "Admin deleted successfully");
//   } catch (error) {
//     return sendResponse(res, 500, "Failed", "Internal server error");
//   }
// };
