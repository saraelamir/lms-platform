import * as progressService from '../services/progressService.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const updateProgress = asyncHandler(async (req, res) => {
  const progress = await progressService.upsertLessonProgress(
    req.user._id,
    req.params.lessonId,
    req.body
  );
  return sendSuccess(res, { progress }, 'Progress updated');
});

export const getProgress = asyncHandler(async (req, res) => {
  const progress = await progressService.getLessonProgress(req.user._id, req.params.lessonId);
  return sendSuccess(res, { progress }, 'Progress retrieved');
});
