const Interview = require("../models/Interview");
const Question = require("../models/Question");

const checkExistingInterview = async (user_id, job_id) => {
  const existingInterview = await Interview.findOne({ user_id, job_id });
  if (existingInterview) {
    throw new Error("Interview already exists for this user and job");
  }
};

const createInterviewData = (question_ids) => {
  return question_ids.map((question_id) => ({
    question: question_id,
    answer: "",
  }));
};

const saveInterview = async (user_id, job_id, data) => {
  const interview = new Interview({
    user_id,
    job_id,
    data,
  });
  return await interview.save();
};

const updateAnswer = async (userId, jobId, questionId, transcription) => {
  // Find the specific interview document
  const interview = await Interview.findOne({ user_id: userId, job_id: jobId });

  if (!interview) {
    throw new Error("Interview not found");
  }

  // Find the specific question in the data array
  const questionIndex = interview.data.findIndex(
    (q) => q.question.toString() === questionId
  );

  if (questionIndex === -1) {
    throw new Error("Question not found");
  }

  // Check if the answer is empty
  if (interview.data[questionIndex].answer !== "") {
    throw new Error("Answer already exists");
  }

  // Update the "answer" field
  interview.data[questionIndex].answer = transcription;

  // Save the changes
  await interview.save();
};

const getInterviewText = async (userId, jobId) => {
  console.log("Preparing interview text for AI", userId, jobId);
  const interview = await Interview.findOne({
    user_id: userId,
    job_id: jobId,
  });
  data = interview.data;

  let interviewTexts = [];
  for (const { question, answer } of data) {
    const questionText = await Question.findById(question);
    interviewTexts.push({
      interviewId: interview._id,
      questionId: question,
      question: questionText.question,
      answer: answer,
    });
  }
  return interviewTexts;
};

const prepareInterviewTextForEachQuestion = async (questionId, answer) => {
  // Find the question by its ID
  const question = await Question.findById(questionId);

  // Prepare the interview text
  const interviewText = {
    question: question.question,
    answer: answer,
  };

  return interviewText;
};

const getQuestionIds = async (userId, jobId) => {
  const interview = await Interview.findOne({ user_id: userId, job_id: jobId });
  if (!interview) {
    throw new Error("Interview not found");
  }
  console.log("interview", interview);
  return interview.data.map((q) => q.question.toString());
};

const checkExistingTranscription = async (userId, jobId, questionId) => {
  const interview = await Interview.findOne({ user_id: userId, job_id: jobId });
  if (!interview) {
    throw new Error("Interview not found");
  }
  const questionIndex = interview.data.findIndex(
    (q) => q.question.toString() === questionId
  );
  if (questionIndex === -1) {
    throw new Error("Question not found");
  }
  if (interview.data[questionIndex].answer !== "") {
    return true;
  }
  return false;
};

const InterviewService = {
  checkExistingInterview,
  createInterviewData,
  saveInterview,
  updateAnswer,
  getInterviewText,
  prepareInterviewTextForEachQuestion,
  getQuestionIds,
  checkExistingTranscription,
};

module.exports = InterviewService;
