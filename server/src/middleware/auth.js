import jwt from 'jsonwebtoken';

export function requireAuth(request, response, next) {
  // Allow token via query param for SSE (EventSource can't set headers)
  const token =
    request.query.token ||
    (request.headers.authorization?.startsWith('Bearer ')
      ? request.headers.authorization.replace('Bearer ', '')
      : null);

  if (!token) {
    return response.status(401).json({ message: 'Authentication token is required' });
  }

  try {
    request.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (_error) {
    response.status(401).json({ message: 'Invalid or expired token' });
  }
}
