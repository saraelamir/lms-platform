import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { sendError } from '../utils/response.js';
import { AppError } from '../utils/AppError.js';

function handleMongooseValidationError(err) {
  const errors = Object.values(err.errors).map((e) => e.message);
  return { message: 'Validation failed', statusCode: 400, errors };
}

function handleMongooseCastError() {
  return { message: 'Invalid ID format', statusCode: 400 };
}

function handleDuplicateKeyError(err) {
  const field = Object.keys(err.keyPattern || {})[0] || 'field';
  return { message: `Duplicate value for ${field}`, statusCode: 409 };
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || null;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof mongoose.Error.ValidationError) {
    const parsed = handleMongooseValidationError(err);
    statusCode = parsed.statusCode;
    message = parsed.message;
    errors = parsed.errors;
  } else if (err instanceof mongoose.Error.CastError) {
    const parsed = handleMongooseCastError();
    statusCode = parsed.statusCode;
    message = parsed.message;
  } else if (err.code === 11000) {
    const parsed = handleDuplicateKeyError(err);
    statusCode = parsed.statusCode;
    message = parsed.message;
  }

  if (statusCode === 500 && env.NODE_ENV !== 'development') {
    message = 'Internal server error';
  }

  return sendError(res, message, statusCode, errors);
}

export function notFoundHandler(req, res, next) {
  const err = new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404);
  next(err);
}
