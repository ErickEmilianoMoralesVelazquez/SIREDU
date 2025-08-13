import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { sendMail } from '../utils/mailer.js';
import { generateResetToken } from '../utils/token.js';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const RESET_TOKEN_EXP_MIN = Number(process.env.RESET_TOKEN_EXP_MIN) || 30;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const token = jwt.sign(
      {
        id_user: user.id_user,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email es requerido' });
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (user && user.status === 'active') {
      const {plain, hash} = generateResetToken();
      const resetExpires = new Date(Date.now() + RESET_TOKEN_EXP_MIN * 60 * 1000);

      user.reset_password_token = hash;
      user.reset_password_expires = resetExpires;
      await user.save();

      const resetUrl = `${APP_URL}/reset-password?token=${plain}&email=${encodeURIComponent(email)}`;

      await sendMail({
        to: email,
        subject: 'Recupera tu contraseña',
        html: `
          <p>Hola ${user.username},</p>
          <p>Solicitaste restablecer tu contraseña. Haz clic en el botón o copia el enlace:</p>
          <p><a href="${resetUrl}">Restablecer contraseña</a></p>
          <p>Vence en ${RESET_TOKEN_EXP_MIN} minutos.</p>
          <p>Si no fuiste tú, ignora este correo.</p>
        `,
      });
    }
    return res.json({ message: 'Si el correo existe, enviamos instrucciones.' });
  } catch (error) {
    console.error('SMTP error completo:', {
      name: error.name,
      code: error.code,
      command: error.command,
      message: error.message,
      response: error.response,
      stack: error.stack
    });
    return res.status(500).json({ error: 'Error al enviar el correo de restablecimiento' });
  }
}

export const validateResetToken = async (req, res) => {
  const { token, email } = req.body;
  if (!token || !email) {
    return res.status(400).json({ error: 'Token y email son requeridos' });
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ where: { 
      email,
      reset_password_token: hashedToken
    }});

    if (!user || !user.reset_password_expires || user.reset_password_expires < new Date()) {
      return res.status(400).json({ valid: false });
    }

    return res.json({ valid: true });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ where: {
      email,
      reset_password_token: hash
    }});

    if (!user || !user.reset_password_expires || user.reset_password_expires < new Date()) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.password_changed_at = new Date();
    user.reset_password_token = null;
    user.reset_password_expires = null;

    await user.save();

    return res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};