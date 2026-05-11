import City from "../models/cityModel.js";

export const createCity = async (req, res) => {
  try {
    const { cityName, district } = req.body;

    if (!cityName || !district) {
      return res.status(400).json({ success: false, message: "City name and district are required" });
    }

    const city = await City.create({
      cityName,
      district,
    });

    await city.populate({
      path: "district",
      populate: {
        path: "state",
      },
    });

    return res.status(201).json({ success: true, message: "City created", city });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCities = async (req, res) => {
  try {
    const cities = await City.find()
      .populate({
        path: "district",
        populate: {
          path: "state",
        },
      })
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, cities });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCityStatus = async (req, res) => {
  try {
    const city = await City.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!city) {
      return res.status(404).json({ success: false, message: "City not found" });
    }

    return res.status(200).json({ success: true, message: "City updated", city });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCity = async (req, res) => {
  try {
    const { cityName, district } = req.body;

    if (!cityName || !district) {
      return res.status(400).json({ success: false, message: "City name and district are required" });
    }

    const city = await City.findByIdAndUpdate(
      req.params.id,
      { cityName, district },
      { new: true, runValidators: true }
    ).populate({
      path: "district",
      populate: {
        path: "state",
      },
    });

    if (!city) {
      return res.status(404).json({ success: false, message: "City not found" });
    }

    return res.status(200).json({ success: true, message: "City updated", city });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCity = async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);

    if (!city) {
      return res.status(404).json({ success: false, message: "City not found" });
    }

    return res.status(200).json({ success: true, message: "City deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
