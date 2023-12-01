const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
            user: 'omkaranbhule68@gmail.com',
            pass: 'hcrwixkvkacpsssa'
        }
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: 'omkaranbhule68@gmail.com',
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = mailSender;