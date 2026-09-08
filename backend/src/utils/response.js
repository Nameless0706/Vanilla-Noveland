export const successResponse = (res, status = 200, message = "Success", data) =>
  res.status(status).json({
    success: true,
    message,
    data,
  });

export const errorResponse = (res, status = 500, message = "Error", errors) =>
  res.status(status).json({
    success: false,
    message,
    errors,
  });