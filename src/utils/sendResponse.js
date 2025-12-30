export const sendResponse = (res, statusCode, status, message, data = null) => {
  return res.status(statusCode).json({
    status, // "Success" | "Failed"
    statusCode,
    message,
    data,
  });
};
