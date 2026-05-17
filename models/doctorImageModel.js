import mongoose from "mongoose";

const doctorImageSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const DoctorImage = mongoose.model("DoctorImage", doctorImageSchema);

export default DoctorImage;
