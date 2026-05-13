import express from "express";
import {
  createDoctor,
  getAllDoctors,
  getHospitalDoctors,
  getSingleDoctor,
  hardDeleteDoctor,
  softDeleteDoctor,
  updateDoctor,
} from "../controllers/doctorController.js";

const doctorRouter = express.Router();

doctorRouter.post("/create", createDoctor);
doctorRouter.get("/all", getAllDoctors);
doctorRouter.get("/hospital/:userId", getHospitalDoctors);
doctorRouter.get("/:id", getSingleDoctor);
doctorRouter.put("/update/:id", updateDoctor);
doctorRouter.patch("/soft-delete/:id", softDeleteDoctor);
doctorRouter.delete("/hard-delete/:id", hardDeleteDoctor);

export default doctorRouter;
