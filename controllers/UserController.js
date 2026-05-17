import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/UserModel.js";
import Hospital from "../models/Hospital Model/hospitalModel.js";
import { sendUserUpdateEmail, sendWelcomeEmail} from "../utils/mailService.js";
import { uploadImage } from "../utils/cloudinary.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password,role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "hms_secret_key",
      { expiresIn: "7d" }
    );

    await sendWelcomeEmail(email, name, password, role)
    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "hms_secret_key",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpire = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Reset token generated",
      resetToken,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, oldpassword,newpassword,copassword } = req.body;

    if (!email || !oldpassword || !newpassword || !copassword) {
      return res.status(400).json({ success: false, message: "all filed  are required" });
    }

    const user = await User.findOne({email});
    console.log(user);
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired user" });
    }
    const matchpassword= user.password;
    const ismatch =await bcrypt.compare(oldpassword,matchpassword)
    if(!ismatch){
      return res.status(400).json({ success: false, message: "Invalid  password" });
    
    }
    if(newpassword!==copassword){
      return res.status(400).json({ success: false, message: "not match passwoed" });
    
    }
    const chnagepassword = await bcrypt.hash(newpassword, 10);
    console.log(chnagepassword);
    const updatedata =await User.findOneAndUpdate({email},{password:chnagepassword});

    return res.status(200).json({
      success: true,
      data:updatedata,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, status, phone, profileImage, backgroundImage } = req.body;
    const updateData = {
      name,
      email,
      status,
      phone,
    };

    if (profileImage && profileImage.startsWith("data:image")) {
      const upload = await uploadImage(profileImage, "hms/users/profile");

      if (!upload.success) {
        throw new Error(upload.message || "Profile image upload failed");
      }

      updateData.profileImage = upload.url;
    }

    if (backgroundImage && backgroundImage.startsWith("data:image")) {
      const upload = await uploadImage(backgroundImage, "hms/users/background");

      if (!upload.success) {
        throw new Error(upload.message || "Background image upload failed");
      }

      updateData.backgroundImage = upload.url;
    }

    // user update
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "hospital") {
      await Hospital.findOneAndUpdate(
        { createdBy: user._id },
        {
          name,
          email,
          phone,
        },
        { new: true }
      );
    }

    // email
    await sendUserUpdateEmail(user.email, user.name);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
 
