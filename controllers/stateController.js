import State from "../models/stateModel.js";
import District from "../models/districtModel.js";
import City from "../models/cityModel.js";

export const createState = async (req, res) => {
  try {
    const { stateName, country } = req.body;

    if (!stateName) {
      return res
        .status(400)
        .json({ success: false, message: "State name is required" });
    }

    const state = await State.create({
      stateName,
      country: country || "India",
    });

    return res
      .status(201)
      .json({ success: true, message: "State created", state });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllStates = async (req, res) => {
  try {
    const states = await State.find({
      status: "active",
    }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, states });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStateStatus = async (req, res) => {
  try {
    const state = await State.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );

    if (!state) {
      return res
        .status(404)
        .json({ success: false, message: "State not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "State updated", state });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateState = async (req, res) => {
  try {
    const { stateName, country } = req.body;

    if (!stateName) {
      return res
        .status(400)
        .json({ success: false, message: "State name is required" });
    }

    const state = await State.findByIdAndUpdate(
      req.params.id,
      { stateName, country: country || "India" },
      { new: true, runValidators: true },
    );

    if (!state) {
      return res
        .status(404)
        .json({ success: false, message: "State not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "State updated", state });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteState = async (req, res) => {
  try {
    const state = await State.findByIdAndDelete(req.params.id);

    if (!state) {
      return res
        .status(404)
        .json({ success: false, message: "State not found" });
    }

    const districts = await District.find({ state: state._id });
    const districtIds = districts.map((district) => district._id);

    await City.deleteMany({ district: { $in: districtIds } });
    await District.deleteMany({ state: state._id });

    return res.status(200).json({
      success: true,
      message: "State, related districts and related cities deleted",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
