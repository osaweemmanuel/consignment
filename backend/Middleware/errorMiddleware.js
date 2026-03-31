/**
 * --------------------------------------------------------------------------
 *  Express Error Handling Middleware
 *  High Standard Error Formatting
 * --------------------------------------------------------------------------
 */

const notFound = (req, res, next) => {
  const error = new Error(`🚫 Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || '⚠️ Internal Server Error';

  console.error(`💥 Error at [${req.method}] ${req.originalUrl}:`, err.stack);

  res.status(statusCode).json({
    status: 'error',
    message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = { notFound, errorHandler };
