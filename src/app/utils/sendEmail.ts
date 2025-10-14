import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (
  to: string,
  resetLink: string,
  subject: string,
) => {
  // Create a test account or replace with real credentials.
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.node_env === 'production',
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass,
    },
  });

  await transporter.sendMail({
    from: `"PH University" ${config.smtp_user}`,
    to,
    subject,
    html: `
      <p>Click here to reset: <a href="${resetLink}">${resetLink}</a></p>
    `,
  });
};
