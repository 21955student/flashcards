const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT);
    req.user = decoded; 
    next();
  } catch (err) {
    res.clearCookie('token');
    req.user = null;
    next();
  }
};

module.exports = authMiddleware;