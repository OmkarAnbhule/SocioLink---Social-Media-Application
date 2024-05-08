require('dotenv').config();
const nodemailer = require('nodemailer');
const mailSender = async (email, title, body) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_API_ID,
        pass: process.env.EMAIL_API_KEY
      }
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: 'omkaranbhule68@gmail.com',
      to: email,
      subject: title,
      html: body,
    });
    return info;
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = mailSender;