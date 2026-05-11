import mongoose from "mongoose";

const stateSchema = new mongoose.Schema(
  {
    stateName: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      default: "India",
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
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

const State = mongoose.model("State", stateSchema);

export default State;
