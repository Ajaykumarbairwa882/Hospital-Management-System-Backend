import express from "express";
import {
  createAdmin,
  getAdmins,
  updateAdminInfo,
} from "../controllers/SuperAdminController.js";

const adminrouter = express.Router();

adminrouter.post("/create", createAdmin);
adminrouter.post("/signup", createAdmin);
adminrouter.get("/", getAdmins);
adminrouter.put("/:id", updateAdminInfo);

export default adminrouter;
