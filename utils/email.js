const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  // 1) Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: subject,
    text: message,
    // html:
  };

  // 3) Send the email
  // This returns a promise.
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};
module.exports = sendEmail;
