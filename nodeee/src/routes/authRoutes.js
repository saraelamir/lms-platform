import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/authController.js';
import { registerRules, loginRules } from '../middlewares/validationRules.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, data: {}, message: 'Too many auth attempts, try again later.' },
});

router.post('/register', authLimiter, registerRules, validate, authController.register);
router.post('/login', authLimiter, loginRules, validate, authController.login);

export default router;
