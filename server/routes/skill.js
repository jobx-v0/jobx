const express = require("express");
const router = express.Router();
const SkillController = require("../controllers/skillController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

// Create a new skill
router.post("/skills", authMiddleware, isAdmin, SkillController.createSkill);

// Get all skills
router.get("/skills", authMiddleware, SkillController.getAllSkills);

// Get a single skill by ID
router.get("/skills/:id", authMiddleware, SkillController.getSkillById);

module.exports = router;
