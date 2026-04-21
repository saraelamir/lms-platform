import { Progress } from '../models/Progress.js';
import { Lesson } from '../models/Lesson.js';
import { AppError } from '../utils/AppError.js';
import { assertStudentEnrolled } from './enrollmentService.js';

export async function upsertLessonProgress(studentId, lessonId, payload) {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new AppError('Lesson not found', 404);
  }
  await assertStudentEnrolled(studentId, lesson.course);

  const update = {};
  if (payload.progressPercent !== undefined) {
    update.progressPercent = payload.progressPercent;
  }
  if (payload.completed !== undefined) {
    update.completed = payload.completed;
  }
  if (payload.lastPositionSec !== undefined) {
    update.lastPositionSec = payload.lastPositionSec;
  }
  if (Object.keys(update).length === 0) {
    throw new AppError('Provide at least one of: progressPercent, completed, lastPositionSec', 400);
  }

  const progress = await Progress.findOneAndUpdate(
    { student: studentId, lesson: lessonId },
    { $set: update },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return progress;
}

export async function getLessonProgress(studentId, lessonId) {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new AppError('Lesson not found', 404);
  }
  await assertStudentEnrolled(studentId, lesson.course);
  let progress = await Progress.findOne({ student: studentId, lesson: lessonId }).lean();
  if (!progress) {
    progress = {
      student: studentId,
      lesson: lessonId,
      progressPercent: 0,
      completed: false,
      lastPositionSec: 0,
    };
  }
  return progress;
}
