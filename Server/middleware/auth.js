// middleware/auth.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Check if authorization header exists
  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header missing'
    });
  }

  const authHeader = req.headers.authorization;
  const tokenParts = authHeader.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Token format should be: Bearer <token>'
    });
  }

  const token = tokenParts[1];

  // 3. Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: err.message
      });
    }

    // ✅ Fix: Attach user data correctly to the request.
    // Ensure the decoded object is directly assigned to req.user.
    // The userId property from the token is what we need.
    req.user = decoded;
    next();
  });
};