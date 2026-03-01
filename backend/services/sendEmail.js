const nodemailer = require('nodemailer');
const { options } = require('../routes/auth/authRoutes');
const { text } = require('express');


const sendEmail = async (options) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOption = {
        from: "Arjun Shah <hello@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOption)
};


module.exports = sendEmail;