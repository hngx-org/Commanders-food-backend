const nodemailer = require("nodemailer");
const ENV = require("../config/env");

const transporter = nodemailer.createTransport({
  host: ENV.smtpHost,
  port: ENV.smtpPort,
  secure: false,
  auth: {
    user: ENV.smtpUsername,
    pass: ENV.smtpPassword,
  },
});

const sendEmail = async ({ to, subject, text }) => {
  const email = await transporter.sendMail({
    from: ENV.smtpUsername,
    to,
    subject,
    text,
  });
  console.log("...email sent");
};

module.exports = {
  sendEmail,
};
