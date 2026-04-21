import * as ratingService from '../services/ratingService.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const rateCourse = asyncHandler(async (req, res) => {
  const data = await ratingService.upsertRating(req.user._id, req.params.courseId, req.body.value);
  return sendSuccess(res, data, 'Rating saved');
});

export const getRatings = asyncHandler(async (req, res) => {
  const userId = req.user?.role === 'Student' ? req.user._id : null;
  const data = await ratingService.getRatingSummary(req.params.courseId, userId);
  return sendSuccess(res, data, 'Rating summary');
});
