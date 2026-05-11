export const sendWelcomeEmail = async (email, name, password, role = "user") => {
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
