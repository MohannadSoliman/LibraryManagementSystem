const rateLimit = require('express-rate-limit');

// Limit to 10 requests per minute per IP for reading
const readRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  }
});

// Limit to 5 requests per minute per IP for writing
const writeRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  }
});

module.exports = { readRateLimiter, writeRateLimiter };