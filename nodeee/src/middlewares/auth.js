import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { User } from '../models/User.js';

export async function protect(req, res, next) {
  let token;
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) {
    token = auth.slice(7);
  }
  if (!token) {
    return next(new AppError('Not authorized. No token provided.', 401));
  }
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.sub).select('-password');
    if (!user) {
      return next(new AppError('User belonging to this token no longer exists.', 401));
    }
    req.user = user;
    next();
  } catch {
    next(new AppError('Not authorized. Invalid token.', 401));
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authorized.', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Forbidden: insufficient permissions.', 403));
    }
    next();
  };
}

export async function optionalAuth(req, res, next) {
  let token;
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) {
    token = auth.slice(7);
  }
  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.sub).select('-password');
    if (user) {
      req.user = user;
    }
  } catch {
    /* invalid token: treat as anonymous */
  }
  next();
}
