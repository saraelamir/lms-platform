import { Enrollment } from '../models/Enrollment.js';
import { Course } from '../models/Course.js';
import { AppError } from '../utils/AppError.js';

export async function enrollStudent(studentId, courseId) {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404);
  }
  try {
    const enrollment = await Enrollment.create({ student: studentId, course: courseId });
    return enrollment.populate('course', 'title description category instructor averageRating ratingCount');
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError('You are already enrolled in this course.', 409);
    }
    throw err;
  }
}

export async function listMyCourses(studentId) {
  const rows = await Enrollment.find({ student: studentId })
    .populate('course', 'title description category instructor averageRating ratingCount createdAt')
    .sort({ createdAt: -1 })
    .lean();
  return rows.map((r) => r.course).filter(Boolean);
}

export async function assertStudentEnrolled(studentId, courseId) {
  const en = await Enrollment.findOne({ student: studentId, course: courseId });
  if (!en) {
    throw new AppError('You must be enrolled in this course to perform this action.', 403);
  }
}
