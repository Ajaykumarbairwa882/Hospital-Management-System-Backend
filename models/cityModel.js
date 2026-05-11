import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    cityName: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuperAdmin",
    },
  },
  {
    timestamps: true,
  }
);

const City = mongoose.model("City", citySchema);

export default City;
