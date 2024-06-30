const express = require("express");
const router = express.Router();
const openAIController = require("../controllers/openAIController");

router.post("/moderate", openAIController.moderateContent);
router.post(
  "/evaluateForOneQuestion",
  openAIController.evaluateTranscriptionForEachQuestion
);
router.post("/evaluate", openAIController.evaluateTranscriptionForAllQuestions);

module.exports = router;
