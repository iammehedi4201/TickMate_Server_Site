import nodemailer from "nodemailer";
import config from "../config/config";
const sendEmail = async (email: string, html: string, subject: string) => {
  console.log("email", email);

  const transporter = nodemailer.createTransport({
    host: config.sendEmail.email_service,
    port: 587,
    secure: false,
    auth: {
      user: config.sendEmail.email,
      pass: config.sendEmail.app_password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"PH Health Care" <iammehedi296@gmail.com>',
    to: email,
    subject,
    html,
  });

  console.log("Message sent: %s", info.messageId);
};

export default sendEmail;
