import mongoose from "mongoose";

const districtSchema = new mongoose.Schema(
  {
    districtName: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
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

const District = mongoose.model("District", districtSchema);

export default District;
