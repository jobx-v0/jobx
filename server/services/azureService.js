const axios = require("axios");
const {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
const ffmpeg = require("fluent-ffmpeg");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");
const path = require("path");
const InterviewService = require("./interviewService");

require("dotenv").config();

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
const credential = new DefaultAzureCredential();

class AzureServiceError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "AzureServiceError";
    this.code = code;
  }
}

const downloadBlob = async (sasUrl, downloadFilePath) => {
  try {
    const response = await axios.get(sasUrl, { responseType: "stream" });
    const writer = fs.createWriteStream(downloadFilePath);
    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    throw new AzureServiceError(
      `Failed to download blob: ${error.message}`,
      "DOWNLOAD_ERROR"
    );
  }
};

const extractAudio = (videoPath, audioPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(audioPath)
      .noVideo()
      .on("end", () => {
        console.log("Audio extracted successfully");
        resolve();
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err.message);
        console.error("FFmpeg stderr:", stderr);
        reject(
          new AzureServiceError(
            `Failed to extract audio: ${err.message}\nStderr: ${stderr}`,
            "EXTRACTION_ERROR"
          )
        );
      })
      .run();
  });
};

const transcribeAudio = async (audioPath) => {
  const subscriptionKey = process.env.AZURE_SPEECH_KEY;
  const serviceRegion = process.env.AZURE_SPEECH_REGION;

  if (!subscriptionKey || !serviceRegion) {
    throw new AzureServiceError(
      "Azure Speech Service credentials are missing",
      "CREDENTIALS_ERROR"
    );
  }

  console.log(`Starting transcription of audio file: ${audioPath}`);

  try {
    const audioConfig = sdk.AudioConfig.fromWavFileInput(
      fs.readFileSync(audioPath)
    );
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      subscriptionKey,
      serviceRegion
    );
    speechConfig.speechRecognitionLanguage = "en-US";

    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    return new Promise((resolve, reject) => {
      let transcription = "";

      recognizer.recognizing = (s, e) => {
        console.log(`RECOGNIZING: Text=${e.result.text}`);
      };

      recognizer.recognized = (s, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
          console.log(`RECOGNIZED: Text=${e.result.text}`);
          transcription += `${e.result.text} `;
        } else if (e.result.reason === sdk.ResultReason.NoMatch) {
          console.log("NOMATCH: Speech could not be recognized.");
        }
      };

      recognizer.canceled = (s, e) => {
        console.log(`CANCELED: Reason=${e.reason}`);
        if (e.reason === sdk.CancellationReason.Error) {
          reject(
            new AzureServiceError(
              `Transcription error: ${e.errorDetails}`,
              "TRANSCRIPTION_ERROR"
            )
          );
        }
        recognizer.stopContinuousRecognitionAsync();
      };

      recognizer.sessionStopped = (s, e) => {
        console.log("Session stopped event.");
        recognizer.stopContinuousRecognitionAsync(() => {
          console.log("Final transcription:", transcription.trim());
          resolve(transcription.trim());
        });
      };

      recognizer.startContinuousRecognitionAsync(
        () => {
          console.log("Recognition started");
        },
        (err) => {
          console.error("Error starting recognition:", err);
          reject(
            new AzureServiceError(
              `Failed to start recognition: ${err}`,
              "RECOGNITION_START_ERROR"
            )
          );
        }
      );
    });
  } catch (error) {
    console.error("Error in transcribeAudio:", error);
    throw new AzureServiceError(
      `Failed to transcribe audio: ${error.message}`,
      "TRANSCRIPTION_ERROR"
    );
  }
};

const uploadBlob = async (sasUrl, content) => {
  try {
    await axios.put(sasUrl, content, {
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": "text/plain",
      },
    });
    console.log(`Uploaded text blob successfully`);
  } catch (error) {
    throw new AzureServiceError(
      `Failed to upload blob: ${error.message}`,
      "UPLOAD_ERROR"
    );
  }
};

const generateSasTokenForBlob = async (blobName) => {
  try {
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credential
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    const startsOn = new Date();
    const expiresOn = new Date(startsOn);
    expiresOn.setHours(expiresOn.getHours() + 1);

    const userDelegationKey = await blobServiceClient.getUserDelegationKey(
      startsOn,
      expiresOn
    );

    const sasOptions = {
      containerName,
      permissions: BlobSASPermissions.parse("rw"),
      startsOn,
      expiresOn,
    };

    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      userDelegationKey,
      accountName
    ).toString();
    return `${blobClient.url}?${sasToken}`;
  } catch (error) {
    throw new AzureServiceError(
      `Failed to generate SAS token: ${error.message}`,
      "SAS_TOKEN_ERROR"
    );
  }
};

const processVideo = async (userId, jobId, questionId) => {
  const videoBlobName = `${userId}/${jobId}/${questionId}.webm`;
  const videoFilePath = path.join(__dirname, "video.webm");
  const audioFilePath = path.join(__dirname, "audio.wav");
  // const transcriptBlobName = `${userId}/${jobId}/${questionId}.txt`;

  try {
    console.log("Processing video...");

    const transcriptionExists =
      await InterviewService.checkExistingTranscription(
        userId,
        jobId,
        questionId
      );

    if (transcriptionExists) {
      console.log("Transcription already exists");
      return;
    }
    const videoSasUrl = await generateSasTokenForBlob(videoBlobName);
    console.log("Generated SAS URL:", videoSasUrl);
    await downloadBlob(videoSasUrl, videoFilePath);
    console.log("Downloaded video file successfully");
    await extractAudio(videoFilePath, audioFilePath);
    console.log("Extracted audio file successfully");
    const transcription = await transcribeAudio(audioFilePath);
    console.log("Transcribed audio file successfully");
    // const transcriptSasUrl = await generateSasTokenForBlob(
    //   userId,
    //   transcriptBlobName
    // );
    // await uploadBlob(transcriptSasUrl, transcription);
    await InterviewService.updateAnswer(
      userId,
      jobId,
      questionId,
      transcription
    );
    console.log("Updated answer successfully");
  } catch (error) {
    throw new AzureServiceError(
      `Failed to process video: ${error.message}`,
      "PROCESS_VIDEO_ERROR"
    );
  } finally {
    if (fs.existsSync(videoFilePath)) {
      fs.unlinkSync(videoFilePath);
    }
    if (fs.existsSync(audioFilePath)) {
      fs.unlinkSync(audioFilePath);
    }
  }
};

const processVideoForAllQuestions = async (userId, jobId) => {
  try {
    const questionIds = await InterviewService.getQuestionIds(userId, jobId);
    for (const questionId of questionIds) {
      console.log("Processing question:", questionId);
      await processVideo(userId, jobId, questionId);
    }
  } catch (error) {
    throw new AzureServiceError(
      `Failed to process videos for all questions: ${error.message}`,
      "PROCESS_ALL_VIDEOS_ERROR"
    );
  }
};

const AzureService = {
  generateSasTokenForBlob,
  processVideo,
  processVideoForAllQuestions,
};

module.exports = AzureService;
