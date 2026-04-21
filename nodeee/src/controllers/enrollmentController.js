import * as enrollmentService from '../services/enrollmentService.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const enroll = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.enrollStudent(req.user._id, req.body.courseId);
  return sendSuccess(res, { enrollment }, 'Enrolled successfully', 201);
});

export const myCourses = asyncHandler(async (req, res) => {
  const courses = await enrollmentService.listMyCourses(req.user._id);
  return sendSuccess(res, { courses }, 'Your enrolled courses');
});
