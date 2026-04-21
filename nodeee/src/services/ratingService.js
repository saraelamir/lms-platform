import mongoose from 'mongoose';
import { Rating } from '../models/Rating.js';
import { Course } from '../models/Course.js';
import { AppError } from '../utils/AppError.js';
import { assertStudentEnrolled } from './enrollmentService.js';

async function recalcCourseRating(courseId) {
  const stats = await Rating.aggregate([
    { $match: { course: new mongoose.Types.ObjectId(courseId) } },
    {
      $group: {
        _id: '$course',
        avg: { $avg: '$value' },
        count: { $sum: 1 },
      },
    },
  ]);
  const avg = stats[0]?.avg ?? 0;
  const count = stats[0]?.count ?? 0;
  await Course.findByIdAndUpdate(courseId, {
    averageRating: Math.round(avg * 10) / 10,
    ratingCount: count,
  });
}

export async function upsertRating(studentId, courseId, value) {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404);
  }
  await assertStudentEnrolled(studentId, courseId);

  await Rating.findOneAndUpdate(
    { user: studentId, course: courseId },
    { value },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  await recalcCourseRating(courseId);
  const rating = await Rating.findOne({ user: studentId, course: courseId }).lean();
  const updatedCourse = await Course.findById(courseId).select('averageRating ratingCount').lean();
  return { rating, summary: updatedCourse };
}

export async function getRatingSummary(courseId, userId = null) {
  const course = await Course.findById(courseId).select('averageRating ratingCount title').lean();
  if (!course) {
    throw new AppError('Course not found', 404);
  }
  let myRating = null;
  if (userId) {
    myRating = await Rating.findOne({ user: userId, course: courseId }).lean();
  }
  return {
    courseId,
    averageRating: course.averageRating,
    ratingCount: course.ratingCount,
    myRating: myRating ? myRating.value : null,
  };
}
