import nodemailer from "nodemailer";

export async function sendOtpEmail(email: string, otp: string) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM || "noreply@disastermanagement.com";

  // Log OTP to server console for easy access in dev
  console.log("\n=========================================");
  console.log(`[OTP EMAIL SYSTEM]`);
  console.log(`To: ${email}`);
  console.log(`Code: ${otp}`);
  console.log(`Expires: 5 minutes`);
  console.log("=========================================\n");

  if (!host || !user || !pass) {
    // Return mock success when SMTP credentials are not configured in .env
    return { success: true, mock: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // True for 465, false for others
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from,
    to: email,
    subject: `${otp} is your Disaster Management Platform Verification Code`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #c2410c; text-align: center; font-size: 22px; font-weight: 700; margin-bottom: 5px;">Disaster Management & Response</h2>
        <p style="color: #64748b; text-align: center; font-size: 14px; margin-top: 0;">Coordination Platform Auth System</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #334155; font-size: 16px; line-height: 1.5;">Hello,</p>
        <p style="color: #334155; font-size: 16px; line-height: 1.5;">Thank you for registering on our platform. To complete your registration and secure your account, please enter the 6-digit verification code below on the signup page:</p>
        <div style="background-color: #fff7ed; border: 1px dashed #fdba74; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #ea580c; font-family: monospace;">${otp}</span>
        </div>
        <p style="color: #64748b; font-size: 14px; line-height: 1.5;">This code is valid for 5 minutes. If you did not request this code, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">Disaster Management & Response Coordination Platform &copy; 2026</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    // If we're in development, we don't want to fail signup because of transporter issues
    if (process.env.NODE_ENV === "development") {
      return { success: true, mock: true, error: (error as Error).message };
    }
    throw error;
  }
}
