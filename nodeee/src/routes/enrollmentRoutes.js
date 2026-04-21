import { Router } from 'express';
import * as enrollmentController from '../controllers/enrollmentController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { enrollRules } from '../middlewares/validationRules.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.post(
  '/',
  protect,
  authorize('Student'),
  enrollRules,
  validate,
  enrollmentController.enroll
);

router.get(
  '/my-courses',
  protect,
  authorize('Student'),
  enrollmentController.myCourses
);

export default router;
