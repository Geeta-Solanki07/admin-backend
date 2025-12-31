import jwt from "jsonwebtoken";
import Admin from "../models/admin.Schema.js";
import { sendResponse } from "../utils/sendResponse.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer "))
      return sendResponse(res, 401, "Failed", "Token missing");

    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.adminId).select("-password");
    if (!admin)
      return sendResponse(res, 401, "Failed", "Invalid token");

    req.user = { adminId: admin._id, role: admin.role };
    next();
  } catch (error) {
    return sendResponse(res, 401, "Failed", "Token verification failed");
  }
};

export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "SUPER_ADMIN")
    return sendResponse(res, 403, "Failed", "Super admin only");
  next();
};



// import jwt from "jsonwebtoken";
// import Admin from "../models/admin.Schema.js";
// import { sendResponse } from "../utils/sendResponse.js";

// // AUTH PROTECT
// export const protect = async (req, res, next) => {
//   try {
//     let token = req.headers.authorization;
//     if (!token || !token.startsWith("Bearer ")) {
//       return sendResponse(res, 401, "Failed", "Token missing");
//     }
//     token = token.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const admin = await Admin.findById(decoded.adminId).select("-password");
//     if (!admin) return sendResponse(res, 401, "Failed", "Invalid token");
//     req.user = { adminId: admin._id, role: admin.role };
//     next();
//   } catch (error) {
//     return sendResponse(res, 401, "Failed", "Token verification failed");
//   }
// };

// // SUPER ADMIN ONLY
// export const isSuperAdmin = (req, res, next) => {
//   if (!req.user || req.user.role !== "SUPER_ADMIN") {
//     return sendResponse(res, 403, "Failed", "Super admin only");
//   }
//   next();
// };
