const ApiError = require("../utils/apiError");

module.exports = function validate(schema) {
  return (req, _res, next) => {
    const payload = {
      body: req.body,
      params: req.params,
      query: req.query
    };

    const { error, value } = schema.validate(payload, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      return next(new ApiError(400, message));
    }

    req.body = value.body;
    req.params = value.params;
    req.query = value.query;

    return next();
  };
};
