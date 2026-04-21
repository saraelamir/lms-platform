import { Course } from '../models/Course.js';
import { Lesson } from '../models/Lesson.js';
import { Enrollment } from '../models/Enrollment.js';
import { Rating } from '../models/Rating.js';
import { Comment } from '../models/Comment.js';
import { Progress } from '../models/Progress.js';
import { AppError } from '../utils/AppError.js';
import { escapeRegex, parsePagination } from '../utils/helpers.js';

export async function listCourses(query) {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.search) {
    filter.title = { $regex: escapeRegex(query.search), $options: 'i' };
  }
  if (query.category) {
    filter.category = query.category;
  }

  const [items, total] = await Promise.all([
    Course.find(filter)
      .populate('instructor', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Course.countDocuments(filter),
  ]);

  return {
    courses: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 0,
    },
  };
}

export async function createCourse(data, instructorId) {
  const course = await Course.create({
    title: data.title,
    description: data.description,
    category: data.category,
    instructor: instructorId,
  });
  return course.populate('instructor', 'name email role');
}

export async function updateCourse(courseId, instructorId, data) {
  const course = await Course.findOne({ _id: courseId, instructor: instructorId });
  if (!course) {
    throw new AppError('Course not found or you do not own this course.', 404);
  }
  if (data.title === undefined && data.description === undefined && data.category === undefined) {
    throw new AppError('No fields to update', 400);
  }
  if (data.title !== undefined) course.title = data.title;
  if (data.description !== undefined) course.description = data.description;
  if (data.category !== undefined) course.category = data.category;
  await course.save();
  return course.populate('instructor', 'name email role');
}

export async function deleteCourse(courseId, instructorId) {
  const course = await Course.findOne({ _id: courseId, instructor: instructorId });
  if (!course) {
    throw new AppError('Course not found or you do not own this course.', 404);
  }
  const lessonIds = (await Lesson.find({ course: courseId }).select('_id').lean()).map((l) => l._id);
  if (lessonIds.length > 0) {
    await Comment.deleteMany({ lesson: { $in: lessonIds } });
    await Progress.deleteMany({ lesson: { $in: lessonIds } });
  }
  await Lesson.deleteMany({ course: courseId });
  await Enrollment.deleteMany({ course: courseId });
  await Rating.deleteMany({ course: courseId });
  await Course.deleteOne({ _id: courseId });
  return course;
}

export async function getCourseById(courseId) {
  const course = await Course.findById(courseId).populate('instructor', 'name email role');
  if (!course) {
    throw new AppError('Course not found', 404);
  }
  return course;
}
