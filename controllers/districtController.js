import District from "../models/districtModel.js";
import City from "../models/cityModel.js";

export const createDistrict = async (req, res) => {
  try {
    const { districtName, state } = req.body;

    if (!districtName || !state) {
      return res
        .status(400)
        .json({
          success: false,
          message: "District name and state are required",
        });
    }

    const district = await District.create({
      districtName,
      state,
    });

    await district.populate("state");

    return res
      .status(201)
      .json({ success: true, message: "District created", district });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllDistricts = async (req, res) => {
  try {
    const filter = {
      status: "active",
    };

    if (req.params.stateId) {
      filter.state = req.params.stateId;
    }

    const districts = await District.find(filter)
      .populate("state")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, districts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDistrictStatus = async (req, res) => {
  try {
    const district = await District.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );

    if (!district) {
      return res
        .status(404)
        .json({ success: false, message: "District not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "District updated", district });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDistrict = async (req, res) => {
  try {
    const { districtName, state } = req.body;

    if (!districtName || !state) {
      return res
        .status(400)
        .json({
          success: false,
          message: "District name and state are required",
        });
    }

    const district = await District.findByIdAndUpdate(
      req.params.id,
      { districtName, state },
      { new: true, runValidators: true },
    ).populate("state");

    if (!district) {
      return res
        .status(404)
        .json({ success: false, message: "District not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "District updated", district });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDistrict = async (req, res) => {
  try {
    const district = await District.findByIdAndDelete(req.params.id);

    if (!district) {
      return res
        .status(404)
        .json({ success: false, message: "District not found" });
    }

    await City.deleteMany({ district: district._id });

    return res.status(200).json({
      success: true,
      message: "District and related cities deleted",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
