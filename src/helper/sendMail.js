const nodemailer = require("nodemailer");
const ENV = require("../config/env");
const logger = require("../config/logger");

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
  try {
    await transporter.sendMail({
      from: ENV.smtpUsername,
      to,
      subject,
      html: text,
    });
    logger.info(`Email sent to ${to} to ${subject}`);
  } catch (e) {
    // console.log(e);
    logger.error(`Error sending email: ${e.message}`);
    return false;
  }
};

module.exports = sendEmail;
