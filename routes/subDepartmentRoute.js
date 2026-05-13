import express from "express";
import SubDepartment from "../models/subDepartmentModel.js";
import {
  createSubDepartment,
  getAllSubDepartments,
  getHospitalSubDepartments,
  getSingleSubDepartment,
  updateSubDepartment,
  softDeleteSubDepartment,
  restoreSubDepartment,
  hardDeleteSubDepartment,
} from "../controllers/subDepartmentController.js";

const router = express.Router();

router.post("/create", createSubDepartment);

router.get("/all", getAllSubDepartments);

router.get("/hospital/:userId", getHospitalSubDepartments);

router.get("/:id", getSingleSubDepartment);

router.put("/update/:id", updateSubDepartment);

router.patch("/soft-delete/:id", softDeleteSubDepartment);

// router.patch("/restore/:id", restoreSubDepartment);

router.delete("/hard-delete/:id", hardDeleteSubDepartment);
router.patch("/restore/:id", restoreSubDepartment);

export default router;
