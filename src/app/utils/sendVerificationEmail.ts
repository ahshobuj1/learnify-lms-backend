import nodemailer from 'nodemailer';
import config from '../config';

// Function to generate the HTML for the OTP/Activation Code email
const createOtpEmailHTML = (
  userName: string,
  activationCode: string,
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f0f2f5; margin: 0; padding: 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td align="center">
                    <table width="600" border="0" cellspacing="0" cellpadding="40" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                        <tr>
                            <td align="center" style="padding-bottom: 20px;">
                                <h1 style="background-color: #4A90E2; margin: 0; font-size: 28px;">Welcome to Learnify</h1>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p style="color: #333333; font-size: 16px; line-height: 1.6;">Hello ${userName},</p>
                                <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                                    Thank you for registering with Elearning. To activate your account, please use the following activation code.
                                </p>
                                <div style="background-color: #f2f3f5; border-radius: 8px; margin: 30px 0; padding: 20px; text-align: center;">
                                    <p style="font-size: 48px; font-weight: bold; color: #333333; letter-spacing: 10px; margin: 0;">
                                        ${activationCode}
                                    </p>
                                </div>
                                <p style="color: #555555; font-size: 14px; text-align: center;">
                                    Please enter this code on the activation page within the next <strong>5 minutes</strong>.
                                </p>
                                <p style="color: #888888; font-size: 14px; text-align: center; margin-top: 20px;">
                                    If you did not register for an Elearning account, please ignore this email.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="border-top: 1px solid #eeeeee; padding-top: 20px;">
                                <p style="color: #999999; font-size: 12px;">
                                    If you have any questions, please don't hesitate to contact us at <a href="mailto:support@becodemy.com" style="color: #4A90E2; text-decoration: none;">support@becodemy.com</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
};

// Main function to send the verification email
export const sendVerificationEmail = async (options: {
  to: string;
  userName: string;
  activationCode: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: process.env.NODE_ENV === 'production',
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass,
    },
  });

  await transporter.sendMail({
    from: `"Learnify" <${config.smtp_user}>`,
    to: options.to,
    subject: `Activate your account [${options.activationCode}]`,
    html: createOtpEmailHTML(options.userName, options.activationCode),
  });
};

// Example of how to use the function
/*
sendVerificationEmail({
    to: 'exampleuser@gmail.com',
    userName: 'Shariful Islam',   */
