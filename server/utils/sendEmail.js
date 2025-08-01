import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // use STARTTLS for port 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Task Manager" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email error:", error.message);
    throw new Error("Email could not be sent");
  }
};
