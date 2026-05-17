import express from "express";
import {
  approveAppointment,
  createAppointment,
  getDoctorAppointments,
  getUserAppointments,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/create", createAppointment);
router.get("/user/:userId", getUserAppointments);
router.get("/doctor/:userId", getDoctorAppointments);
router.put("/approve/:id", approveAppointment);

export default router;
