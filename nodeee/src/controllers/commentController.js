import * as commentService from '../services/commentService.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createComment = asyncHandler(async (req, res) => {
  const comment = await commentService.addComment(req.user._id, req.params.lessonId, req.body.text);
  return sendSuccess(res, { comment }, 'Comment added', 201);
});

export const listComments = asyncHandler(async (req, res) => {
  const data = await commentService.listComments(req.params.lessonId, req.query);
  return sendSuccess(res, data, 'Comments retrieved');
});
