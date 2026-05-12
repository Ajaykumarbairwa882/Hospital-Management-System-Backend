import express from "express";

import {
  createHospital,
  getAllHospitals,
  getSingleHospital,
  updateHospitalStatus,
} from "../controllers/hospitalControllers.js";

const hospitalrouter = express.Router();

hospitalrouter.post("/create", createHospital);

hospitalrouter.get("/all", getAllHospitals);

hospitalrouter.get("/:id", getSingleHospital);

hospitalrouter.put("/status/:id", updateHospitalStatus);

export default hospitalrouter;
