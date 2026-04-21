import { body, param, query, check } from 'express-validator';

export const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
 body('role').isIn(['Instructor', 'Student', 'instructor', 'student']).withMessage('Role must be Instructor or Student'),
];

export const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const createCourseRules = [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('category').trim().notEmpty(),
];

export const updateCourseRules = [
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('category').optional().trim().notEmpty(),
  check().custom((_, { req }) => {
    const { title, description, category } = req.body;
    if (title === undefined && description === undefined && category === undefined) {
      throw new Error('At least one of title, description, category is required');
    }
    return true;
  }),
];

export const mongoIdParam = (name) => [
  param(name).isMongoId().withMessage(`Invalid ${name}`),
];

export const createLessonRules = [
  body('title').trim().notEmpty(),
  body('content').trim().notEmpty(),
];

export const enrollRules = [body('courseId').isMongoId().withMessage('Valid courseId is required')];

export const commentRules = [body('text').trim().notEmpty().isLength({ max: 2000 })];

export const ratingRules = [
  body('value').isInt({ min: 1, max: 5 }).withMessage('Rating value must be between 1 and 5'),
];

export const progressRules = [
  body('progressPercent').optional().isFloat({ min: 0, max: 100 }),
  body('completed').optional().isBoolean(),
  body('lastPositionSec').optional().isFloat({ min: 0 }),
];

export const paginationQueryRules = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];
