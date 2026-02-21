const express = require("express");
const { upsertProgress, getMyProgress } = require("../controllers/progress.controller");
const auth = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const { upsertProgressSchema } = require("../validators/progress.validator");

const router = express.Router();

router.get("/me", auth, allowRoles("student", "admin"), getMyProgress);
router.put("/", auth, allowRoles("student", "admin"), validate(upsertProgressSchema), upsertProgress);

module.exports = router;
