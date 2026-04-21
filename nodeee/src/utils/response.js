export function sendSuccess(res, data = null, message = '', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data: data ?? {},
    message,
  });
}

export function sendError(res, message, statusCode = 400, errors = null) {
  const body = {
    success: false,
    data: {},
    message,
  };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
}
