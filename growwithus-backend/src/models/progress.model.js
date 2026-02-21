const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roadmap: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap", required: true },
    completedModules: [{ type: String }],
    completionPercent: { type: Number, default: 0, min: 0, max: 100 },
    lastUpdatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

progressSchema.index({ student: 1, roadmap: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);
