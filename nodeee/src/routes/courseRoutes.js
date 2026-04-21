import { Router } from 'express';
import { query } from 'express-validator';
import * as courseController from '../controllers/courseController.js';
import * as lessonController from '../controllers/lessonController.js';
import * as ratingController from '../controllers/ratingController.js';
import { protect, authorize, optionalAuth } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loadCourseAndAssertInstructor } from '../middlewares/courseOwnership.js';
import { validate } from '../middlewares/validate.js';
import {
  createCourseRules,
  updateCourseRules,
  mongoIdParam,
  createLessonRules,
  ratingRules,
  paginationQueryRules,
} from '../middlewares/validationRules.js';

const router = Router();

const listCoursesQueryRules = [
  ...paginationQueryRules,
  query('search').optional().isString().trim(),
  query('category').optional().isString().trim(),
];

router.get('/', listCoursesQueryRules, validate, courseController.listCourses);

router.get('/:id', ...mongoIdParam('id'), validate, courseController.getCourse);

router.post(
  '/',
  protect,
  authorize('Instructor'),
  createCourseRules,
  validate,
  courseController.createCourse
);

router.post(
  '/:courseId/lessons',
  protect,
  authorize('Instructor'),
  ...mongoIdParam('courseId'),
  createLessonRules,
  validate,
  asyncHandler(loadCourseAndAssertInstructor),
  lessonController.createLesson
);

router.get(
  '/:courseId/lessons',
  ...mongoIdParam('courseId'),
  validate,
  lessonController.listLessons
);

router.post(
  '/:courseId/ratings',
  protect,
  authorize('Student'),
  ...mongoIdParam('courseId'),
  ratingRules,
  validate,
  ratingController.rateCourse
);

router.get(
  '/:courseId/ratings',
  optionalAuth,
  ...mongoIdParam('courseId'),
  validate,
  ratingController.getRatings
);

router.put(
  '/:id',
  protect,
  authorize('Instructor'),
  ...mongoIdParam('id'),
  updateCourseRules,
  validate,
  asyncHandler(loadCourseAndAssertInstructor),
  courseController.updateCourse
);

router.delete(
  '/:id',
  protect,
  authorize('Instructor'),
  ...mongoIdParam('id'),
  validate,
  asyncHandler(loadCourseAndAssertInstructor),
  courseController.deleteCourse
);

export default router;
