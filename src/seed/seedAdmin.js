// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Admin from "../models/admin.Schema.js";

// dotenv.config();

// const seedAdmin = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);

//     const adminCount = await Admin.countDocuments();

//     if (adminCount === 0) {
//       await Admin.create({
//         firstName: "Raj",
//         lastName: "Rajput",
//         email: "raj@dousoft.com",
//         password: "raj@123",
//         role: "SUPER_ADMIN"
//       });

//       console.log("✅ Super Admin created successfully");
//     } else {
//       console.log("ℹ️ Admin already exists");
//     }

//     process.exit();
//   } catch (error) {
//     console.error("❌ Seed error:", error);
//     process.exit(1);
//   }
// };

// seedAdmin();

import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/admin.Schema.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await Admin.deleteMany({});
    console.log("🗑️ Existing admins deleted");

    await Admin.create({
      firstName: "Riya",
      lastName: "Rajput",
      email: "riya@dousoft.com",
      password: "riya@123",
      role: "SUPER_ADMIN",
    });

    console.log("✅ Super Admin created");
    process.exit();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedAdmin();
