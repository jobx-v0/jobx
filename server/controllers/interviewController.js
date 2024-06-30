const Interview = require("../models/Interview"); // Import the Interview model
const MAX_ATTEMPTS = process.env.MAX_ATTEMPTS || 5; // Default to 5 if not specified in .env
const Question = require("../models/Question");
const InterviewService = require("../services/interviewService");
const AzureService = require("../services/azureService");
const OpenAIService = require("../services/openAIService");

// Only for local mongo DB connection for testing
// const Questions = [
//     "What are you looking for in your next job?",
//      "What are your career goals for the next five years?",
//      "Describe a problem that you have solved using data. What did you enjoy about the process?"
// ]

const getQuestions = async (req, res) => {
  // res.json({ Questions }); // Use only for local mongo db connection
  try {
    // Fetch random questions, e.g., 3 questions
    const numberOfQuestions =
      parseInt(process.env.NUMBER_OF_QUESTIONS_IN_INTERVIEW) || 3;
    const randomQuestions = await Question.aggregate([
      { $sample: { size: numberOfQuestions } },
    ]);

    res.json({ Questions: randomQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching questions" });
  }
};

const submitInterview = async (req, res) => {
  const { userId, jobId } = req.body;
  try {
    // Trigger async processes
    triggerAsyncProcessing(userId, jobId);

    res.status(200).json({ message: "Interview submitted successfully" });
  } catch (error) {
    console.error("Error in interview submission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const triggerAsyncProcessing = async (userId, jobId) => {
  try {
    console.log(
      `Starting async processing for user ${userId} and job ${jobId}`
    );

    console.log("Processing videos...");
    await AzureService.processVideoForAllQuestions(userId, jobId);

    console.log("Evaluating transcriptions...");
    await OpenAIService.evaluateTranscriptionForAllQuestions(userId, jobId);

    console.log("Async processing completed successfully");
  } catch (error) {
    console.error("Error in async processing:", error);
    // Rethrow the error to be caught by the caller
    throw new Error(`Async processing failed: ${error.message}`);
  }
};

const updateAnswer = async (req, res) => {
  const { user_id, job_id, question_id, transcription } = req.body;
  try {
    await InterviewService.updateAnswer(
      user_id,
      job_id,
      question_id,
      transcription
    );
    res.status(200).json({ message: "Answer updated successfully." });
  } catch (error) {
    console.error("Error updating answer:", error);
    switch (error.message) {
      case "Interview not found":
      case "Question not found":
        res.status(404).json({ message: error.message });
        break;
      case "Answer already exists":
        res
          .status(409)
          .json({ message: "Answer already exists and cannot be updated." });
        break;
      default:
        res
          .status(500)
          .json({ message: "Failed to update answer. Please try again." });
    }
  }
};

const createInterview = async (req, res) => {
  const { user_id, job_id, question_ids } = req.body;

  try {
    await InterviewService.checkExistingInterview(user_id, job_id);

    const data = InterviewService.createInterviewData(question_ids);
    console.log("data: ", data);
    const interview = await InterviewService.saveInterview(
      user_id,
      job_id,
      data
    );

    res.status(201).json({
      message: "Interview created successfully",
      interview,
    });
  } catch (error) {
    console.error("Error creating interview:", error);
    if (error.message === "Interview already exists for this user and job") {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Error creating interview", error: error.message });
    }
  }
};

const getCurrentCountOfInterviews = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find existing interview data for the user
    let userInterview = await Interview.findOne({ user_id: userId });

    if (userInterview) {
      return res.status(200).json({ count: userInterview.interviews.length });
    }
    return res.status(200).json({ count: 0 });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to get the count data. Please try again" });
  }
};

const InterviewController = {
  getQuestions,
  submitInterview,
  getCurrentCountOfInterviews,
  createInterview,
  updateAnswer,
};

module.exports = InterviewController;
