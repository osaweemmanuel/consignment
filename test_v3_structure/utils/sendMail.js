require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmail = async (receiverEmail, subject, text, html, attachments = []) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const brandedHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; letter-spacing: 2px;">TUNSPHRESH GLOBAL</h2>
          <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0; text-transform: uppercase;">Official Logistics Report</p>
        </div>
        <div style="padding: 40px 24px; line-height: 1.6; background-color: #ffffff;">
          ${html}
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="font-size: 11px; color: #64748b; margin: 0;">© 2024 Tunshpresh Global Logistics Limited. All rights reserved.</p>
          <p style="font-size: 10px; color: #94a3b8; margin: 4px 0 0;">This is an automated system notification regarding tracking security. Please do not reply directly.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `Tunshpresh Global <${process.env.SMTP_USER}>`,
      to: receiverEmail,
      subject: `[LOGISTICS] ${subject}`,
      text: text,
      html: brandedHtml,
      attachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Branded Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
