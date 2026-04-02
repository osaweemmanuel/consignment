/**
 * --------------------------------------------------------------------------
 *  Async Handler Utility
 *  Wrap async controller functions to catch errors and pass to errorHandler
 * --------------------------------------------------------------------------
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
