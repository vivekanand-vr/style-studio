/**
 * Global Express error handler.
 * Must be registered LAST with app.use().
 */
function errorHandler(err, req, res, next) {
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation failed', details: messages });
  }

  // Mongoose duplicate key (unique index violation)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ error: `Duplicate value for field: ${field}` });
  }

  // Mongoose cast error (invalid ObjectId etc.)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid value for field: ${err.path}` });
  }

  // JWT errors (Phase 2)
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (status === 500) {
    console.error('[ERROR]', err);
  }

  res.status(status).json({ error: message });
}

module.exports = errorHandler;
