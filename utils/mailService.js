import nodemailer from "nodemailer";
import 'dotenv/config';

// TRANSPORTER

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASS,
  },
});

//  MAIL FUNCTION

export const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_ID ,
      to,
      subject,
      html,
    });

    return true;
  } catch (error) {
    console.log("Email Error:", error.message);
    return false;
  }
};

// 3. HOSPITAL MAIL

export const sendHospitalMail = async (
  email,
  hospitalName,
  password,
  status,
) => {
  let subject = "";
  let html = "";

  if (status === "pending") {
    subject = "Hospital Request Submitted";

    html = `
      <h2>${hospitalName}</h2>
      <p>Your hospital request has been submitted.</p>
      <p>Status: <b>Pending</b></p>
      <p>Email: ${email}</p>
    `;
  }

  if (status === "approved") {
    subject = "Hospital Approved 🎉";

    html = `
      <h2>${hospitalName}</h2>
      <p>Your hospital has been approved successfully.</p>

      <p><b>Email:</b> ${email}</p>
      <p><b>Password:</b> ${password}</p>

      <p>Please change your password after login.</p>
    `;
  }

  if (status === "rejected") {
    subject = "Hospital Rejected";

    html = `
      <h2>${hospitalName}</h2>
      <p>Your hospital request has been rejected.</p>
    `;
  }

  return await sendMail({ to: email, subject, html });
};

// 4. WELCOME EMAIL

export const sendWelcomeEmail = async (email, name, password, role) => {
  return await sendMail({
    to: email,
    subject: "Welcome to Hospital Management System",
    html: `
      <h2>Hello ${name}</h2>
      <p>Your <b>${role}</b> account has been created.</p>

      <p><b>Email:</b> ${email}</p>
      <p><b>Password:</b> ${password}</p>

      <p>Please change password after first login.</p>
    `,
  });
};

// 5. DOCTOR CREDENTIAL EMAIL

export const sendDoctorCredentialEmail = async (email, name, password) => {
  return await sendMail({
    to: email,
    subject: "Doctor Account Credentials",
    html: `
      <h2>Hello Dr. ${name} 👨‍⚕️</h2>

      <p>Your doctor account has been created successfully.</p>

      <p><b>Email:</b> ${email}</p>
      <p><b>Password:</b> ${password}</p>

      <p style="color:red;">
        Please change your password after first login.
      </p>
    `,
  });
};

// 6. USER UPDATE EMAIL

export const sendUserUpdateEmail = async (email, name) => {
  return await sendMail({
    to: email,
    subject: "Account Updated",
    html: `
      <h2>Hello ${name}</h2>
      <p>Your account details have been updated successfully.</p>

      <p>If this wasn't you, contact support immediately.</p>
    `,
  });
};


// 7. APPOINTMENT BOOKING EMAIL

export const sendAppointmentEmail = async (
  email,
  patientName,
  doctorName,
  hospitalName,
  date,
  time
) => {
  return await sendMail({
    to: email,
    subject: "Appointment Confirmation - Hospital Management System",
    html: `
      <h2>Hello ${patientName}</h2>

      <p>Your appointment has been successfully booked.</p>

      <h3>Appointment Details:</h3>

      <p><b>Doctor:</b> Dr. ${doctorName}</p>
      <p><b>Hospital:</b> ${hospitalName}</p>
      <p><b>Date:</b> ${date}</p>
      <p><b>Time:</b> ${time}</p>

      <p style="color:green;">
        Please arrive 10-15 minutes early.
      </p>

      <p>Thank you for using our Hospital Management System.</p>
    `,
  });
};