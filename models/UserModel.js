import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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

    role: {
      type: String,
      enum: ["user", "superadmin"],
      default: "user",
    },
    superAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuperAdmin",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    resetToken: {
      type: String,
      default: "",
    },
    resetTokenExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
