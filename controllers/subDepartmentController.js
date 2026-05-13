// subDepartmentController.js

import SubDepartment from "../models/subDepartmentModel.js";
import Department from "../models/departmentModel.js";
import Hospital from "../models/Hospital Model/hospitalModel.js";
import User from "../models/UserModel.js";


// ================= GET HOSPITAL =================

const getHospitalByUser = async (userId) => {
  let hospital = await Hospital.findOne({
    createdBy: userId,
  });

  if (!hospital) {
    const user = await User.findById(userId);

    hospital = await Hospital.findOne({
      email: user?.email,
    });

    if (hospital) {
      hospital.createdBy = userId;

      await hospital.save();
    }
  }

  return hospital;
};


// ================= CREATE =================

export const createSubDepartment =
  async (req, res) => {
    try {
      const {
        subDepartmentName,
        description,
        department,
        hospitalUser,
      } = req.body;

      if (
        !subDepartmentName ||
        !department
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Sub department name and department are required",
        });
      }

      const hospital =
        await getHospitalByUser(
          hospitalUser
        );

      if (!hospital) {
        return res.status(404).json({
          success: false,
          message:
            "Hospital not found",
        });
      }

      const departmentData =
        await Department.findById(
          department
        );

      if (!departmentData) {
        return res.status(404).json({
          success: false,
          message:
            "Department not found",
        });
      }

      const subDepartment =
        await SubDepartment.create({
          subDepartmentName,
          description,
          department,
          hospital: hospital._id,
          status: "active",
          isDeleted: false,
        });

      await subDepartment.populate([
        "department",
        "hospital",
      ]);

      return res.status(201).json({
        success: true,
        message:
          "Sub department created successfully",
        subDepartment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// ================= GET ALL =================

export const getAllSubDepartments =
  async (req, res) => {
    try {
      const subDepartments =
        await SubDepartment.find()
          .populate("department")
          .populate("hospital")
          .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count:
          subDepartments.length,
        subDepartments,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// ================= GET HOSPITAL =================

export const getHospitalSubDepartments =
  async (req, res) => {
    try {
      const hospital =
        await getHospitalByUser(
          req.params.userId
        );

      if (!hospital) {
        return res.status(200).json({
          success: true,
          count: 0,
          subDepartments: [],
        });
      }

      const subDepartments =
        await SubDepartment.find({
          hospital: hospital._id,
        })
          .populate("department")
          .populate("hospital")
          .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count:
          subDepartments.length,
        subDepartments,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// ================= GET SINGLE =================

export const getSingleSubDepartment =
  async (req, res) => {
    try {
      const subDepartment =
        await SubDepartment.findById(
          req.params.id
        )
          .populate("department")
          .populate("hospital");

      if (!subDepartment) {
        return res.status(404).json({
          success: false,
          message:
            "Sub department not found",
        });
      }

      return res.status(200).json({
        success: true,
        subDepartment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// ================= UPDATE =================

export const updateSubDepartment =
  async (req, res) => {
    try {
      const {
        subDepartmentName,
        description,
        department,
        status,
      } = req.body;

      const subDepartment =
        await SubDepartment.findByIdAndUpdate(
          req.params.id,
          {
            subDepartmentName,
            description,
            department,
            status,
          },
          {
            returnDocument: "after",
            runValidators: true,
          }
        )
          .populate("department")
          .populate("hospital");

      if (!subDepartment) {
        return res.status(404).json({
          success: false,
          message:
            "Sub department not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Sub department updated successfully",
        subDepartment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// ================= SOFT DELETE =================

export const softDeleteSubDepartment =
  async (req, res) => {
    try {
      const subDepartment =
        await SubDepartment.findByIdAndUpdate(
          req.params.id,
          {
            isDeleted: true,
            status: "inactive",
          },
          {
            returnDocument: "after",
          }
        );

      if (!subDepartment) {
        return res.status(404).json({
          success: false,
          message:
            "Sub department not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Sub department soft deleted",
        subDepartment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// ================= RESTORE =================

export const restoreSubDepartment = async (req, res) => {
  try {
    const subDepartment =
      await SubDepartment.findByIdAndUpdate(
        req.params.id,
        {
          isDeleted: false,
          status: "active",
        },
        {
          returnDocument: "after",
        }
      )
        .populate("department")
        .populate("hospital");

    if (!subDepartment) {
      return res.status(404).json({
        success: false,
        message: "Sub Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sub Department restored",
      subDepartment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= HARD DELETE =================

export const hardDeleteSubDepartment =
  async (req, res) => {
    try {
      const subDepartment =
        await SubDepartment.findByIdAndDelete(
          req.params.id
        );

      if (!subDepartment) {
        return res.status(404).json({
          success: false,
          message:
            "Sub department not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Sub department permanently deleted",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };