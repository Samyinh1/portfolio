import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function login(request, response) {
  const { email, password } = request.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return response.status(400).json({ message: 'Email and password are required' });
  }

  if (!adminEmail || !adminPassword || email !== adminEmail) {
    return response.status(401).json({ message: 'Invalid credentials' });
  }

  const passwordMatches = adminPassword.startsWith('$2')
    ? await bcrypt.compare(password, adminPassword)
    : password === adminPassword;

  if (!passwordMatches) {
    return response.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

  return response.json({ token });
}
