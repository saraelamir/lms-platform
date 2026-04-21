import { Course } from '../models/Course.js';
import { AppError } from '../utils/AppError.js';

export async function loadCourseAndAssertInstructor(req, res, next) {
  const courseId = req.params.courseId || req.params.id;
  const course = await Course.findById(courseId);
  if (!course) {
    return next(new AppError('Course not found', 404));
  }
  if (course.instructor.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only manage your own courses.', 403));
  }
  req.course = course;
  next();
}
