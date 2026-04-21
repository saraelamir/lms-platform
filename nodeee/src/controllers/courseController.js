import * as courseService from '../services/courseService.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listCourses = asyncHandler(async (req, res) => {
  const data = await courseService.listCourses(req.query);
  return sendSuccess(res, data, 'Courses retrieved');
});

export const getCourse = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseById(req.params.id);
  return sendSuccess(res, { course }, 'Course retrieved');
});

export const createCourse = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse(req.body, req.user._id);
  return sendSuccess(res, { course }, 'Course created', 201);
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.user._id, req.body);
  return sendSuccess(res, { course }, 'Course updated');
});

export const deleteCourse = asyncHandler(async (req, res) => {
  await courseService.deleteCourse(req.params.id, req.user._id);
  return sendSuccess(res, {}, 'Course deleted');
});
