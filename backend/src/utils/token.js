import crypto from 'crypto';

export function generateResetToken() {
  const plain = crypto.randomBytes(32).toString('hex'); // para URL
  const hash = crypto.createHash('sha256').update(plain).digest('hex'); // guardas este
  return { plain, hash };
}

