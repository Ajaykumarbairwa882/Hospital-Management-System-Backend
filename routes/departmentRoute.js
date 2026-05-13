// departmentRoute.js

import express from "express";

import {
  createDepartment,
  getAllDepartments,
  getHospitalDepartments,
  getSingleDepartment,
  updateDepartment,
  softDeleteDepartment,
  hardDeleteDepartment,
  restoreDepartment,
} from "../controllers/departmentController.js";

const router = express.Router();

router.post("/create", createDepartment);

router.get("/all", getAllDepartments);

router.get("/hospital/:userId", getHospitalDepartments);

router.get("/:id", getSingleDepartment);

router.put("/update/:id", updateDepartment);

router.put("/soft-delete/:id", softDeleteDepartment);

router.put("/restore/:id", restoreDepartment);

router.delete("/hard-delete/:id", hardDeleteDepartment);

export default router;