const OpenAIService = require("../services/openAIService");

const handleError = (res, error) => {
  console.error("Error:", error);
  const statusCode = error.name === "OpenAIServiceError" ? 500 : 400;
  res.status(statusCode).json({
    message: error.message,
    code: error.code || "UNKNOWN_ERROR",
  });
};

const moderateContent = async (req, res) => {
  const { text } = req.body;

  try {
    const moderation = await OpenAIService.moderateContent(text);

    if (moderation.flagged) {
      return res.status(200).json({
        flagged: true,
        categories: moderation.categories,
        category_scores: moderation.category_scores,
      });
    } else {
      return res.status(200).json({
        flagged: false,
        categories: {},
        category_scores: {},
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

const evaluateTranscriptionForAllQuestions = async (req, res) => {
  const { userId, jobId } = req.body;
  console.log("userId, jobId", userId, jobId);

  try {
    const result = await OpenAIService.evaluateTranscriptionForAllQuestions(
      userId,
      jobId
    );
    console.log("Results for user and job:", userId, jobId, result);
    res.json({
      message: "Evaluation completed and results saved successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

const evaluateTranscriptionForEachQuestion = async (req, res) => {
  const { questionId, answer } = req.body;

  if (!questionId || !answer) {
    return res
      .status(400)
      .json({ error: "Question ID and answer are required for evaluation." });
  }

  try {
    const interviewText =
      await InterviewService.prepareInterviewTextForEachQuestion(
        questionId,
        answer
      );
    const result = await OpenAIService.evaluateAnswer(interviewText);
    res.json({
      message: "Evaluation completed successfully",
      result: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const openAIController = {
  moderateContent,
  evaluateTranscriptionForAllQuestions,
  evaluateTranscriptionForEachQuestion,
};

module.exports = openAIController;
