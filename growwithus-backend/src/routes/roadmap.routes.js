const express = require("express");
const {
  createRoadmap,
  getRoadmaps,
  getRoadmapBySlug,
  getRoadmapById,
  updateRoadmap,
  deleteRoadmap
} = require("../controllers/roadmap.controller");
const auth = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createRoadmapSchema,
  updateRoadmapSchema,
  roadmapIdParamSchema,
  roadmapSlugParamSchema,
  getRoadmapsQuerySchema
} = require("../validators/roadmap.validator");

const router = express.Router();

router.get("/", validate(getRoadmapsQuerySchema), getRoadmaps);
router.get("/slug/:slug", validate(roadmapSlugParamSchema), getRoadmapBySlug);
router.get("/:id", auth, allowRoles("student", "admin"), validate(roadmapIdParamSchema), getRoadmapById);
router.post("/", auth, allowRoles("admin"), validate(createRoadmapSchema), createRoadmap);
router.put("/:id", auth, allowRoles("admin"), validate(updateRoadmapSchema), updateRoadmap);
router.delete("/:id", auth, allowRoles("admin"), validate(roadmapIdParamSchema), deleteRoadmap);

module.exports = router;
