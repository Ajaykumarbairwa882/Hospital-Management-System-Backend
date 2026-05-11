import express from "express";
import {
  createState,
  deleteState,
  getAllStates,
  updateState,
  updateStateStatus,
} from "../controllers/stateController.js";
import {
  createDistrict,
  deleteDistrict,
  getAllDistricts,
  updateDistrict,
  updateDistrictStatus,
} from "../controllers/districtController.js";
import {
  createCity,
  deleteCity,
  getAllCities,
  updateCity,
  updateCityStatus,
} from "../controllers/cityController.js";

const locationRouter = express.Router();

locationRouter.get("/states", getAllStates);
locationRouter.post("/states", createState);
locationRouter.put("/states/:id", updateState);
locationRouter.patch("/states/:id/status", updateStateStatus);
locationRouter.delete("/states/:id", deleteState);

locationRouter.get("/districts", getAllDistricts);
locationRouter.post("/districts", createDistrict);
locationRouter.put("/districts/:id", updateDistrict);
locationRouter.patch("/districts/:id/status", updateDistrictStatus);
locationRouter.delete("/districts/:id", deleteDistrict);

locationRouter.get("/cities", getAllCities);
locationRouter.post("/cities", createCity);
locationRouter.put("/cities/:id", updateCity);
locationRouter.patch("/cities/:id/status", updateCityStatus);
locationRouter.delete("/cities/:id", deleteCity);

export default locationRouter;
