const path = require("path");
const AzureService = require("../services/azureService");

const handleError = (res, error) => {
  console.error("Error:", error);
  const statusCode = error.name === "AzureServiceError" ? 500 : 400;
  res.status(statusCode).json({
    message: error.message,
    code: error.code || "UNKNOWN_ERROR",
  });
};

const handleTranscriptionForAllQuestions = async (req, res) => {
  const { user_id, job_id } = req.body;
  try {
    await AzureService.processVideoForAllQuestions(user_id, job_id);
    res
      .status(200)
      .json({ message: "Transcription process completed successfully." });
  } catch (error) {
    handleError(res, error);
  }
};

const handleTranscriptionForOneQuestion = async (req, res) => {
  const { userId, jobId, questionId } = req.body;
  try {
    await AzureService.processVideo(userId, jobId, questionId);
    res
      .status(200)
      .json({ message: "Transcription process completed successfully." });
  } catch (error) {
    handleError(res, error);
  }
};

const generateSasToken = async (req, res) => {
  const { userId, jobId, questionId } = req.params;
  try {
    const sasUrl = await AzureService.generateSasTokenForBlob(
      userId,
      `${userId}/${jobId}/${questionId}.webm`
    );
    res.json({ sasUrl });
  } catch (error) {
    handleError(res, error);
  }
};

const downloadAudio = async (req, res) => {
  const audioFilePath = path.join(__dirname, "audio.wav");
  try {
    await res.download(audioFilePath, "audio.wav");
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  generateSasToken,
  handleTranscriptionForOneQuestion,
  handleTranscriptionForAllQuestions,
  downloadAudio,
};
