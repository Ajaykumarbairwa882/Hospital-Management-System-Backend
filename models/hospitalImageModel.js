import mongoose from "mongoose";

const hospitalImageSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
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

const HospitalImage = mongoose.model("HospitalImage", hospitalImageSchema);

export default HospitalImage;
