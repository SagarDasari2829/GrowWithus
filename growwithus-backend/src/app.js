const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const roadmapRoutes = require("./routes/roadmap.routes");
const progressRoutes = require("./routes/progress.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, status: "ok", service: "growwithus-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/progress", progressRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
