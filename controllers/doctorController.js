import Doctor from "../models/doctorModel.js";
import DoctorImage from "../models/doctorImageModel.js";
import Hospital from "../models/Hospital Model/hospitalModel.js";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { sendDoctorCredentialEmail } from "../utils/mailService.js";
import { uploadImage } from "../utils/cloudinary.js";

const getHospitalByUser = async (userId) => {
  let hospital = await Hospital.findOne({ createdBy: userId });

  if (!hospital) {
    const user = await User.findById(userId);
    hospital = await Hospital.findOne({ email: user?.email });

    if (hospital) {
      hospital.createdBy = userId;
      await hospital.save();
    }
  }

  return hospital;
};

const populateDoctor = (query) => {
  return query
    .populate("hospital")
    .populate("department")
    .populate("subDepartment");
};

export const createDoctor = async (req, res) => {
  let createdDoctor = null;
  let doctorEmail = "";
  let doctorNameForMail = "";
  let plainPassword = "";

  try {
    const {
      doctorName,
      email,
      phone,
      qualification,
      specialization,
      department,
      subDepartment,
      hospital,
      hospitalUser,
      images = [],
    } = req.body;

    const selectedHospital = hospital
      ? await Hospital.findById(hospital)
      : await getHospitalByUser(hospitalUser);

    if (!doctorName || !email || !selectedHospital) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    plainPassword = uuidv4().split("-")[0];
    const hashedpass = await bcrypt.hash(plainPassword, 10);
    doctorEmail = email;
    doctorNameForMail = doctorName;

    const user = await User.create({
      name: doctorName,
      email,
      phone: phone || "",
      password: hashedpass,
      role: "doctor",
      status: "active",
    });

    createdDoctor = await Doctor.create({
      doctorName,
      email,
      phone,
      qualification,
      specialization,
      department: department || null,
      subDepartment: subDepartment || null,
      hospital: selectedHospital._id,
      userId: user._id,
    });

    const imageDocs = [];

    for (const item of images) {
      if (!item?.name || !item?.image) {
        continue;
      }

      const upload = await uploadImage(item.image, "hms/doctors");

      if (!upload.success) {
        throw new Error(upload.message || "Doctor image upload failed");
      }

      imageDocs.push({
        doctorId: createdDoctor._id,
        name: item.name.trim(),
        image: upload.url,
      });
    }

    if (imageDocs.length > 0) {
      await DoctorImage.create(imageDocs);
    }

    await sendDoctorCredentialEmail(
      doctorEmail,
      doctorNameForMail,
      plainPassword,
    );

    console.log(email);
    console.log(plainPassword);

    return res.status(201).json({
      success: true,
      message: "Doctor & User created successfully",
      doctor: createdDoctor,
      login: {
        email,
        password: plainPassword,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      // message:console.log(">>>>>>>>>>>>>>>>>")
    });
  }
};
export const getAllDoctors = async (req, res) => {
  try {
    const filter = { isDeleted: false };

    if (req.query.hospital) {
      filter.hospital = req.query.hospital;
    }

    if (req.query.hospitalUser) {
      const hospital = await getHospitalByUser(req.query.hospitalUser);
      filter.hospital = hospital?._id;
    }

  
    const doctors = await Doctor.find(filter)
      .populate("hospital")
      .populate("department")
      .populate("subDepartment")
      .sort({ createdAt: -1 });

   
    const doctorsWithImages = await Promise.all(
      doctors.map(async (doc) => {
        const images = await DoctorImage.find({
          doctorId: doc._id.toString(), 
        });

        return {
          ...doc.toObject(),
          images,
        };
      }),
    );

    // console.log("FINAL DOCTORS:", doctorsWithImages);
    // console.log("DOC ID:", doctors[0]._id);
    // console.log("IMAGE COUNT:", await DoctorImage.countDocuments());
    // console.log(
    //   "MATCH TEST:",
    //   await DoctorImage.find({ doctorId: doctors[0]._id }),
    // );

    return res.status(200).json({
      success: true,
      count: doctorsWithImages.length,
      doctors: doctorsWithImages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getHospitalDoctors = async (req, res) => {
  try {
    const hospital = await getHospitalByUser(req.params.userId);

    if (!hospital) {
      return res.status(200).json({
        success: true,
        count: 0,
        doctors: [],
      });
    }

    const doctors = await populateDoctor(
      Doctor.find({
        hospital: hospital._id,
        isDeleted: false,
      }).sort({ createdAt: -1 }),
    );

    return res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleDoctor = async (req, res) => {
  try {
    const doctor = await populateDoctor(
      Doctor.findOne({
        _id: req.params.id,
        isDeleted: false,
      }),
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const images = await DoctorImage.find({ doctorId: doctor._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      doctor: {
        ...doctor.toObject(),
        images,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const {
      doctorName,
      email,
      phone,
      qualification,
      specialization,
      department,
      subDepartment,
      status,
    } = req.body;

    const doctor = await populateDoctor(
      Doctor.findOneAndUpdate(
        {
          _id: req.params.id,
          isDeleted: false,
        },
        {
          doctorName,
          email,
          phone,
          qualification,
          specialization,
          department: department || null,
          subDepartment: subDepartment || null,
          status,
        },
        {
          new: true,
          runValidators: true,
        },
      ),
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor updated",
      doctor,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const softDeleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      {
        _id: req.params.id,
        isDeleted: false,
      },
      {
        isDeleted: true,
        status: "inactive",
      },
      {
        new: true,
      },
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor soft deleted",
      doctor,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

import mongoose from "mongoose";

export const hardDeleteDoctor = async (req, res) => {
  // Start a transaction session for safe, atomic deletion
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Find the doctor document first to get the associated userId
    const doctor = await Doctor.findById(req.params.id).session(session);

    if (!doctor) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // 2. Delete the associated User record if userId exists
    if (doctor.userId) {
      await User.findByIdAndDelete(doctor.userId).session(session);
    }

    // 3. Delete any related Doctor Images (Clean up related assets)
    if (typeof DoctorImage !== "undefined") {
      await DoctorImage.deleteMany({ doctorId: doctor._id }).session(session);
    }

    // 4. Delete the Doctor record
    await Doctor.findByIdAndDelete(req.params.id).session(session);

    // Commit all operations to the database
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Doctor, user account, and related images permanently deleted",
      doctor,
    });
  } catch (error) {
    // Rollback any partial database modifications if an error occurs
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
