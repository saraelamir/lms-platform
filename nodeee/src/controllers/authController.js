import * as authService from '../services/authService.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  return sendSuccess(res, result, 'Registration successful', 201);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  return sendSuccess(res, result, 'Login successful');
});
