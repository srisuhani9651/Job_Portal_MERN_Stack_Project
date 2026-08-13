import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Sends OTP email to dynamic recipient using fixed server-side Gmail SMTP credentials
export const sendOtpEmail = async (toEmail, otp) => {
  dotenv.config();
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  console.log(`[Email Debug] Preparing to send OTP to recipient: ${toEmail}`);
  console.log(`[Email Debug] EMAIL_USER configured: ${emailUser ? "YES" : "NO"}`);
  console.log(`[Email Debug] EMAIL_PASS configured: ${emailPass ? "YES" : "NO"}`);

  if (!emailUser || !emailPass) {
    console.warn(`[Email Warning] SMTP credentials (EMAIL_USER / EMAIL_PASS) are missing in Backend/.env.`);
    console.log(`\n========================================\n[DEV OTP] Generated OTP for ${toEmail}: ${otp}\n========================================\n`);
    return { success: false, reason: "MISSING_CREDENTIALS", otp };
  }

  try {
    // Configures Gmail SMTP transporter with fixed server credentials from .env
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass.replace(/\s+/g, ""), // Removes any accidental spaces in Google App Password
      },
    });

    // Dynamically sets recipient (toEmail) for each registered Student or Recruiter
    const mailOptions = {
      from: `"JobPortal Security" <${emailUser}>`,
      to: toEmail,
      subject: "Your Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #4f46e5; text-align: center; margin-top: 0;">JobPortal Password Reset</h2>
          <p style="color: #334155; font-size: 15px;">Hello,</p>
          <p style="color: #334155; font-size: 15px;">We received a request to reset your password. Use the verification code below to proceed:</p>
          <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1e293b;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 13px;">This OTP is valid for <strong>30 seconds</strong>. If you did not request a password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-bottom: 0;">© JobPortal. All rights reserved.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Success] OTP successfully delivered to ${toEmail} | MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Email Error] Failed to send email via Gmail SMTP:`, err.message);
    if (err.code) console.error(`[Email Error Code]:`, err.code);
    if (err.response) console.error(`[Email Error SMTP Response]:`, err.response);
    return { success: false, error: err.message, code: err.code };
  }
};
