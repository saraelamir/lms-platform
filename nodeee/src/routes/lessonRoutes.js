import { Router } from 'express';
import * as commentController from '../controllers/commentController.js';
import * as progressController from '../controllers/progressController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  mongoIdParam,
  commentRules,
  progressRules,
  paginationQueryRules,
} from '../middlewares/validationRules.js';

const router = Router();

router.post(
  '/:lessonId/comments',
  protect,
  authorize('Student'),
  ...mongoIdParam('lessonId'),
  commentRules,
  validate,
  commentController.createComment
);

router.get(
  '/:lessonId/comments',
  ...mongoIdParam('lessonId'),
  paginationQueryRules,
  validate,
  commentController.listComments
);

router.put(
  '/:lessonId/progress',
  protect,
  authorize('Student'),
  ...mongoIdParam('lessonId'),
  progressRules,
  validate,
  progressController.updateProgress
);

router.get(
  '/:lessonId/progress',
  protect,
  authorize('Student'),
  ...mongoIdParam('lessonId'),
  validate,
  progressController.getProgress
);

export default router;
