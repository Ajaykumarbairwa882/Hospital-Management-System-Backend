export const sendWelcomeEmail = async (
  email,
  name,
  password,
  role = "user",
) => {
  const { default: nodemailer } = await import("nodemailer");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_ID,
    to: email,
    subject: "Welcome to Hospital Management System",
    html: `
      <h2>Hello ${name}</h2>
      <p>Your ${role} account has been created.</p>
      <p>Email: ${email}</p>
      <p>Password: ${password}</p>
    `,
  });
};

export const sendUserUpdateEmail = async (email, name) => {
  const { default: nodemailer } = await import("nodemailer");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_ID,
    to: email,
    subject: "Your account has been updated",
    html: `
      <h2>Hello ${name}</h2>
      <p>Your account details have been updated successfully.</p>
      <p>If this wasn't you, please contact support immediately.</p>
    `,
  });
};

export const sendHospitalMail = async (
  email,
  hospitalName,
  password,
  status,
) => {
  const { default: nodemailer } = await import("nodemailer");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASS,
    },
  });

  let subject = "";
  let html = "";

  // PENDING MAIL
  if (status === "pending") {
    subject = "Hospital Request Submitted";

    html = `
      <h2>${hospitalName}</h2>

      <p>
        Your hospital request has been submitted successfully.
      </p>

      <p>Status: <b>Pending</b></p>

      <p>
        Wait for super admin approval.
      </p>

      <p>Email: ${email}</p>
      <p>Password: ${password}</p>
    `;
  }

  // APPROVED MAIL
  if (status === "approved") {
    subject = "Hospital Approved";

    html = `
      <h2>${hospitalName}</h2>

      <p>
        Your hospital has been approved successfully.
      </p>

      <p>
        You can now login to the system.
      </p>
    `;
  }

  // REJECTED MAIL
  if (status === "rejected") {
    subject = "Hospital Rejected";

    html = `
      <h2>${hospitalName}</h2>

      <p>
        Your hospital request has been rejected.
      </p>
    `;
  }

  await transporter.sendMail({
    from: process.env.MAIL_ID,
    to: email,
    subject,
    html,
  });
};
