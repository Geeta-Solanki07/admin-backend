import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminCount = await Admin.countDocuments();

    if (adminCount === 0) {
      await Admin.create({
        firstName: "Geeta",
        lastName: "Solanki",
        email: "geeta@dousoft.com",
        password: "geeta@123",
        role: "SUPER_ADMIN"
      });

      console.log("✅ Super Admin created successfully");
    } else {
      console.log("ℹ️ Admin already exists");
    }

    process.exit();
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedAdmin();
