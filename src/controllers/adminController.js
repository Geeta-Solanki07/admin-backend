import Admin from "../models/admin.Schema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

//  Generate JWT Token
const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ADMIN LOGIN
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(admin);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        name: `${admin.firstName} ${admin.lastName}`,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        profilePic: admin.profilePic,
      },
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// CREATE ADMIN (SUPER ADMIN)
export const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone, profilePic } =
      req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "SUB_ADMIN",
      phone: phone || "",
      profilePic: profilePic || "",
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin,
    });
  } catch (error) {
    console.error("CREATE ADMIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// LIST ADMINS (Pagination + Search)
export const listAdmins = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.body;

    const query = {
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const admins = await Admin.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Admin.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      admins,
    });
  } catch (error) {
    console.error("LIST ADMINS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET ADMIN DETAILS BY ID
export const getAdminDetails = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("GET ADMIN DETAILS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// UPDATE ADMIN
export const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    Object.assign(admin, req.body);
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      admin,
    });
  } catch (error) {
    console.error("UPDATE ADMIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// DELETE ADMIN (SUPER ADMIN)
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    await admin.deleteOne();

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ADMIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
