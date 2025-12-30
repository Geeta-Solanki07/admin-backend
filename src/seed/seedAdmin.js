import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "../models/admin.Schema.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // 2️⃣ Delete all existing admins
    await Admin.deleteMany({});
    console.log("🗑️ Existing admins deleted");

    // 3️⃣ Create fresh Super Admin
    const hashedPassword = await bcrypt.hash("raj@123", 10); // hash password
    await Admin.create({
      firstName: "Raj",
      lastName: "Rajput",
      email: "raj@dousoft.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      phone: "",
      profilePic: "",
    });

    console.log("✅ Super Admin created successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedAdmin();
