// utils/mailer.js
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,   // mail.lumoraweb.site
  port: Number(process.env.SMTP_PORT || 465),
  secure: Number(process.env.SMTP_PORT) === 465, // true si 465
  auth: {
    user: process.env.SMTP_USER, // ej. jose.julian@lumoraweb.site
    pass: process.env.SMTP_PASS, // contraseña del buzón
  },
  logger: true,
  debug: true,
});

export async function sendMail({ to, subject, html }) {
  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,        // sin nombre, a veces el nombre rompe
    to,
    subject,
    html,
  });
  console.log('SMTP SEND:', {
    accepted: info.accepted,
    rejected: info.rejected,
    response: info.response,
    messageId: info.messageId,
  });
  return info; // <-- devolvemos el objeto completo
}
