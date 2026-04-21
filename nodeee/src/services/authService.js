import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

function signToken(userId) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

function toPublicUser(userDoc) {
  const u = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete u.password;
  return u;
}

export async function registerUser({ name, email, password, role }) {
  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
  });
  const token = signToken(user._id.toString());
  return { user: toPublicUser(user), token };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid email or password', 401);
  }
  const token = signToken(user._id.toString());
  return { user: toPublicUser(user), token };
}
