import * as lessonService from '../services/lessonService.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createLesson = asyncHandler(async (req, res) => {
  const lesson = await lessonService.createLesson(req.params.courseId, req.user._id, req.body);
  return sendSuccess(res, { lesson }, 'Lesson created', 201);
});

export const listLessons = asyncHandler(async (req, res) => {
  const lessons = await lessonService.listLessonsByCourse(req.params.courseId);
  return sendSuccess(res, { lessons }, 'Lessons retrieved');
});
