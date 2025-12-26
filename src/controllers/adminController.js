import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

//  TOKEN
const generateToken = (admin) =>
  jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// LOGIN 
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      id: admin._id,
      name: `${admin.firstName} ${admin.lastName}`,
      role: admin.role,
      token: generateToken(admin)
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE ADMIN
export const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body || {};

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "All required fields must be filled"
      });
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password,
      role: role || "SUB_ADMIN"
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET ADMINS 
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

//  GET BY ID 
export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

//  UPDATE 
export const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    Object.assign(admin, req.body);
    await admin.save();

    res.json({ message: "Admin updated", admin });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE 
export const deleteAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin deleted successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
