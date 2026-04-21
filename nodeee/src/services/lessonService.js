import { Lesson } from '../models/Lesson.js';
import { Course } from '../models/Course.js';
import { AppError } from '../utils/AppError.js';

export async function createLesson(courseId, instructorId, data) {
  const course = await Course.findOne({ _id: courseId, instructor: instructorId });
  if (!course) {
    throw new AppError('Course not found or you do not own this course.', 404);
  }
  const lesson = await Lesson.create({
    title: data.title,
    content: data.content,
    course: courseId,
  });
  return lesson;
}

export async function listLessonsByCourse(courseId) {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404);
  }
  return Lesson.find({ course: courseId }).sort({ createdAt: 1 }).lean();
}

export async function getLessonById(lessonId) {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new AppError('Lesson not found', 404);
  }
  return lesson;
}
