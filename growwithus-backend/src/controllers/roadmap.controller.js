const mongoose = require("mongoose");
const Roadmap = require("../models/roadmap.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const { sanitizeTopics } = require("../utils/youtube");

exports.createRoadmap = asyncHandler(async (req, res) => {
  const { slug, title, description, category, difficulty, estimatedDuration, topics, projects } =
    req.body;

  if (!slug || !title || !category || !difficulty || !Array.isArray(topics) || !topics.length) {
    throw new ApiError(400, "slug, title, category, difficulty, and topics are required");
  }

  const existing = await Roadmap.findOne({ slug: slug.toLowerCase().trim() });
  if (existing) {
    throw new ApiError(409, "Roadmap slug already exists");
  }

  let normalizedTopics;
  try {
    normalizedTopics = sanitizeTopics(topics);
  } catch (error) {
    throw new ApiError(400, error.message);
  }

  const roadmap = await Roadmap.create({
    slug: slug.toLowerCase().trim(),
    title: title.trim(),
    description: description || "",
    category: category.trim(),
    difficulty: difficulty.trim(),
    estimatedDuration: estimatedDuration || "",
    topics: normalizedTopics,
    projects: (projects || []).map((project) => ({ title: String(project.title || "").trim() })).filter((project) => project.title),
    createdBy: req.user.id
  });

  res.status(201).json({ success: true, data: roadmap });
});

exports.getRoadmaps = asyncHandler(async (req, res) => {
  const { category, difficulty, q } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  if (q) {
    filter.$or = [{ title: { $regex: q, $options: "i" } }, { description: { $regex: q, $options: "i" } }];
  }

  const roadmaps = await Roadmap.find(filter)
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: roadmaps.length, data: roadmaps });
});

exports.getRoadmapById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(400, "Invalid roadmap id");
  }

  const roadmap = await Roadmap.findById(req.params.id).populate("createdBy", "name email role");
  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  res.status(200).json({ success: true, data: roadmap });
});

exports.getRoadmapBySlug = asyncHandler(async (req, res) => {
  const slug = req.params.slug?.toLowerCase().trim();
  const roadmap = await Roadmap.findOne({ slug }).populate("createdBy", "name email role");

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  res.status(200).json({ success: true, data: roadmap });
});

exports.updateRoadmap = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(400, "Invalid roadmap id");
  }

  if (req.body.slug) {
    const conflicting = await Roadmap.findOne({
      slug: req.body.slug.toLowerCase().trim(),
      _id: { $ne: req.params.id }
    });
    if (conflicting) {
      throw new ApiError(409, "Roadmap slug already exists");
    }
    req.body.slug = req.body.slug.toLowerCase().trim();
  }

  const updateData = { ...req.body };

  if (updateData.topics !== undefined) {
    try {
      updateData.topics = sanitizeTopics(updateData.topics);
    } catch (error) {
      throw new ApiError(400, error.message);
    }
  }

  if (updateData.projects !== undefined) {
    updateData.projects = (updateData.projects || [])
      .map((project) => ({ title: String(project.title || "").trim() }))
      .filter((project) => project.title);
  }

  if (updateData.title !== undefined) updateData.title = String(updateData.title || "").trim();
  if (updateData.description !== undefined) updateData.description = String(updateData.description || "");
  if (updateData.category !== undefined) updateData.category = String(updateData.category || "").trim();
  if (updateData.difficulty !== undefined) updateData.difficulty = String(updateData.difficulty || "").trim();
  if (updateData.estimatedDuration !== undefined) updateData.estimatedDuration = String(updateData.estimatedDuration || "");

  const roadmap = await Roadmap.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  res.status(200).json({ success: true, data: roadmap });
});

exports.deleteRoadmap = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(400, "Invalid roadmap id");
  }

  const roadmap = await Roadmap.findByIdAndDelete(req.params.id);
  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  res.status(204).send();
});
