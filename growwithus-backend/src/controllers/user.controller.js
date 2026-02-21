const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");

exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({ success: true, data: user });
});

exports.getAllUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: users.length, data: users });
});
