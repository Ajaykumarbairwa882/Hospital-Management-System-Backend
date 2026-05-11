import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import SuperAdmin from "../models/Super-Admin.js";
import User from "../models/UserModel.js";

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, bg_description, gender } =
      req.body;

    console.log(">>>>>>>>>>>>", req.body);

    if (!name || !email || !password || !phone || !gender) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, phone and gender are required",
      });
    }

    const existingUser = await User.findOne({ email });

    const existingAdmin = await SuperAdmin.findOne({ email });

    if (existingUser || existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await SuperAdmin.create({
      name,
      email,
      password: hashedPassword,
      phone,
      bg_description,
      gender,
    });

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "superadmin",
      superAdmin: admin._id,
    });

    const userData = user.toObject();

    delete userData.password;

    return res.status(201).json({
      success: true,
      message: "Super admin created",
      admin,
      user: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAdmins = async (req, res) => {
  try {
    const admins = await SuperAdmin.find();

    return res.status(200).json({
      success: true,
      admins,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAdminInfo = async (req, res) => {
  try {
    const { name, phone, bg_description, gender } = req.body;

    const admin = await SuperAdmin.findByIdAndUpdate(
      req.params.id,
      { name, phone, bg_description, gender },
      { new: true, runValidators: true },
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Super admin not found",
      });
    }

    const user = await User.findOneAndUpdate(
      { superAdmin: admin._id },
      { name: admin.name },
      { new: true },
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Super admin updated",
      admin,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
