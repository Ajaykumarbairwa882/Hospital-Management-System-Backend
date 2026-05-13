import Doctor from "../models/doctorModel.js";
import Hospital from "../models/Hospital Model/hospitalModel.js";
import User from "../models/UserModel.js";

const getHospitalByUser = async (userId) => {
  let hospital = await Hospital.findOne({ createdBy: userId });

  if (!hospital) {
    const user = await User.findById(userId);
    hospital = await Hospital.findOne({ email: user?.email });

    if (hospital) {
      hospital.createdBy = userId;
      await hospital.save();
    }
  }

  return hospital;
};

const populateDoctor = (query) => {
  return query.populate("hospital").populate("department").populate("subDepartment");
};

export const createDoctor = async (req, res) => {
  try {
    const {
      doctorName,
      email,
      phone,
      qualification,
      specialization,
      department,
      subDepartment,
      hospital,
      hospitalUser,
    } = req.body;

    if (!doctorName) {
      return res.status(400).json({
        success: false,
        message: "Doctor name is required",
      });
    }

    let hospitalId = hospital;

    if (!hospitalId && hospitalUser) {
      const hospitalData = await getHospitalByUser(hospitalUser);
      hospitalId = hospitalData?._id;
    }

    if (!hospitalId) {
      return res.status(400).json({
        success: false,
        message: "Hospital is required",
      });
    }

    const doctor = await Doctor.create({
      doctorName,
      email,
      phone,
      qualification,
      specialization,
      department: department || null,
      subDepartment: subDepartment || null,
      hospital: hospitalId,
      status: "active",
      isDeleted: false,
    });

    await doctor.populate("hospital");
    await doctor.populate("department");
    await doctor.populate("subDepartment");

    return res.status(201).json({
      success: true,
      message: "Doctor created",
      doctor,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const filter = { isDeleted: false };

    if (req.query.hospital) {
      filter.hospital = req.query.hospital;
    }

    if (req.query.hospitalUser) {
      const hospital = await getHospitalByUser(req.query.hospitalUser);
      filter.hospital = hospital?._id;
    }

    const doctors = await populateDoctor(
      Doctor.find(filter).sort({ createdAt: -1 }),
    );

    return res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getHospitalDoctors = async (req, res) => {
  try {
    const hospital = await getHospitalByUser(req.params.userId);

    if (!hospital) {
      return res.status(200).json({
        success: true,
        count: 0,
        doctors: [],
      });
    }

    const doctors = await populateDoctor(
      Doctor.find({
        hospital: hospital._id,
        isDeleted: false,
      }).sort({ createdAt: -1 }),
    );

    return res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleDoctor = async (req, res) => {
  try {
    const doctor = await populateDoctor(
      Doctor.findOne({
        _id: req.params.id,
        isDeleted: false,
      }),
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const {
      doctorName,
      email,
      phone,
      qualification,
      specialization,
      department,
      subDepartment,
      status,
    } = req.body;

    const doctor = await populateDoctor(
      Doctor.findOneAndUpdate(
        {
          _id: req.params.id,
          isDeleted: false,
        },
        {
          doctorName,
          email,
          phone,
          qualification,
          specialization,
          department: department || null,
          subDepartment: subDepartment || null,
          status,
        },
        {
          new: true,
          runValidators: true,
        },
      ),
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor updated",
      doctor,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const softDeleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      {
        _id: req.params.id,
        isDeleted: false,
      },
      {
        isDeleted: true,
        status: "inactive",
      },
      {
        new: true,
      },
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor soft deleted",
      doctor,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const hardDeleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor permanently deleted",
      doctor,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
