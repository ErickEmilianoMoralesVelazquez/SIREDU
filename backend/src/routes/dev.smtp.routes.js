// src/routes/dev.smtp.routes.js
import { Router } from 'express';
import { transporter, sendMail } from '../utils/mailer.js';

const router = Router();

router.get('/smtp/verify', async (_req, res) => {
  try {
    const ok = await transporter.verify();
    return res.json({ verify: ok });
  } catch (e) {
    return res.status(500).json({
      verify: false,
      error: e.message,
      code: e.code,
      command: e.command,
      response: e.response,
    });
  }
});

router.post('/smtp/test', async (req, res) => {
  const { to = process.env.SMTP_USER } = req.body || {};
  try {
    const r = await sendMail({
      to,
      subject: 'Prueba SMTP ✔',
      html: '<p>Si ves esto, tu SMTP funciona.</p>',
    });
    return res.json({
      to,
      accepted: r.accepted,
      rejected: r.rejected,
      response: r.response,
      messageId: r.messageId,
    });
  } catch (e) {
    return res.status(500).json({
      error: e.message, code: e.code, command: e.command, response: e.response,
    });
  }
});

export default router;
