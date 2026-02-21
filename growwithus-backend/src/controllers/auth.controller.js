const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role, year } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "name, email, and password are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "password must be at least 6 characters");
  }

  if (role && !["student", "admin"].includes(role)) {
    throw new ApiError(400, "role must be either student or admin");
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    throw new ApiError(409, "Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role: role || "student",
    year
  });

  const token = signToken(user);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, year: user.year }
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = signToken(user);

  res.status(200).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, year: user.year }
  });
});
