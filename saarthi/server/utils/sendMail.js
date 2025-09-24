import nodemailer from "nodemailer";
import { sosEmail } from "./emailTemplate.js";

const sendMail = async (emailId, subject, details) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  // console.log(transporter);

  const info = await transporter.sendMail({
    from: 'hriteshsaha4@gmail.com',
    to: emailId,
    subject: subject,
    html: sosEmail(details.username, details.location, details.city, details.timestamp),
  });

  console.log("Email sent: %s", info.messageId);
};

export {
  sendMail,
};
