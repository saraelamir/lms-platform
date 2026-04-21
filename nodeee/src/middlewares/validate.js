import { validationResult } from 'express-validator';
import { AppError } from '../utils/AppError.js';

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => e.msg);
    return next(new AppError('Validation failed', 400, formatted));
  }
  next();
}
