const errorHandler = (err, req, res, next) => {
  // If the response status code is 200 (OK), it means an error occurred
  // after the response was already in progress. In that case, we change it to 500 (Server Error).
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Set the HTTP status code
  res.status(statusCode);

  // Send a JSON response with the error message and, in development, the stack trace
  res.json({
    message: err.message,
    // We only expose the stack trace during development for security.
    // In production, we'll send a clean, minimal error.
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
