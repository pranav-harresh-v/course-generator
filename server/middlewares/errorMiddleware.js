// Centralized error handler
const errorMiddleware = (err, req, res, next) => {
  // If the error has no status code, default to 500
  const statusCode = err.status || 500;

  // Log only in non-production environments
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack || err);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
  });
};

module.exports = errorMiddleware;
