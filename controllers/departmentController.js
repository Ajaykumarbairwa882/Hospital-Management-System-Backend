import Department from "../models/departmentModel.js";
import Hospital from "../models/Hospital Model/hospitalModel.js";
import User from "../models/UserModel.js";


// ================= GET HOSPITAL =================

const getHospitalByUser = async (userId) => {
  let hospital = await Hospital.findOne({
    createdBy: userId,
  });

  // agar createdBy se nahi mila
  if (!hospital) {
    const user = await User.findById(userId);

    hospital = await Hospital.findOne({
      email: user?.email,
    });

    // hospital ko user se connect karo
    if (hospital) {
      hospital.createdBy = userId;
      await hospital.save();
    }
  }

  return hospital;
};


// ================= CREATE DEPARTMENT =================

export const createDepartment = async (req, res) => {
  try {
    const {
      departmentName,
      description,
      hospital,
      hospitalUser,
    } = req.body;

    if (!departmentName) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    let hospitalId = hospital;

    // hospitalUser se hospital find
    if (!hospitalId && hospitalUser) {
      const hospitalData = await getHospitalByUser(
        hospitalUser
      );

      hospitalId = hospitalData?._id;
    }

    if (!hospitalId) {
      return res.status(400).json({
        success: false,
        message: "Hospital is required",
      });
    }

    const department = await Department.create({
      departmentName,
      description,
      hospital: hospitalId,
      status: "active",
      isDeleted: false,
    });

    await department.populate("hospital");

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= GET ALL DEPARTMENTS =================

export const getAllDepartments = async (req, res) => {
  try {
    const filter = {};

    // direct hospital id
    if (req.query.hospital) {
      filter.hospital = req.query.hospital;
    }

    // hospital user id
    if (req.query.hospitalUser) {
      const hospital = await getHospitalByUser(
        req.query.hospitalUser
      );

      filter.hospital = hospital?._id;
    }

    const departments = await Department.find(filter)
      .populate("hospital")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= GET HOSPITAL DEPARTMENTS =================

export const getHospitalDepartments = async (
  req,
  res
) => {
  try {
    const hospital = await getHospitalByUser(
      req.params.userId
    );

    if (!hospital) {
      return res.status(200).json({
        success: true,
        count: 0,
        departments: [],
      });
    }

    // soft deleted bhi dikhेंगे
    const departments = await Department.find({
      hospital: hospital._id,
    })
      .populate("hospital")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= GET SINGLE DEPARTMENT =================

export const getSingleDepartment = async (
  req,
  res
) => {
  try {
    const department = await Department.findById(
      req.params.id
    ).populate("hospital");

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      department,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= UPDATE DEPARTMENT =================

export const updateDepartment = async (
  req,
  res
) => {
  try {
    const {
      departmentName,
      description,
      status,
    } = req.body;

    const department =
      await Department.findByIdAndUpdate(
        req.params.id,
        {
          departmentName,
          description,
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate("hospital");

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      department,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= SOFT DELETE =================

export const softDeleteDepartment = async (
  req,
  res
) => {
  try {
    const department =
      await Department.findByIdAndUpdate(
        req.params.id,
        {
          isDeleted: true,
          status: "inactive",
        },
        {
          new: true,
        }
      );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department soft deleted",
      department,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= RESTORE DEPARTMENT =================

export const restoreDepartment = async (
  req,
  res
) => {
  try {
    const department =
      await Department.findByIdAndUpdate(
        req.params.id,
        {
          isDeleted: false,
          status: "active",
        },
        {
          new: true,
        }
      );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department restored successfully",
      department,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= HARD DELETE =================

export const hardDeleteDepartment = async (
  req,
  res
) => {
  try {
    const department =
      await Department.findByIdAndDelete(
        req.params.id
      );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Department permanently deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};