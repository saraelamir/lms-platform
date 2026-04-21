import { Comment } from '../models/Comment.js';
import { Lesson } from '../models/Lesson.js';
import { AppError } from '../utils/AppError.js';
import { parsePagination } from '../utils/helpers.js';

export async function addComment(userId, lessonId, text) {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new AppError('Lesson not found', 404);
  }
  const comment = await Comment.create({ user: userId, lesson: lessonId, text });
  return comment.populate('user', 'name email role');
}

export async function listComments(lessonId, query) {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new AppError('Lesson not found', 404);
  }
  const { page, limit, skip } = parsePagination(query);
  const filter = { lesson: lessonId };

  const [items, total] = await Promise.all([
    Comment.find(filter)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Comment.countDocuments(filter),
  ]);

  return {
    comments: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 0,
    },
  };
}
