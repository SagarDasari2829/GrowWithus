const express = require("express");
const { getMe, getAllUsers } = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/me", auth, allowRoles("student", "admin"), getMe);
router.get("/", auth, allowRoles("admin"), getAllUsers);

module.exports = router;
