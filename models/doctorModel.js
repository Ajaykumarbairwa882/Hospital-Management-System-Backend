import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    doctorName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    qualification: {
      type: String,
      trim: true,
      default: "",
    },
    specialization: {
      type: String,
      trim: true,
      default: "",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    subDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubDepartment",
      default: null,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
