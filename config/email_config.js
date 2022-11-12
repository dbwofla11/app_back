const nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport({
    service: "gmail",
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PW
    },
  });

module.exports = smtpTransport;