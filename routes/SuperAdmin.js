import express from "express";
import {
  createAdmin,
  getAdmins,
  updateAdminInfo,
  approveHospital
} from "../controllers/SuperAdminController.js";

const adminrouter = express.Router();

adminrouter.post("/create", createAdmin);
adminrouter.post("/signup", createAdmin);
adminrouter.get("/", getAdmins);
adminrouter.put("/:id", updateAdminInfo);
adminrouter.post("/Approve",approveHospital)

export default adminrouter;
