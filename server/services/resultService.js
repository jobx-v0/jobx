const Result = require("../models/Result");

const saveResult = async (resultData) => {
  const newResult = new Result(resultData);
  return await newResult.save();
};

const findResultByInterviewId = async (interviewId) => {
  return await Result.findOne({ interview_id: interviewId });
};

const updateResult = async (interviewId, updateData) => {
  return await Result.findOneAndUpdate(
    { interview_id: interviewId },
    updateData,
    { new: true }
  );
};

const ResultService = {
  saveResult,
  findResultByInterviewId,
  updateResult,
};

module.exports = ResultService;
