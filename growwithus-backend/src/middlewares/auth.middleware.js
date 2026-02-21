const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");

module.exports = function auth(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Unauthorized: Bearer token missing"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (_error) {
    return next(new ApiError(401, "Unauthorized: Invalid or expired token"));
  }
};
