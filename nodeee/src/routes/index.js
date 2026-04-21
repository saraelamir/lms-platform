import { Router } from 'express';
import authRoutes from './authRoutes.js';
import courseRoutes from './courseRoutes.js';
import enrollmentRoutes from './enrollmentRoutes.js';
import lessonRoutes from './lessonRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/lessons', lessonRoutes);

export default router;
