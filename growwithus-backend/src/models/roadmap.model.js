const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    youtubeId: { type: String, required: true, trim: true, minlength: 11, maxlength: 11 },
    channel: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const topicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    practiceTask: { type: String, default: "", trim: true },
    videos: { type: [videoSchema], default: [] }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const roadmapSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    category: { type: String, required: true, trim: true },
    difficulty: { type: String, required: true, trim: true },
    estimatedDuration: { type: String, default: "", trim: true },
    topics: { type: [topicSchema], default: [] },
    projects: { type: [projectSchema], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false, default: null }
  },
  { timestamps: true }
);

roadmapSchema.index({ category: 1, difficulty: 1 });

module.exports = mongoose.model("Roadmap", roadmapSchema);
