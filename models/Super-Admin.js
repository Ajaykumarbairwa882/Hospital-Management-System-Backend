import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    bg_description: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    role: {
      type: String,
      default: "superadmin",
    },
  },
  {
    timestamps: true,
  }
);

const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);

export default SuperAdmin;
