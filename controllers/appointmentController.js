import Appointment from "../models/appointmentModel.js";
import Doctor from "../models/doctorModel.js";
import Hospital from "../models/Hospital Model/hospitalModel.js";
import { sendAppointmentEmail } from "../utils/mailService.js";

export const createAppointment = async (req, res) => {
  try {
    const {
      userId,
      hospitalId,
      doctorId,
      patientName,
      email,
      phone,
      age,
      date,
      time,
    } = req.body;

    if (!userId || !hospitalId || !doctorId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const doctor = await Doctor.findById(doctorId)
      .populate("hospital")
      .populate("department")
      .populate("subDepartment");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    const appointment = await Appointment.create({
      userId,
      hospitalId,
      doctorId,
      patientName,
      email,
      phone,
      age,
      date,
      time,
    });

    await appointment.populate(["doctorId", "hospitalId"]);

    return res.status(201).json({
      success: true,
      message: "Appointment request sent to doctor",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userId: req.params.userId,
    })
      .populate("doctorId")
      .populate("hospitalId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.params.userId });

    if (!doctor) {
      return res.status(200).json({
        success: true,
        appointments: [],
      });
    }

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate("userId", "name email phone")
      .populate("doctorId")
      .populate("hospitalId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const approveAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("doctorId")
      .populate("hospitalId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = "approved";
    await appointment.save();

    await sendAppointmentEmail(
      appointment.email,
      appointment.patientName,
      appointment.doctorId?.doctorName || "Doctor",
      appointment.hospitalId?.hospitalName || "Hospital",
      appointment.date,
      appointment.time,
    );

    return res.status(200).json({
      success: true,
      message: "Appointment approved and mail sent",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
