import Hospital from "../models/Hospital Model/hospitalModel.js";
import City from "../models/cityModel.js";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { sendHospitalMail } from "../utils/mailService.js";

export const createHospital = async (req, res) => {
  try {
    const { hospitalName, name, email, phone, address, city } = req.body;

    if (!hospitalName || !name || !email || !phone || !address || !city) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingHospital = await Hospital.findOne({ email });

    if (existingHospital) {
      return res.status(400).json({
        success: false,
        message: "Hospital already exists",
      });
    }

    const selectedCity = await City.findById(city).populate({
      path: "district",
      populate: {
        path: "state",
      },
    });

    if (
      !selectedCity ||
      selectedCity.status !== "active" ||
      selectedCity.district?.status !== "active" ||
      selectedCity.district?.state?.status !== "active"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid location",
      });
    }

    const hospital = await Hospital.create({
      hospitalName,
      name,
      email,
      phone,
      address,
      city,
      status: "pending",
    });

    await hospital.populate({
      path: "city",
      populate: {
        path: "district",
        populate: {
          path: "state",
        },
      },
    });

    await sendHospitalMail(email, hospitalName, "", "pending");

    return res.status(201).json({
      success: true,
      message: "Hospital request submitted",
      hospital,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().populate({
      path: "city",
      populate: {
        path: "district",
        populate: {
          path: "state",
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: hospitals.length,
      hospitals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate({
      path: "city",
      populate: {
        path: "district",
        populate: {
          path: "state",
        },
      },
    });

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    return res.status(200).json({
      success: true,
      hospital,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateHospitalStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (status !== "approved" && status !== "rejected") {
      return res.status(400).json({
        success: false,
        message: "Status must be approved or rejected",
      });
    }

    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    hospital.status = status;

    if (status === "approved") {
      const existingUser = await User.findOne({
        email: hospital.email,
      });

      if (existingUser) {
        hospital.createdBy = existingUser._id;
      } else {
        const rawPassword = uuidv4().slice(0, 8);

        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const user = await User.create({
          name: hospital.name,

          email: hospital.email,

          phone: hospital.phone,

          password: hashedPassword,

          role: "hospital",

          status: "active",
        });

        hospital.createdBy = user._id;

        await sendHospitalMail(
          hospital.email,
          hospital.hospitalName,
          rawPassword,
          "approved",
        );
      }
    }

    if (status === "rejected") {
      await sendHospitalMail(
        hospital.email,
        hospital.hospitalName,
        "",
        "rejected",
      );
    }

    await hospital.save();

    return res.status(200).json({
      success: true,
      message: `Hospital ${status} successfully`,
      hospital,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
