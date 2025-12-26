import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// TOKEN GENERATOR
const generateToken = (admin) =>
  jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// LOGIN ADMIN
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ status: 400, message: "Email and password required" });

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin)
      return res.status(401).json({ status: 401, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ status: 401, message: "Invalid credentials" });

    res.status(200).json({
      status: 200,
      admin_id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      name: `${admin.firstName} ${admin.lastName}`,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      profilePic: admin.profilePic,
      token: generateToken(admin),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Server error" });
  }
};

// CREATE ADMIN
export const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone, profilePic } = req.body || {};
    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ status: 400, message: "All required fields must be filled" });

    const exists = await Admin.findOne({ email });
    if (exists)
      return res.status(400).json({ status: 400, message: "Admin already exists" });

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
      status: 201,
      message: "Admin created successfully",
      admin: {
        admin_id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        profilePic: admin.profilePic,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Server error" });
  }
};

// GET ALL ADMINS
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json({
      status: 200,
      admins: admins.map((admin) => ({
        admin_id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        profilePic: admin.profilePic,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Server error" });
  }
};

// GET ADMIN BY ID
export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin)
      return res.status(404).json({ status: 404, message: "Admin not found" });

    res.status(200).json({
      status: 200,
      admin_id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      profilePic: admin.profilePic,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Server error" });
  }
};

// UPDATE ADMIN
export const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin)
      return res.status(404).json({ status: 404, message: "Admin not found" });

    if (req.body.password)
      req.body.password = await bcrypt.hash(req.body.password, 10);

    Object.assign(admin, req.body);
    await admin.save();

    res.status(200).json({
      status: 200,
      message: "Admin updated successfully",
      admin: {
        admin_id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        profilePic: admin.profilePic,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Server error" });
  }
};

// DELETE ADMIN
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin)
      return res.status(404).json({ status: 404, message: "Admin not found" });

    await admin.remove();
    res.status(200).json({ status: 200, message: "Admin deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Server error" });
  }
};
