const ApiError = require("../utils/apiError");

module.exports = function allowRoles(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden: You do not have permission"));
    }
    return next();
  };
};
