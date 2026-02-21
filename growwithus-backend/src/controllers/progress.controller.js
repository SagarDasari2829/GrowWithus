const mongoose = require("mongoose");
const Progress = require("../models/progress.model");
const Roadmap = require("../models/roadmap.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");

exports.upsertProgress = asyncHandler(async (req, res) => {
  const { roadmapId, completedModules = [], completionPercent = 0 } = req.body;

  if (!roadmapId || !mongoose.Types.ObjectId.isValid(roadmapId)) {
    throw new ApiError(400, "Valid roadmapId is required");
  }

  if (completionPercent < 0 || completionPercent > 100) {
    throw new ApiError(400, "completionPercent must be between 0 and 100");
  }

  const roadmapExists = await Roadmap.exists({ _id: roadmapId });
  if (!roadmapExists) {
    throw new ApiError(404, "Roadmap not found");
  }

  const progress = await Progress.findOneAndUpdate(
    { student: req.user.id, roadmap: roadmapId },
    {
      student: req.user.id,
      roadmap: roadmapId,
      completedModules,
      completionPercent,
      lastUpdatedAt: new Date()
    },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  ).populate("roadmap", "title category difficulty estimatedDuration");

  res.status(200).json({ success: true, data: progress });
});

exports.getMyProgress = asyncHandler(async (req, res) => {
  const progress = await Progress.find({ student: req.user.id })
    .populate("roadmap", "title category difficulty estimatedDuration")
    .sort({ updatedAt: -1 });

  res.status(200).json({ success: true, count: progress.length, data: progress });
});
