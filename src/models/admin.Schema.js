import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: { type: String, default: "" },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // password by default hidden
    },

    role: {
      type: String,
      enum: ["SUPER_ADMIN", "SUB_ADMIN"],
      default: "SUB_ADMIN",
    },

    profilePic: { type: String, default: "" },

    token: { type: String, default: "" }, // JWT token storage optional
  },
  { timestamps: true }
);

/* =========================
   HASH PASSWORD BEFORE SAVE
========================= */
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

/* =========================
   PASSWORD MATCH METHOD
========================= */
adminSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Admin", adminSchema);
